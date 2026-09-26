import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchOverlay } from '@/components/ui/search-overlay';
import { TabPageTransition } from '@/components/ui/tab-page-transition';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Medicine, useInventory } from '@/providers/inventory-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  Minus,
  Pill,
  Plus,
  Search,
  Tag,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Keyboard, Pressable, TextInput, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['all', 'chronic care', 'painkiller', 'antibiotic', 'syrup', 'first-aid'];

export default function CabinetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { medicines, patients, updateStock, deleteMedicine, getPatientById } = useInventory();

  const openMedicineDetails = (med: Medicine) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push({
      pathname: '/(tabs)/(home)/scan-result',
      params: {
        item: med.name,
        code: med.batchNumber,
        generic: med.generic,
      },
    });
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterPatientId, setFilterPatientId] = useState<string | 'all'>('all');
  const [sortByExpiry, setSortByExpiry] = useState(true);

  const activePatient =
    filterPatientId !== 'all' && filterPatientId !== 'unassigned'
      ? getPatientById(filterPatientId)
      : null;
  const activeFilterLabel =
    filterPatientId === 'all'
      ? 'filter'
      : filterPatientId === 'unassigned'
      ? 'unassigned'
      : activePatient?.name.split(' ')[0].toLowerCase() || 'filter';

  const handleOpenSearch = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    Keyboard.dismiss();
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Filtered & sorted medicines
  const filtered = medicines
    .filter((med) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        med.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.generic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPatient =
        filterPatientId === 'all' ||
        (filterPatientId === 'unassigned' && !med.assignedPatientId) ||
        med.assignedPatientId === filterPatientId;
      return matchesCategory && matchesSearch && matchesPatient;
    })
    .sort((a, b) => {
      if (sortByExpiry) {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    const exp = new Date(dateStr);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Expired', badgeBg: '#fee2e2', textColor: '#dc2626', urgent: true };
    }
    if (diffDays <= 30) {
      return { label: `Expires in ${diffDays}d`, badgeBg: '#fee2e2', textColor: '#dc2626', urgent: true };
    }
    if (diffDays <= 90) {
      return { label: `Expires in ${Math.round(diffDays / 30)}mo`, badgeBg: '#fef3c7', textColor: '#d97706', urgent: false };
    }
    return { label: `Valid until ${dateStr.slice(0, 7)}`, badgeBg: '#dcfce7', textColor: '#16a34a', urgent: false };
  };

  const handleStockChange = (id: string, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateStock(id, delta);
  };

  const handleDelete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteMedicine(id);
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Exact Consistent Header: Logo on Left, Search Button on Right ── */}
      <View
        className="bg-background pb-2"
        style={{
          paddingTop: Math.max(insets.top, 20) + 8,
          zIndex: 60,
        }}
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

            <TouchableOpacity
              onPress={handleOpenSearch}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{
                backgroundColor: 'rgba(204, 204, 204, 0.2)',
              }}
              accessibilityRole="button"
              accessibilityLabel="Search"
            >
              <Icon name={Search} size={18} color="#0f172a" />
            </TouchableOpacity>
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
                placeholder="Search medicines..."
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

      <TabPageTransition>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: insets.bottom + 32,
          }}
        >
        {/* ── Category Filter Pills (Relaxed, Clean & Spaced) ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            paddingRight: 16,
          }}
          style={{ marginBottom: 14 }}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
                activeOpacity={0.7}
                style={{
                  height: 38,
                  paddingHorizontal: 18,
                  marginRight: 10,
                  borderRadius: 9999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? '#2e67ff' : '#f8fafc', shadowColor: active ? '#2e67ff' : 'transparent', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: active ? 4 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? '700' : '500',
                    color: active ? '#ffffff' : '#475569',
                    includeFontPadding: false,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Subheader with Clean Shadcn DropdownMenu ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            paddingHorizontal: 2,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#64748b',
              includeFontPadding: false,
            }}
          >
            {filterPatientId === 'all'
              ? `all medicines (${filtered.length})`
              : `${filtered.length} for ${activeFilterLabel}`}
          </Text>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 9999,
                    backgroundColor: filterPatientId !== 'all' ? '#2e67ff' : '#f1f5f9',
                  }}
                >
                  {activePatient ? (
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color: activePatient.avatarColor,
                          textAlign: 'center',
                          includeFontPadding: false,
                        }}
                      >
                        {activePatient.name.charAt(0).toLowerCase()}
                      </Text>
                    </View>
                  ) : (
                    <Icon
                      name={Filter}
                      size={13}
                      color={filterPatientId !== 'all' ? '#ffffff' : '#2e67ff'}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: '600',
                      color: filterPatientId !== 'all' ? '#ffffff' : '#2e67ff',
                      marginHorizontal: 6,
                      includeFontPadding: false,
                    }}
                  >
                    {activeFilterLabel}
                  </Text>
                  <Icon
                    name={ChevronDown}
                    size={13}
                    color={filterPatientId !== 'all' ? '#ffffff' : '#2e67ff'}
                  />
                </View>
              }
            />

            <DropdownMenuContent width={235} align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>filter by patient</DropdownMenuLabel>

                <DropdownMenuItem
                  checked={filterPatientId === 'all'}
                  onSelect={() => setFilterPatientId('all')}
                  icon={
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: filterPatientId === 'all' ? '#2e67ff' : '#edf2fe',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        name={Users}
                        size={13}
                        color={filterPatientId === 'all' ? '#ffffff' : '#2e67ff'}
                      />
                    </View>
                  }
                >
                  all family
                </DropdownMenuItem>

                {patients.map((p) => {
                  const isSelected = filterPatientId === p.id;
                  return (
                    <DropdownMenuItem
                      key={p.id}
                      checked={isSelected}
                      onSelect={() => setFilterPatientId(p.id)}
                      icon={
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: p.avatarColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11.5,
                              fontWeight: '800',
                              color: '#ffffff',
                              textAlign: 'center',
                              includeFontPadding: false,
                            }}
                          >
                            {p.name.charAt(0).toLowerCase()}
                          </Text>
                        </View>
                      }
                    >
                      {p.name.split(' ')[0].toLowerCase()}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuItem
                  checked={filterPatientId === 'unassigned'}
                  onSelect={() => setFilterPatientId('unassigned')}
                  icon={
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: filterPatientId === 'unassigned' ? '#2e67ff' : '#f1f5f9',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        name={User}
                        size={13}
                        color={filterPatientId === 'unassigned' ? '#ffffff' : '#64748b'}
                      />
                    </View>
                  }
                >
                  unassigned
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel>sort order</DropdownMenuLabel>

                <DropdownMenuItem
                  checked={sortByExpiry}
                  onSelect={() => setSortByExpiry(true)}
                  icon={
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: sortByExpiry ? '#2e67ff' : '#f1f5f9',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        name={Calendar}
                        size={13}
                        color={sortByExpiry ? '#ffffff' : '#64748b'}
                      />
                    </View>
                  }
                >
                  expiry date
                </DropdownMenuItem>

                <DropdownMenuItem
                  checked={!sortByExpiry}
                  onSelect={() => setSortByExpiry(false)}
                  icon={
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: !sortByExpiry ? '#2e67ff' : '#f1f5f9',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        name={Clock}
                        size={13}
                        color={!sortByExpiry ? '#ffffff' : '#64748b'}
                      />
                    </View>
                  }
                >
                  name (a - z)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>

        {/* ── Medicine Inventory List (Borderless & Compact) ── */}
        <View className="gap-2.5">
          {filtered.length === 0 ? (
            <Card className="bg-card border-0 rounded-2xl p-8 items-center justify-center shadow-none">
              <Icon name={Pill} size={28} color="#8e8e93" />
              <Text className="text-sm font-semibold text-foreground mt-3" style={{ includeFontPadding: false }}>
                No medicines found
              </Text>
              <Text className="text-xs text-muted-foreground mt-1 text-center" style={{ includeFontPadding: false }}>
                Try adjusting your category or patient filter.
              </Text>
            </Card>
          ) : (
            filtered.map((med) => {
              const expStatus = getExpiryStatus(med.expiryDate);
              const assignedPatient = med.assignedPatientId ? getPatientById(med.assignedPatientId) : null;
              const isLowStock = med.remainingQuantity <= med.lowStockThreshold;
              const stockPercent = Math.min(
                Math.max((med.remainingQuantity / Math.max(med.totalQuantity, 1)) * 100, 0),
                100
              );

              return (
                <Animated.View key={med.id} entering={FadeInDown.duration(260)}>
                  <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none">
                    {/* Tappable Medicine Header & Details */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => openMedicineDetails(med)}
                    >
                      {/* Top Identity Row */}
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center flex-1 pr-2">
                          <View
                            className="w-10 h-10 rounded-2xl items-center justify-center mr-3 relative"
                            style={{
                              backgroundColor: isLowStock ? '#fee2e2' : '#edf2fe',
                            }}
                          >
                            <Icon
                              name={Pill}
                              size={19}
                              color={isLowStock ? '#ef4444' : '#2e67ff'}
                            />
                            {assignedPatient && (
                              <View
                                style={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  width: 17,
                                  height: 17,
                                  borderRadius: 8.5,
                                  backgroundColor: assignedPatient.avatarColor,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderWidth: 1.5,
                                  borderColor: '#ffffff',
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 9,
                                    fontWeight: '800',
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    includeFontPadding: false,
                                    lineHeight: 11,
                                  }}
                                >
                                  {assignedPatient.name.charAt(0).toLowerCase()}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-[15px] font-bold text-foreground"
                              style={{ includeFontPadding: false }}
                              numberOfLines={1}
                            >
                              {med.name.toLowerCase()}
                            </Text>
                            <Text
                              className="text-xs text-muted-foreground mt-0.5"
                              style={{ includeFontPadding: false }}
                              numberOfLines={1}
                            >
                              {med.generic.toLowerCase()} • {med.dosage.toLowerCase()}
                            </Text>
                          </View>
                        </View>

                        {/* Expiry Pill */}
                        <View
                          className="px-2.5 py-1 rounded-full shrink-0"
                          style={{ backgroundColor: expStatus.badgeBg }}
                        >
                          <Text
                            className="text-xs font-semibold"
                            style={{ color: expStatus.textColor, includeFontPadding: false }}
                          >
                            {expStatus.label.toLowerCase()}
                          </Text>
                        </View>
                      </View>

                      {/* Metadata Badges */}
                      <View className="flex-row items-center flex-wrap gap-1.5 mb-3">
                        <View className="bg-secondary/40 px-2.5 py-1 rounded-full">
                          <Text
                            className="text-xs font-medium text-foreground"
                            style={{ includeFontPadding: false }}
                          >
                            {med.category.toLowerCase()}
                          </Text>
                        </View>

                        {assignedPatient ? (
                          <View className="bg-secondary/40 pl-1.5 pr-2.5 py-1 rounded-full flex-row items-center gap-1.5">
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: assignedPatient.avatarColor,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: '800',
                                  color: '#ffffff',
                                  textAlign: 'center',
                                  includeFontPadding: false,
                                  lineHeight: 13,
                                }}
                              >
                                {assignedPatient.name.charAt(0).toLowerCase()}
                              </Text>
                            </View>
                            <Text
                              className="text-xs font-medium text-foreground"
                              style={{ includeFontPadding: false }}
                            >
                              {assignedPatient.name.split(' ')[0].toLowerCase()}
                            </Text>
                          </View>
                        ) : (
                          <View className="bg-secondary/40 px-2.5 py-1 rounded-full flex-row items-center gap-1">
                            <Icon name={User} size={11} color="#8e8e93" />
                            <Text
                              className="text-xs text-muted-foreground"
                              style={{ includeFontPadding: false }}
                            >
                              general
                            </Text>
                          </View>
                        )}

                        <View className="bg-secondary/40 px-2.5 py-1 rounded-full flex-row items-center gap-1">
                          <Icon name={MapPin} size={10} color="#8e8e93" />
                          <Text
                            className="text-[11px] text-muted-foreground"
                            style={{ includeFontPadding: false }}
                          >
                            {med.location}
                          </Text>
                        </View>

                        <View className="ml-auto">
                          <Text className="text-[10px] font-mono text-muted-foreground">
                            #{med.batchNumber}
                          </Text>
                        </View>
                      </View>

                      {/* Stock Progress Bar */}
                      <View className="w-full h-1.5 bg-secondary/60 rounded-full overflow-hidden mb-2.5">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${stockPercent}%`,
                            backgroundColor: isLowStock ? '#ef4444' : '#2e67ff',
                          }}
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Footer: Stock Counts & Quick Stepper */}
                    <View className="flex-row items-center justify-between pt-0.5">
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => openMedicineDetails(med)}
                        className="flex-1 pr-2"
                      >
                        <View className="flex-row items-baseline gap-1">
                          <Text
                            className={`text-base font-bold ${
                              isLowStock ? 'text-destructive' : 'text-foreground'
                            }`}
                            style={{ includeFontPadding: false }}
                          >
                            {med.remainingQuantity}
                          </Text>
                          <Text
                            className="text-xs text-muted-foreground font-medium"
                            style={{ includeFontPadding: false }}
                          >
                            / {med.totalQuantity} {med.unit} left
                          </Text>
                        </View>
                        {isLowStock && (
                          <View className="flex-row items-center gap-1 mt-0.5">
                            <Icon name={AlertTriangle} size={10} color="#ef4444" />
                            <Text
                              className="text-[10px] font-semibold text-destructive"
                              style={{ includeFontPadding: false }}
                            >
                              Low stock warning
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      {/* Pill increment / decrement buttons */}
                      <View className="flex-row items-center gap-1.5">
                        <TouchableOpacity
                          onPress={() => handleStockChange(med.id, -1)}
                          className="w-8 h-8 rounded-full bg-secondary/50 items-center justify-center active:opacity-60"
                          hitSlop={6}
                        >
                          <Icon name={Minus} size={13} color="#0e142b" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleStockChange(med.id, 1)}
                          className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center active:opacity-60"
                          hitSlop={6}
                        >
                          <Icon name={Plus} size={13} color="#2e67ff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDelete(med.id)}
                          className="w-8 h-8 rounded-full bg-secondary/40 items-center justify-center ml-0.5 active:opacity-60"
                          hitSlop={6}
                        >
                          <Icon name={Trash2} size={13} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>
      </TabPageTransition>

      {/* ── Search Overlay ── */}
      <SearchOverlay
        isVisible={isSearchOpen}
        searchQuery={searchQuery}
        onClose={handleCloseSearch}
        topOffset={Math.max(insets.top, 20) + 54}
      />
    </View>
  );
}
