import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useInventory } from '@/providers/inventory-context';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { ChevronRight, Clock, Pill, Search } from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchOverlayProps {
  isVisible: boolean;
  searchQuery: string;
  onClose: () => void;
  topOffset?: number;
}

export function SearchOverlay({
  isVisible,
  searchQuery,
  onClose,
  topOffset,
}: SearchOverlayProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { medicines, patients, schedules, getPatientById } = useInventory();

  if (!isVisible) return null;

  const q = searchQuery.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const matchedMeds = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.generic.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.batchNumber.toLowerCase().includes(q)
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

  const computedTop = topOffset ?? Math.max(insets.top, 20) + 54;

  return (
    <Animated.View
      entering={FadeIn.duration(260).easing(Easing.out(Easing.cubic))}
      exiting={FadeOut.duration(200).easing(Easing.in(Easing.cubic))}
      style={[
        StyleSheet.absoluteFill,
        {
          top: computedTop,
          zIndex: 50,
        },
      ]}
    >
      {/* Frosted Translucent Blur */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 45 : 70}
        tint="light"
        style={StyleSheet.absoluteFill}
      />

      {/* Background matching header color */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#f4f6fa',
          },
        ]}
      />

      {/* Dismiss on backdrop tap */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!hasQuery ? (
          <View className="items-center justify-center py-28 px-4">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-3">
              <Icon name={Search} size={22} color="#2e67ff" />
            </View>
            <Text
              className="text-sm font-semibold text-foreground text-center"
              style={{ includeFontPadding: false }}
            >
              Type to search
            </Text>
            <Text
              className="text-xs text-muted-foreground mt-1 text-center max-w-[240px]"
              style={{ includeFontPadding: false }}
            >
              Search by medicine name, formula, batch number, or family member
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {/* Medicines Section */}
            {matchedMeds.length > 0 && (
              <View className="mb-2">
                <Text
                  className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2"
                  style={{ includeFontPadding: false }}
                >
                  Medicines ({matchedMeds.length})
                </Text>
                <View className="gap-2">
                  {matchedMeds.map((med) => (
                    <TouchableOpacity
                      key={med.id}
                      onPress={() => {
                        onClose();
                        router.push({
                          pathname: '/(tabs)/(home)/scan-result',
                          params: {
                            item: med.name,
                            code: med.batchNumber,
                            generic: med.generic,
                          },
                        });
                      }}
                      className="bg-card border border-border/40 rounded-[18px] p-3 flex-row items-center justify-between active:opacity-75"
                    >
                      <View className="flex-row items-center gap-3 flex-1 min-w-0 pr-2">
                        <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center shrink-0">
                          <Icon name={Pill} size={18} color="#2e67ff" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center gap-1.5">
                            <Text
                              className="text-sm font-bold text-foreground"
                              style={{ includeFontPadding: false }}
                              numberOfLines={1}
                            >
                              {med.name}
                            </Text>
                            <View className="bg-primary/10 px-1.5 py-0.5 rounded-md">
                              <Text
                                className="text-[9px] font-semibold text-primary"
                                style={{ includeFontPadding: false }}
                              >
                                {med.category}
                              </Text>
                            </View>
                          </View>
                          <Text
                            className="text-xs text-muted-foreground mt-0.5"
                            style={{ includeFontPadding: false }}
                            numberOfLines={1}
                          >
                            {med.generic} • {med.dosage}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end shrink-0">
                        <Text
                          className="text-xs font-bold text-foreground"
                          style={{ includeFontPadding: false }}
                        >
                          {med.remainingQuantity} {med.unit}
                        </Text>
                        <Text
                          className="text-[9px] text-muted-foreground"
                          style={{ includeFontPadding: false }}
                        >
                          in vault
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Family Members Section */}
            {matchedPatients.length > 0 && (
              <View className="mb-2">
                <Text
                  className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2"
                  style={{ includeFontPadding: false }}
                >
                  Family Members ({matchedPatients.length})
                </Text>
                <View className="gap-2">
                  {matchedPatients.map((patient) => (
                    <TouchableOpacity
                      key={patient.id}
                      onPress={() => {
                        onClose();
                        router.push('/(tabs)/family');
                      }}
                      className="bg-card border border-border/40 rounded-[18px] p-3 flex-row items-center justify-between active:opacity-75"
                    >
                      <View className="flex-row items-center gap-3 flex-1 min-w-0 pr-2">
                        <View
                          className="w-10 h-10 rounded-2xl items-center justify-center shrink-0"
                          style={{ backgroundColor: `${patient.avatarColor}20` }}
                        >
                          <Text
                            className="text-sm font-extrabold"
                            style={{ color: patient.avatarColor }}
                          >
                            {patient.name.charAt(0)}
                          </Text>
                        </View>
                        <View className="flex-1 min-w-0">
                          <Text
                            className="text-sm font-bold text-foreground"
                            style={{ includeFontPadding: false }}
                            numberOfLines={1}
                          >
                            {patient.name} ({patient.relation})
                          </Text>
                          <Text
                            className="text-xs text-muted-foreground mt-0.5"
                            style={{ includeFontPadding: false }}
                            numberOfLines={1}
                          >
                            {patient.chronicConditions.join(', ')}
                          </Text>
                        </View>
                      </View>
                      <Icon name={ChevronRight} size={16} color="#8e8e93" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Doses Section */}
            {matchedSchedules.length > 0 && (
              <View className="mb-2">
                <Text
                  className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2"
                  style={{ includeFontPadding: false }}
                >
                  Doses & Schedules ({matchedSchedules.length})
                </Text>
                <View className="gap-2">
                  {matchedSchedules.map((sched) => {
                    const med = medicines.find((m) => m.id === sched.medicineId);
                    const patient = getPatientById(sched.patientId);
                    return (
                      <View
                        key={sched.id}
                        className="bg-card border border-border/40 rounded-[18px] p-3 flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center gap-3 flex-1 min-w-0 pr-2">
                          <View className="w-10 h-10 rounded-2xl bg-secondary/60 items-center justify-center shrink-0">
                            <Icon name={Clock} size={17} color="#2e67ff" />
                          </View>
                          <View className="flex-1 min-w-0">
                            <Text
                              className="text-sm font-bold text-foreground"
                              style={{ includeFontPadding: false }}
                              numberOfLines={1}
                            >
                              {med ? med.name : 'Medication'} • {sched.timeLabel}
                            </Text>
                            <Text
                              className="text-xs text-muted-foreground mt-0.5"
                              style={{ includeFontPadding: false }}
                              numberOfLines={1}
                            >
                              {sched.instructions} ({patient?.name || 'General'})
                            </Text>
                          </View>
                        </View>
                        <View className={`px-2.5 py-1 rounded-full ${sched.takenToday ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                          <Text
                            className={`text-[10px] font-semibold ${sched.takenToday ? 'text-emerald-600' : 'text-primary'}`}
                            style={{ includeFontPadding: false }}
                          >
                            {sched.takenToday ? 'Taken' : 'Pending'}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Empty Results */}
            {matchedMeds.length === 0 &&
              matchedPatients.length === 0 &&
              matchedSchedules.length === 0 && (
                <View className="items-center justify-center py-20 px-4">
                  <Icon name={Search} size={36} color="#8e8e93" />
                  <Text
                    className="text-sm font-semibold text-foreground mt-3 text-center"
                    style={{ includeFontPadding: false }}
                  >
                    No matches found
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-1 text-center"
                    style={{ includeFontPadding: false }}
                  >
                    No medicines, family members, or doses match &quot;{searchQuery}&quot;
                  </Text>
                </View>
              )}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}
