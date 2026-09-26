import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useInventory } from '@/providers/inventory-context';
import { useSearch } from '@/providers/search-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Clock,
  Pill,
  Search as SearchIcon,
  User,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { searchText, setSearchText } = useSearch();
  const { medicines, patients, schedules, getPatientById } = useInventory();

  const [query, setQuery] = useState(searchText || '');

  const effectiveQuery = query.trim().toLowerCase();
  const hasQuery = effectiveQuery.length > 0;

  const matchedMeds = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(effectiveQuery) ||
      m.generic.toLowerCase().includes(effectiveQuery) ||
      m.category.toLowerCase().includes(effectiveQuery) ||
      m.batchNumber.toLowerCase().includes(effectiveQuery) ||
      m.location.toLowerCase().includes(effectiveQuery)
  );

  const matchedPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(effectiveQuery) ||
      p.relation.toLowerCase().includes(effectiveQuery) ||
      p.chronicConditions.some((c) => c.toLowerCase().includes(effectiveQuery)) ||
      p.allergies.some((a) => a.toLowerCase().includes(effectiveQuery))
  );

  const matchedSchedules = schedules.filter((s) => {
    const med = medicines.find((m) => m.id === s.medicineId);
    return (
      s.instructions.toLowerCase().includes(effectiveQuery) ||
      s.timeOfDay.toLowerCase().includes(effectiveQuery) ||
      (med && med.name.toLowerCase().includes(effectiveQuery))
    );
  });

  const totalResults = matchedMeds.length + matchedPatients.length + matchedSchedules.length;

  return (
    <View className="flex-1 bg-background">
      {/* Search Header */}
      <View
        className="px-5 pb-3.5 bg-background"
        style={{
          paddingTop: Math.max(insets.top + 8, 20),
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.05)',
        }}
      >
        <View className="w-full">
          <Input
            placeholder="Search medicines, formulas, members..."
            value={query}
            onChangeText={(val) => {
              setQuery(val);
              if (setSearchText) setSearchText(val);
            }}
            icon={SearchIcon}
            className="w-full"
            variant="filled"
            containerStyle={{
              borderRadius: 999,
              backgroundColor: '#ffffff',
              borderWidth: 0,
            }}
            rightComponent={
              query ? (
                <Pressable
                  onPress={() => {
                    setQuery('');
                    if (setSearchText) setSearchText('');
                  }}
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 36,
        }}
      >
        {!hasQuery ? (
          <View className="items-center justify-center py-28 px-4">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-3">
              <Icon name={SearchIcon} size={22} color="#2e67ff" />
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
            {/* Results Count */}
            <Text
              className="text-xs font-semibold text-muted-foreground mb-1"
              style={{ includeFontPadding: false }}
            >
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
            </Text>

            {/* Medicines */}
            {matchedMeds.length > 0 && (
              <View className="mb-2">
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-2"
                  style={{ includeFontPadding: false }}
                >
                  medicines ({matchedMeds.length})
                </Text>
                <View className="gap-2">
                  {matchedMeds.map((med) => (
                    <Animated.View key={med.id} entering={FadeInDown.duration(200)}>
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: '/(tabs)/(home)/scan-result',
                            params: {
                              item: med.name,
                              code: med.batchNumber,
                              generic: med.generic,
                            },
                          })
                        }
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
                    </Animated.View>
                  ))}
                </View>
              </View>
            )}

            {/* Family Members */}
            {matchedPatients.length > 0 && (
              <View className="mb-2">
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-2"
                  style={{ includeFontPadding: false }}
                >
                  family members ({matchedPatients.length})
                </Text>
                <View className="gap-2">
                  {matchedPatients.map((patient) => (
                    <Animated.View key={patient.id} entering={FadeInDown.duration(200)}>
                      <TouchableOpacity
                        onPress={() => router.push('/(tabs)/family')}
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
                    </Animated.View>
                  ))}
                </View>
              </View>
            )}

            {/* Doses */}
            {matchedSchedules.length > 0 && (
              <View className="mb-2">
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-2"
                  style={{ includeFontPadding: false }}
                >
                  doses & regimen ({matchedSchedules.length})
                </Text>
                <View className="gap-2">
                  {matchedSchedules.map((sched) => {
                    const med = medicines.find((m) => m.id === sched.medicineId);
                    const patient = getPatientById(sched.patientId);
                    return (
                      <Animated.View key={sched.id} entering={FadeInDown.duration(200)}>
                        <View
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
                          <View
                            className={`px-2.5 py-1 rounded-full ${
                              sched.takenToday ? 'bg-emerald-500/10' : 'bg-primary/10'
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-semibold ${
                                sched.takenToday ? 'text-emerald-600' : 'text-primary'
                              }`}
                              style={{ includeFontPadding: false }}
                            >
                              {sched.takenToday ? 'Taken' : 'Pending'}
                            </Text>
                          </View>
                        </View>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Empty results */}
            {totalResults === 0 && (
              <View className="items-center justify-center py-20 px-4">
                <Icon name={SearchIcon} size={36} color="#8e8e93" />
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
                  No items match &quot;{query}&quot;
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
