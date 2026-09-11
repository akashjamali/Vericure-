import { AppLogo } from '@/components/ui/app-logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { DrugScannerModal } from '@/components/drug-scanner-modal';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Pill,
  ScanLine,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MinimalSearchResult {
  id: string;
  title: string;
  type: string;
  detail: string;
  batch?: string;
  generic?: string;
}

const SEARCH_ITEMS: MinimalSearchResult[] = [
  { id: '1', title: 'Augmentin 625mg', type: 'Medicines', detail: 'Verified Authentic • Batch #VN-89402', batch: 'VN-89402', generic: 'Amoxicillin & Clavulanate' },
  { id: '2', title: 'Panadol Extra 500mg', type: 'Medicines', detail: 'Verified Authentic • Batch #PX-20412', batch: 'PX-20412', generic: 'Paracetamol & Caffeine' },
  { id: '3', title: 'Nexium 40mg', type: 'Verified', detail: 'Cryptographic Security Seal Confirmed', batch: 'NX-11029', generic: 'Esomeprazole Magnesium' },
  { id: '4', title: 'Brufen 400mg', type: 'Medicines', detail: 'Verified Authentic • Batch #ABT-10293', batch: 'ABT-10293', generic: 'Ibuprofen' },
  { id: '5', title: 'Fake Cialis 20mg Alert', type: 'Counterfeit', detail: 'Reported Counterfeit Batch #CL-9901', batch: 'CL-9901', generic: 'Tadalafil (Counterfeit)' },
  { id: '6', title: 'Counterfeit Amoxicillin Batch #441', type: 'Counterfeit', detail: 'Public Health Recall Advisory', batch: 'AMX-4410', generic: 'Amoxicillin Trihydrate' },
  { id: '7', title: 'Glucophage 500mg', type: 'Medicines', detail: 'Verified Authentic • Batch #GL-7832', batch: 'GL-7832', generic: 'Metformin Hydrochloride' },
  { id: '8', title: 'Lipitor 20mg', type: 'Medicines', detail: 'Verified Authentic • Batch #LP-5521', batch: 'LP-5521', generic: 'Atorvastatin Calcium' },
];

