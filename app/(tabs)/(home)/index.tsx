import { DrugScannerModal } from '@/components/drug-scanner-modal';
import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { SearchOverlay } from '@/components/ui/search-overlay';
import { TabPageTransition } from '@/components/ui/tab-page-transition';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useInventory } from '@/providers/inventory-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Layers,
  Pill,
  Plus,
  ScanLine,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';

const TOP_RECENT_SCANS = [
  {
    id: '1',
    name: 'Augmentin 625mg',
    generic: 'Amoxicillin & Clavulanate',
    batchNumber: 'BNT-89240-PK',
    scannedAt: 'Today, 2:15 PM',
    status: 'verified' as const,
  },
  {
    id: '2',
    name: 'Panadol Extra',
    generic: 'Paracetamol & Caffeine',
    batchNumber: 'GSK-44910-KHI',
    scannedAt: 'Yesterday, 6:40 PM',
    status: 'verified' as const,
  },
  {
    id: '3',
    name: 'Brufen 400mg',
    generic: 'Ibuprofen',
    batchNumber: 'ABT-10293-LHR',
    scannedAt: '08 Sep, 11:20 AM',
    status: 'verified' as const,
  },
];
import { BlurView } from 'expo-blur';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useScrollContext } from '@/providers/scroll-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    householdName,
    patients,
    medicines,
    schedules,
    markDoseTaken,
    addMedicine,
    getPatientById,
  } = useInventory();

  const { headerTranslateY, tabBarTranslateY } = useScrollContext();
  const lastScrollY = useSharedValue(0);
  const HEADER_HEIGHT = 80;
  const TAB_BAR_HEIGHT = 90;

  const pulseAnim = useSharedValue(1);
  React.useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
      opacity: 0.5 + (pulseAnim.value - 1),
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      if (currentY < 0) return;

      const diff = currentY - lastScrollY.value;

      let newHeaderY = headerTranslateY.value - diff;
      let newTabBarY = tabBarTranslateY.value + diff;

      newHeaderY = Math.max(Math.min(newHeaderY, 0), -HEADER_HEIGHT);
      newTabBarY = Math.max(Math.min(newTabBarY, TAB_BAR_HEIGHT), 0);

      headerTranslateY.value = newHeaderY;
      tabBarTranslateY.value = newTabBarY;

      lastScrollY.value = currentY;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 60,
    };
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  const [scannerVisible, setScannerVisible] = useState(false);
  const [manualEntryVisible, setManualEntryVisible] = useState(false);

  const handleOpenSearch = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch { }
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch { }
    Keyboard.dismiss();
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Manual entry form state
  const [manualName, setManualName] = useState('');
  const [manualGeneric, setManualGeneric] = useState('');
  const [manualDosage, setManualDosage] = useState('500mg');
  const [manualCategory, setManualCategory] = useState<'Painkiller' | 'Antibiotic' | 'Chronic Care' | 'Syrup' | 'First-Aid'>('Chronic Care');
  const [manualQty, setManualQty] = useState('30');
  const [manualExpiry, setManualExpiry] = useState('2027-06-30');
  const [manualPatientId, setManualPatientId] = useState<string>('p1');

  // Stats
  const totalMeds = medicines.length;
  const expiringSoonCount = medicines.filter((m) => {
    const diff = new Date(m.expiryDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  }).length;
  const lowStockCount = medicines.filter((m) => m.remainingQuantity <= m.lowStockThreshold).length;

  const todayDoses = schedules;
  const pendingDoses = todayDoses.filter((s) => !s.takenToday);

  const q = searchQuery.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const matchedMeds = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.generic.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.batchNumber.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q)
  );

  const matchedPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.relation.toLowerCase().includes(q) ||
      p.chronicConditions.some((c) => c.toLowerCase().includes(q)) ||
      p.allergies.some((a) => a.toLowerCase().includes(q))
  );

  const matchedSchedules = schedules.filter((s) => {
    const med = medicines.find((m) => m.id === s.medicineId);
    return (
      s.instructions.toLowerCase().includes(q) ||
      s.timeOfDay.toLowerCase().includes(q) ||
      (med && med.name.toLowerCase().includes(q))
    );
  });

  const handleTakeDose = (scheduleId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markDoseTaken(scheduleId);
  };

  const handleSaveManualMedicine = () => {
    if (!manualName.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const qty = parseInt(manualQty, 10) || 20;
    addMedicine({
      name: manualName.trim(),
      generic: manualGeneric.trim() || 'Active Ingredient',
      dosage: manualDosage.trim(),
      category: manualCategory,
      batchNumber: `MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: manualExpiry.trim(),
      totalQuantity: qty,
      remainingQuantity: qty,
      unit: 'tablets',
      lowStockThreshold: 5,
      assignedPatientId: manualPatientId === 'none' ? undefined : manualPatientId,
      location: 'Main Cabinet',
      form: 'Tablet',
    });

    setManualName('');
    setManualGeneric('');
    setManualEntryVisible(false);
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.View
        className="bg-background pb-2"
        style={[
          animatedHeaderStyle,
          {
            paddingTop: Math.max(insets.top, 20) + 8,
          }
        ]}
      >
        {!isSearchOpen ? (
          <Animated.View
            entering={FadeIn.duration(280).easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(200).easing(Easing.in(Easing.cubic))}
            className="flex-row items-center justify-between px-5"
          >
            <View className="items-start">
              <AppLogo width={106} height={32} />
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(280).easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(200).easing(Easing.in(Easing.cubic))}
            className="flex-row items-center gap-2.5 px-5"
          >
            <View className="flex-1">
              <Input
                ref={searchInputRef}
                icon={Search}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                variant="filled"
                containerStyle={{
                  borderRadius: 999,
                  borderWidth: 0,
                  backgroundColor: '#ffffff',
                }}
                rightComponent={
                  searchQuery ? (
                    <Pressable
                      onPress={() => setSearchQuery('')}
                      hitSlop={8}
                      className="pr-1"
                    >
                      <View className="w-5 h-5 rounded-full bg-muted items-center justify-center">
                        <Icon name={X} size={12} color="#0e142b" />
                      </View>
                    </Pressable>
                  ) : null
                }
              />
            </View>

            <Pressable
              onPress={handleCloseSearch}
              hitSlop={8}
              className="py-2 px-1"
            >
              <Text className="text-sm font-semibold text-primary">
                Cancel
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </Animated.View>

      <TabPageTransition>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: Math.max(insets.top, 20) + 72,
            paddingBottom: insets.bottom + 28,
          }}
        >
          {/* ── Search Container (same as Family banner) ── */}
          <Animated.View
            entering={FadeInDown.duration(300)}
            className="w-full relative px-5 pt-8 pb-7 mb-6 mt-2"
            style={{ backgroundColor: '#dbeafe', borderRadius: 24, zIndex: 10 }}
          >
            {/* Decorative background layer */}
            <View
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: 24, overflow: 'hidden', zIndex: 0,
              }}
              pointerEvents="none"
            >
              {/* Arc lines */}
              <View style={{ position: 'absolute', top: -10, left: 10, width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#1e293b', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '-45deg' }], opacity: 0.15 }} />
              <View style={{ position: 'absolute', bottom: 30, right: 10, width: 90, height: 90, borderRadius: 45, borderWidth: 1, borderColor: '#1e293b', borderTopColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '15deg' }], opacity: 0.15 }} />

              {/* Plus signs */}
              <Text style={{ position: 'absolute', top: 75, left: 25, fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
              <Text style={{ position: 'absolute', top: 25, right: 90, fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
              <Text style={{ position: 'absolute', bottom: 65, right: 20, fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
              <Text style={{ position: 'absolute', top: 100, right: '25%', fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
            </View>

            {/* Foreground text */}
            <View className="items-center mt-6 mb-8" style={{ zIndex: 1, paddingHorizontal: 10 }}>
              <Text className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Inter_700Bold' }}>
                Search medicines
              </Text>
              <Text
                className="font-black text-red-600 mt-1 text-center"
                style={{
                  fontFamily: 'Inter_800ExtraBold',
                  letterSpacing: 1,
                  fontSize: 32,
                  lineHeight: 40,
                  paddingTop: 4,
                  includeFontPadding: false,
                }}
              >
                QUICKLY
              </Text>
              <Text className="text-sm font-medium text-slate-700 mt-2">
                Search by name, batch, patient or category
              </Text>
            </View>

            {/* Search bar — same style as family "Add Member" bar */}
            <Pressable
              onPress={handleOpenSearch}
              className="w-full h-12 bg-white rounded-[14px] flex-row items-center px-4 active:opacity-80"
              style={{ borderWidth: 1, borderColor: '#e2e8f0', zIndex: 1 }}
            >
              <Icon name={Search} size={18} color="#94a3b8" />
              <Text className="ml-3 text-slate-300 font-medium text-sm">Search...</Text>
            </Pressable>
          </Animated.View>

          {/* ── Quick Actions Row ── */}
          <Animated.View entering={FadeInDown.duration(300).delay(30)} className="flex-row gap-3 mb-4">
            {/* Scan Button (Red) */}
            <Pressable
              onPress={() => {
                try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch { }
                setScannerVisible(true);
              }}
              className="flex-1 rounded-2xl items-center justify-center py-5 px-2 active:opacity-80"
              style={{ backgroundColor: '#fee2e2' }}
            >
              <Icon name={ScanLine} size={26} color="#ef4444" />
              <Text className="mt-3 text-[13px] font-semibold text-slate-700">Scan</Text>
            </Pressable>

            {/* Manual Add (Blue) */}
            <Pressable
              onPress={() => {
                try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch { }
                setManualEntryVisible(true);
              }}
              className="flex-1 rounded-2xl items-center justify-center py-5 px-2 active:opacity-80"
              style={{ backgroundColor: '#dbeafe' }}
            >
              <Icon name={Plus} size={26} color="#3b82f6" />
              <Text className="mt-3 text-[13px] font-semibold text-slate-700">Manual</Text>
            </Pressable>

            {/* Vault (Green) */}
            <Pressable
              onPress={() => {
                try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch { }
                router.push('/(tabs)/cabinet');
              }}
              className="flex-1 rounded-2xl items-center justify-center py-5 px-2 active:opacity-80"
              style={{ backgroundColor: '#dcfce7' }}
            >
              <Icon name={Layers} size={26} color="#22c55e" />
              <Text className="mt-3 text-[13px] font-semibold text-slate-700">Vault</Text>
            </Pressable>
          </Animated.View>

          {/* ── Clean Stats Grid (Borderless) ── */}
          <Animated.View entering={FadeInDown.duration(300).delay(50)} className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-card border-0 rounded-2xl p-4 items-center">
              <Icon name={Layers} size={18} color="#2e67ff" className="mb-2" />
              <Text className="text-xl font-bold text-foreground" style={{ includeFontPadding: false }}>{totalMeds}</Text>
              <Text className="text-[11px] font-medium text-muted-foreground mt-1">Total</Text>
            </View>
            <View className="flex-1 bg-card border-0 rounded-2xl p-4 items-center">
              <Icon name={Clock} size={18} color="#dc2626" className="mb-2" />
              <Text className="text-xl font-bold text-destructive" style={{ includeFontPadding: false }}>{expiringSoonCount}</Text>
              <Text className="text-[11px] font-medium text-muted-foreground mt-1">Expiring</Text>
            </View>
            <View className="flex-1 bg-card border-0 rounded-2xl p-4 items-center">
              <Icon name={Pill} size={18} color="#d97706" className="mb-2" />
              <Text className="text-xl font-bold text-amber-600" style={{ includeFontPadding: false }}>{lowStockCount}</Text>
              <Text className="text-[11px] font-medium text-muted-foreground mt-1">Low stock</Text>
            </View>
          </Animated.View>

          {/* ── Minimal Family Strip ── */}
          <Animated.View entering={FadeInDown.duration(300).delay(80)} className="mb-8">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text className="text-sm font-semibold text-foreground">Family</Text>
              <Pressable
                onPress={() => router.push('/(tabs)/family')}
                hitSlop={8}
                className="active:opacity-60"
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    color: '#2b65ff',
                    includeFontPadding: false,
                  }}
                >
                  Manage
                </Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
              <View className="flex-row gap-4">
                {patients.length === 0 ? (
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/family')}
                    activeOpacity={0.7}
                    className="flex-row items-center bg-card rounded-2xl px-4 py-3 gap-3 border-0 active:opacity-75"
                  >
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                      <Icon name={Plus} size={18} color="#2e67ff" />
                    </View>
                    <View>
                      <Text className="text-xs font-semibold text-foreground" style={{ includeFontPadding: false }}>
                        Add family member
                      </Text>
                      <Text className="text-[11px] text-muted-foreground mt-0.5" style={{ includeFontPadding: false }}>
                        Track prescriptions together
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  patients.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => router.push('/(tabs)/family')}
                      className="items-center w-14"
                    >
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        <Text className="text-sm font-bold text-white">{p.name.charAt(0)}</Text>
                      </View>
                      <Text className="text-xs font-semibold text-foreground text-center" numberOfLines={1}>
                        {p.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          </Animated.View>

          {/* ── Professional Compact Dosage Schedule (Borderless) ── */}
          <Animated.View entering={FadeInDown.duration(300).delay(110)} className="mb-7">
            <View className="flex-row items-center justify-between mb-2.5 px-1">
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    includeFontPadding: false,
                  }}
                >
                  {"Today's doses"}
                </Text>
                {pendingDoses.length > 0 && (
                  <View className="px-2 py-0.5 rounded-full bg-primary/10">
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: '#2e67ff',
                        includeFontPadding: false,
                      }}
                    >
                      {pendingDoses.length} left
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="gap-2">
              {todayDoses.length === 0 ? (
                <Card className="bg-card border-0 rounded-2xl p-4 items-center justify-center shadow-none">
                  <View className="flex-row items-center gap-2">
                    <Icon name={Pill} size={16} color="#94a3b8" />
                    <Text className="text-xs text-muted-foreground font-medium" style={{ includeFontPadding: false }}>
                      No doses scheduled for today
                    </Text>
                  </View>
                </Card>
              ) : (
                todayDoses.map((sched) => {
                const patient = getPatientById(sched.patientId);
                const med = medicines.find((m) => m.id === sched.medicineId);

                return (
                  <Pressable
                    key={sched.id}
                    onPress={() => !sched.takenToday && handleTakeDose(sched.id)}
                    className={`bg-card rounded-2xl p-3.5 flex-row items-center justify-between border-0 shadow-none ${sched.takenToday ? 'opacity-60' : 'active:opacity-85'}`}
                  >
                    <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
                        style={{
                          backgroundColor: sched.takenToday ? 'rgba(16, 185, 129, 0.1)' : 'rgba(46, 103, 255, 0.1)',
                        }}
                      >
                        <Icon
                          name={Pill}
                          size={18}
                          color={sched.takenToday ? '#10b981' : '#2e67ff'}
                        />
                      </View>

                      <View className="flex-1 min-w-0 justify-center">
                        <View className="flex-row items-center gap-1.5">
                          <Text
                            className="text-foreground"
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              fontFamily: 'Inter_600SemiBold',
                              includeFontPadding: false,
                            }}
                            numberOfLines={1}
                          >
                            {med ? med.name : 'Prescription'}
                          </Text>
                          {patient && (
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: '500',
                                color: '#2e67ff',
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              • {patient.name.split(' ')[0]}
                            </Text>
                          )}
                        </View>

                        <Text
                          className="text-muted-foreground text-xs mt-0.5"
                          style={{
                            includeFontPadding: false,
                          }}
                          numberOfLines={1}
                        >
                          {sched.timeLabel} • {sched.instructions}
                        </Text>
                      </View>
                    </View>

                    {sched.takenToday ? (
                      <View className="px-2.5 py-1 rounded-full bg-emerald-500/10 flex-row items-center gap-1 shrink-0">
                        <Icon name={CheckCircle2} size={13} color="#10b981" />
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: '#10b981',
                            includeFontPadding: false,
                          }}
                        >
                          Done
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleTakeDose(sched.id)}
                        hitSlop={8}
                        className="px-3 py-1.5 rounded-full bg-primary flex-row items-center gap-1 shrink-0 active:opacity-85"
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color: '#ffffff',
                            includeFontPadding: false,
                          }}
                        >
                          Take
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Pressable>
                );
              }))}
            </View>
          </Animated.View>

          {/* ── Professional Alerts (Borderless & Minimal) ── */}
          <Animated.View entering={FadeInDown.duration(300).delay(140)} className="mb-7">
            <View className="flex-row items-center justify-between mb-2.5 px-1">
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    includeFontPadding: false,
                  }}
                >
                  Alerts
                </Text>
                {expiringSoonCount + lowStockCount > 0 && (
                  <View className="px-2 py-0.5 rounded-full bg-destructive/10">
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: '#ff6c35',
                        includeFontPadding: false,
                      }}
                    >
                      {expiringSoonCount + lowStockCount} action item{expiringSoonCount + lowStockCount > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="gap-2">
              {expiringSoonCount === 0 && lowStockCount === 0 ? (
                <Card className="bg-card border-0 rounded-2xl p-4 items-center justify-center shadow-none">
                  <View className="flex-row items-center gap-2">
                    <Icon name={CheckCircle2} size={16} color="#10b981" />
                    <Text className="text-xs text-muted-foreground font-medium" style={{ includeFontPadding: false }}>
                      No alerts • All medicines are in safe standing
                    </Text>
                  </View>
                </Card>
              ) : (
                <>
                  {medicines
                    .filter((m) => {
                      const diff = new Date(m.expiryDate).getTime() - new Date().getTime();
                      return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
                    })
                    .map((m) => (
                      <Pressable
                        key={`exp-${m.id}`}
                        onPress={() => {
                          try {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          } catch { }
                          router.push('/(tabs)/cabinet');
                        }}
                        className="bg-card rounded-2xl p-3.5 flex-row items-center justify-between border-0 shadow-none active:opacity-85"
                      >
                        <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
                          <View
                            className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
                            style={{ backgroundColor: 'rgba(255, 108, 53, 0.1)' }}
                          >
                            <Icon name={Clock} size={18} color="#ff6c35" />
                          </View>
                          <View className="flex-1 min-w-0 justify-center">
                            <Text
                              className="text-foreground"
                              style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'Inter_600SemiBold',
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              {m.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: '#ff6c35',
                                marginTop: 2,
                                fontWeight: '500',
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              Expiring soon • {m.expiryDate}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-1 shrink-0">
                          <View className="px-2.5 py-1 rounded-full bg-destructive/10">
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '600',
                                color: '#ff6c35',
                                includeFontPadding: false,
                              }}
                            >
                              Inspect
                            </Text>
                          </View>
                          <Icon name={ChevronRight} size={14} color="#94a3b8" />
                        </View>
                      </Pressable>
                    ))}

                  {medicines
                    .filter((m) => m.remainingQuantity <= m.lowStockThreshold)
                    .map((m) => (
                      <Pressable
                        key={`stock-${m.id}`}
                        onPress={() => {
                          try {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          } catch { }
                          router.push('/(tabs)/cabinet');
                        }}
                        className="bg-card rounded-2xl p-3.5 flex-row items-center justify-between border-0 shadow-none active:opacity-85"
                      >
                        <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
                          <View
                            className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
                            style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                          >
                            <Icon name={Pill} size={18} color="#d97706" />
                          </View>
                          <View className="flex-1 min-w-0 justify-center">
                            <Text
                              className="text-foreground"
                              style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'Inter_600SemiBold',
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              {m.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: '#d97706',
                                marginTop: 2,
                                fontWeight: '500',
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              {m.remainingQuantity} {m.unit} left • Refill needed
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-1 shrink-0">
                          <View className="px-2.5 py-1 rounded-full bg-amber-500/10">
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '600',
                                color: '#d97706',
                                includeFontPadding: false,
                              }}
                            >
                              Refill
                            </Text>
                          </View>
                          <Icon name={ChevronRight} size={14} color="#94a3b8" />
                        </View>
                      </Pressable>
                    ))}
                </>
              )}
            </View>
          </Animated.View>

          {/* ── Original Recent Scans Section (Borderless) ── */}
          <Animated.View entering={FadeInDown.duration(300).delay(170)} className="mb-4">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text
                className="text-foreground"
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                  includeFontPadding: false,
                }}
              >
                Recent scans
              </Text>
              <Pressable
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch { }
                  router.push('/(tabs)/(home)/recent-scans');
                }}
                hitSlop={8}
                className="active:opacity-60"
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    color: '#2b65ff',
                    includeFontPadding: false,
                  }}
                >
                  See all
                </Text>
              </Pressable>
            </View>

            <View className="gap-2.5">
              {TOP_RECENT_SCANS.length === 0 ? (
                <Card className="bg-card border-0 rounded-2xl p-5 items-center justify-center shadow-none">
                  <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mb-2">
                    <Icon name={ShieldCheck} size={20} color="#2b65ff" />
                  </View>
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    No recent scans
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-1 text-center"
                    style={{ includeFontPadding: false }}
                  >
                    Scanned medicines will appear here
                  </Text>
                </Card>
              ) : (
                TOP_RECENT_SCANS.map((scan) => (
                  <Pressable
                    key={scan.id}
                    onPress={() => {
                      try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      } catch { }
                      router.push({
                        pathname: '/(tabs)/(home)/scan-result',
                        params: { code: scan.batchNumber, item: scan.name },
                      });
                    }}
                    className="active:opacity-75"
                  >
                    <Card className="bg-card border-0 rounded-2xl p-4 shadow-none justify-center">
                      <View className="flex-row items-center justify-between">
                        {/* Icon + Text */}
                        <View className="flex-row items-center gap-3.5 flex-1 min-w-0 mr-3">
                          <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
                            <Icon name={ShieldCheck} size={20} color="#2b65ff" />
                          </View>
                          <View className="flex-1 min-w-0 justify-center">
                            <Text
                              className="text-foreground"
                              style={{
                                fontSize: 14,
                                fontWeight: '600',
                                fontFamily: 'Inter_600SemiBold',
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              {scan.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: '400',
                                color: '#6B7280',
                                marginTop: 2,
                                includeFontPadding: false,
                              }}
                              numberOfLines={1}
                            >
                              #{scan.batchNumber} • {scan.scannedAt}
                            </Text>
                          </View>
                        </View>

                        {/* Status indicator + Chevron */}
                        <View className="flex-row items-center gap-2 shrink-0">
                          <View className="px-2.5 py-1 rounded-full bg-emerald-500/10 flex-row items-center gap-1.5">
                            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '600',
                                fontFamily: 'Inter_600SemiBold',
                                color: '#10b981',
                                includeFontPadding: false,
                              }}
                            >
                              Verified
                            </Text>
                          </View>
                          <Icon name={ChevronRight} size={16} color="#94a3b8" />
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                ))
              )}
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </TabPageTransition>

      {/* ── Search Overlay ── */}
      <SearchOverlay
        isVisible={isSearchOpen}
        searchQuery={searchQuery}
        onClose={handleCloseSearch}
        topOffset={Math.max(insets.top, 20) + 54}
      />

      {/* ── Modals ── */}
      <DrugScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
      />

      {/* ── Relaxed Professional Floating Popup ── */}
      <Modal visible={manualEntryVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setManualEntryVisible(false)}
          className="flex-1 bg-black/50 items-center justify-center p-6"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card rounded-[28px] p-5 "
          >
            <View className="gap-2.5">
              <TextInput
                value={manualName}
                onChangeText={setManualName}
                placeholder="Medicine name"
                placeholderTextColor="#94a3b8"
                className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                style={{ height: 44, includeFontPadding: false }}
              />

              <TextInput
                value={manualGeneric}
                onChangeText={setManualGeneric}
                placeholder="Formula or generic formula"
                placeholderTextColor="#94a3b8"
                className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                style={{ height: 44, includeFontPadding: false }}
              />

              <View className="flex-row gap-2.5">
                <TextInput
                  value={manualQty}
                  onChangeText={setManualQty}
                  placeholder="Qty"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                  className="w-20 bg-background rounded-full px-3 text-sm text-foreground font-medium text-center"
                  style={{ height: 44, includeFontPadding: false }}
                />
                <TextInput
                  value={manualExpiry}
                  onChangeText={setManualExpiry}
                  placeholder="Expiry (YYYY-MM-DD)"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 bg-background rounded-full px-4 text-sm text-foreground font-medium"
                  style={{ height: 44, includeFontPadding: false }}
                />
              </View>

              <View className="pt-1">
                <Text
                  className="text-xs text-muted-foreground font-medium mb-2 px-1"
                  style={{ includeFontPadding: false }}
                >
                  Assign to family member
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1">
                  <View className="flex-row gap-1.5">
                    {patients.length === 0 ? (
                      <Text
                        className="text-xs text-muted-foreground px-1"
                        style={{ includeFontPadding: false }}
                      >
                        No family members yet • Save as general medicine
                      </Text>
                    ) : (
                      patients.map((p) => {
                        const active = manualPatientId === p.id;
                        const dotColor = active ? '#ffffff' : p.avatarColor;
                        return (
                          <TouchableOpacity
                            key={p.id}
                            onPress={() => setManualPatientId(p.id)}
                            className={`px-3.5 py-1.5 rounded-full flex-row items-center gap-1.5 ${
                              active ? 'bg-primary' : 'bg-background'
                            }`}
                          >
                            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                            <Text
                              className={`text-xs font-semibold ${
                                active ? 'text-white' : 'text-foreground'
                              }`}
                              style={{ includeFontPadding: false }}
                            >
                              {p.name.split(' ')[0]}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                </ScrollView>
              </View>

              <View className="flex-row gap-2.5 pt-2">
                <TouchableOpacity
                  onPress={() => setManualEntryVisible(false)}
                  className="flex-1 rounded-full items-center justify-center bg-background active:opacity-75"
                  style={{ height: 40 }}
                >
                  <Text
                    className="text-xs font-semibold text-muted-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveManualMedicine}
                  className="flex-[1.5] rounded-full items-center justify-center bg-primary active:opacity-90"
                  style={{ height: 40 }}
                >
                  <Text
                    className="text-xs font-semibold text-white"
                    style={{ includeFontPadding: false }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