const TOP_RECENT_SCANS = [
  {
    id: "1",
    name: "Augmentin 625mg",
    generic: "Amoxicillin & Clavulanate",
    batchNumber: "BNT-89240-PK",
    scannedAt: "Today, 2:15 PM",
    status: "verified" as const,
  },
  {
    id: "2",
    name: "Panadol Extra",
    generic: "Paracetamol & Caffeine",
    batchNumber: "GSK-44910-KHI",
    scannedAt: "Yesterday, 6:40 PM",
    status: "verified" as const,
  },
  {
    id: "3",
    name: "Brufen 400mg",
    generic: "Ibuprofen",
    batchNumber: "ABT-10293-LHR",
    scannedAt: "08 Sep, 11:20 AM",
    status: "verified" as const,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(88);
  const searchInputRef = useRef<TextInput>(null);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleOpenSearch = () => {
    triggerHaptic();
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    triggerHaptic();
    Keyboard.dismiss();
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectQuery = (item: MinimalSearchResult) => {
    triggerHaptic();
    Keyboard.dismiss();
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push({
      pathname: '/(tabs)/(home)/scan-result',
      params: {
        item: item.title,
        code: item.batch || 'BNT-89240-PK',
        generic: item.generic || 'Verified Active Formulation',
      },
    });
  };

  const quickActions = [
    { label: 'Medicines', icon: Pill, color: 'bg-emerald-500/10', iconColor: '#10b981' },
    { label: 'Verified', icon: ShieldCheck, color: 'bg-blue-500/10', iconColor: '#2e67ff' },
    { label: 'Counterfeit', icon: ShieldAlert, color: 'bg-red-500/10', iconColor: '#ef4444' },
    { label: 'Records', icon: FileText, color: 'bg-amber-500/10', iconColor: '#f59e0b' },
  ];

  // Minimal filtered search results - only compute when user types
  const q = searchQuery.trim().toLowerCase();
  const hasQuery = q.length > 0;
  const filteredItems = hasQuery
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.detail.toLowerCase().includes(q)
      )
    : [];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Medicines':
      case 'Medicine':
        return Pill;
      case 'Verified':
        return ShieldCheck;
      case 'Counterfeit':
        return ShieldAlert;
      case 'Records':
        return FileText;
      case 'Doctor':
        return Stethoscope;
      default:
        return Activity;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header Container - Clean minimalist, no bottom border, pure white mode */}
      <View
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        className="bg-background pb-2"
        style={{
          paddingTop: Math.max(insets.top, 20) + 8,
          zIndex: 60,
        }}
      >
        {!isSearchOpen ? (
          /* Normal Header: Code-based Logo on Left, Search Button on Right */
          <Animated.View
            entering={FadeIn.duration(280).easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(200).easing(Easing.in(Easing.cubic))}
            className="flex-row items-center justify-between px-5"
          >
            <View className="items-start">
              <AppLogo width={96} height={32} />
            </View>

            <Pressable
              onPress={handleOpenSearch}
              className="w-9 h-9 rounded-full bg-background items-center justify-center border border-border"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Search"
            >
              <Icon name={Search} size={17} color="#0e142b" />
            </Pressable>
          </Animated.View>
        ) : (
          /* Expanding Active Search Bar - Smooth, fluid transition */
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
      </View>

      {/* Main Home Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-2 pb-14 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Healthcare Categories */}
        <View>
          <Text
            className="text-foreground px-0.5"
            style={{
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              marginBottom: 12,
              includeFontPadding: false,
            }}
          >
            Services
          </Text>
          <View className="flex-row justify-between gap-2">
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                className="flex-1 items-center bg-card py-3 px-1 rounded-xl border border-border active:opacity-75"
                hitSlop={6}
                onPress={() => {
                  triggerHaptic();
                  setSearchQuery(action.label);
                  setIsSearchOpen(true);
                }}
              >
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${action.color}`}
                >
                  <Icon name={action.icon} size={22} color={action.iconColor} />
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    fontFamily: 'Inter_500Medium',
                    color: '#1e293b',
                    textAlign: 'center',
                    includeFontPadding: false,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Protect Your Health Card */}
        <Card className="bg-card border border-border rounded-xl p-4 shadow-none justify-center">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <Icon name={ShieldCheck} size={24} color="#2b65ff" />
            </View>
            <View className="flex-1 justify-center">
              <Text
                className="text-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                  includeFontPadding: false,
                }}
              >
                Protect your health
              </Text>
              <Text
                className="mt-0.5"
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  lineHeight: 18,
                  color: '#6B7280',
                  includeFontPadding: false,
                }}
              >
                Verify your medicine before use and make safer healthcare decisions
              </Text>
            </View>
          </View>
        </Card>

        {/* Scan Drug Authenticity Card - Clean Minimal */}
        <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
          <View className="gap-3.5">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
                <Icon name={ScanLine} size={24} color="#2b65ff" />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    includeFontPadding: false,
                  }}
                >
                  Scan Drug Authenticity
                </Text>
                <Text
                  className="mt-0.5"
                  style={{
                    fontSize: 13,
                    fontWeight: '400',
                    lineHeight: 18,
                    color: '#6B7280',
                    includeFontPadding: false,
                  }}
                >
                  Scan your medicine package to check whether it is genuine or potentially counterfeit
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                triggerHaptic();
                setIsScannerOpen(true);
              }}
              className="w-full h-11 rounded-full bg-[#2b65ff] flex-row items-center justify-center gap-2 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Open Scanner"
            >
              <Icon name={ScanLine} size={17} color="#ffffff" />
              <Text
                className="text-white"
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                  includeFontPadding: false,
                }}
              >
                Open Scanner
              </Text>
            </Pressable>
          </View>
        </Card>

        {/* My Medicine Cabinet Card */}
        <Pressable
          onPress={() => {
            triggerHaptic();
            router.push('/(tabs)/(home)/medicine-cabinet');
          }}
          accessibilityRole="button"
          accessibilityLabel="Open Medicine Cabinet"
          className="active:opacity-80"
        >
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none justify-center">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
                <Icon name={Pill} size={24} color="#2b65ff" />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-foreground"
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    fontFamily: 'Inter_600SemiBold',
                    includeFontPadding: false,
                  }}
                >
                  My Medicine Cabinet
                </Text>
                <Text
                  className="mt-0.5"
                  style={{
                    fontSize: 13,
                    fontWeight: '400',
                    lineHeight: 18,
                    color: '#6B7280',
                    includeFontPadding: false,
                  }}
                >
                  Save medicine, monitor expiry date, and keep your family medicine organized
                </Text>
              </View>
              <Icon name={ChevronRight} size={18} color="#94a3b8" />
            </View>
          </Card>
        </Pressable>

        {/* Recent Scans Section */}
        <View>
          <View className="flex-row items-center justify-between mb-3 px-0.5">
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
                triggerHaptic();
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
            {TOP_RECENT_SCANS.map((scan) => (
              <Pressable
                key={scan.id}
                onPress={() => {
                  triggerHaptic();
                  router.push({
                    pathname: '/(tabs)/(home)/scan-result',
                    params: { code: scan.batchNumber, item: scan.name },
                  });
                }}
                className="active:opacity-75"
              >
                <Card className="bg-card border border-border rounded-xl p-4 shadow-none justify-center">
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
            ))}
          </View>
        </View>

        {/* VeriCure Health Advisory Banner */}
        <Card className="bg-card border border-border rounded-xl p-4 shadow-none justify-center">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <Icon name={Sparkles} size={22} color="#2b65ff" />
            </View>
            <View className="flex-1 justify-center">
              <Text
                className="text-foreground"
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                  includeFontPadding: false,
                }}
              >
                Daily Wellness Tip
              </Text>
              <Text
                className="mt-0.5"
                style={{
                  fontSize: 13,
                  fontWeight: '400',
                  lineHeight: 18,
                  color: '#6B7280',
                  includeFontPadding: false,
                }}
              >
                Stay hydrated with at least 8 cups of water daily to maintain electrolyte balance and support cardiovascular health.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Pure Minimalist Search Overlay - No cards, no shadows, index.css tokens */}
      {isSearchOpen && (
        <Animated.View
          entering={FadeIn.duration(320).easing(Easing.out(Easing.cubic))}
          exiting={FadeOut.duration(240).easing(Easing.in(Easing.cubic))}
          style={[
            StyleSheet.absoluteFill,
            {
              top: headerHeight,
              zIndex: 50,
            },
          ]}
        >
          {/* Translucent Matte Glass Blur */}
          <BlurView
            intensity={Platform.OS === 'ios' ? 50 : 75}
            tint="light"
            style={StyleSheet.absoluteFill}
            blurMethod="dimezisBlurViewSdk31Plus"
          />

          {/* Matching header background */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: '#f4f6fa',
              },
            ]}
          />

          {/* Touch-outside to dismiss backdrop */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleCloseSearch}
          />

          {/* Simple Minimalist Results List - No Cards, Zero Shadows */}
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5 py-3 pb-16"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!hasQuery ? (
              /* Idle state when user has not typed anything */
              <View className="items-center justify-center py-24 px-4">
                <Text className="text-sm font-medium text-muted-foreground text-center">
                  Type to search
                </Text>
              </View>
            ) : filteredItems.length > 0 ? (
              /* Suggestions rendered only when user types */
              <View className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const ItemIcon = getItemIcon(item.type);

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleSelectQuery(item)}
                      className="flex-row items-center justify-between py-3.5 px-1 active:opacity-60"
                    >
                      <View className="flex-row items-center gap-3 flex-1 pr-3">
                        <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                          <Icon name={ItemIcon} size={15} color="#2e67ff" />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-sm font-medium text-foreground"
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          <Text
                            className="text-xs text-muted-foreground mt-0.5"
                            numberOfLines={1}
                          >
                            {item.detail}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs text-muted-foreground">
                          {item.type}
                        </Text>
                        <Icon name={ChevronRight} size={14} color="#a0a0a0" />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              /* No matches found for query */
              <View className="items-center justify-center py-20 px-4 gap-1">
                <Text className="text-sm font-medium text-foreground text-center">
                  No results found
                </Text>
                <Text className="text-xs text-muted-foreground text-center">
                  No matches for "{searchQuery}"
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* Drug Scanner Modal */}
      <DrugScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </View>
  );
}
