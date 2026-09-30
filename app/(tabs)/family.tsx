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
import {
  Heart,
  Pill,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RELATION_PRESETS = ['Father', 'Mother', 'Spouse', 'Child', 'Self', 'Other'];

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const {
    householdName,
    patients,
    addPatient,
    deletePatient,
    getMedicinesForPatient,
  } = useInventory();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [relationInput, setRelationInput] = useState('Father');
  const [ageInput, setAgeInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');


  const glowValue = useSharedValue(0.3);

  React.useEffect(() => {
    glowValue.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowValue.value,
      transform: [{ scale: 1 + glowValue.value * 0.05 }],
    };
  });

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
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleCreatePatient = () => {
    if (!nameInput.trim()) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const chronicArr = conditionInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const allergyArr = allergyInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addPatient({
      name: nameInput.trim(),
      relation: relationInput,
      age: parseInt(ageInput, 10) || 30,
      gender: 'Male',
      role: 'member',
      avatarColor: '#8b5cf6',
      chronicConditions: chronicArr.length > 0 ? chronicArr : ['General Health'],
      allergies: allergyArr,
    });

    setNameInput('');
    setAgeInput('');
    setConditionInput('');
    setAllergyInput('');
    setAddModalVisible(false);
  };

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.relation.toLowerCase().includes(q) ||
      p.chronicConditions.some((c) => c.toLowerCase().includes(q)) ||
      p.allergies.some((a) => a.toLowerCase().includes(q))
    );
  });

  return (
    <View className="flex-1 bg-background">
      {/* Top App Bar */}
      <View
        className="px-5 pb-2"
        style={{
          paddingTop: Math.max(insets.top + 8, 16),
          minHeight: 52,
          justifyContent: 'center',
        }}
      >
        {!isSearchOpen ? (
          <Animated.View
            entering={FadeIn.duration(280).easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(200).easing(Easing.in(Easing.cubic))}
            className="flex-row items-center justify-between"
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
            className="flex-row items-center gap-2.5"
          >
            <View className="flex-1">
              <Input
                ref={searchInputRef}
                icon={Search}
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search member, condition, allergy..."
                variant="filled"
                containerStyle={{
                  borderRadius: 999,
                  borderWidth: 0,
                  backgroundColor: '#ffffff',
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleCloseSearch}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full items-center justify-center shrink-0"
              style={{
                backgroundColor: 'rgba(204, 204, 204, 0.2)',
              }}
              accessibilityRole="button"
              accessibilityLabel="Close search"
            >
              <Icon name={X} size={18} color="#0f172a" />
            </TouchableOpacity>
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

        {/* Household Banner styled EXACTLY like Search Box */}
        <Animated.View
          entering={FadeInDown.duration(280).delay(20)}
          className="w-full relative px-5 pt-8 pb-7 bg-blue-100 mb-6 mt-2"
          style={{ borderRadius: 24, zIndex: 10 }}
        >
          <View
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 24, overflow: 'hidden', zIndex: 0
            }}
            pointerEvents="none"
          >
            {/* Smooth Background Lines */}
            <View style={{ position: 'absolute', top: -10, left: 10, width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#1e293b', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '-45deg' }], opacity: 0.15 }} />
            <View style={{ position: 'absolute', bottom: 30, right: 10, width: 90, height: 90, borderRadius: 45, borderWidth: 1, borderColor: '#1e293b', borderTopColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '15deg' }], opacity: 0.15 }} />
            


            {/* Decorative Plus Signs */}
            <Text style={{ position: 'absolute', top: 75, left: 25, fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
            <Text style={{ position: 'absolute', top: 25, right: 90, fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
            <Text style={{ position: 'absolute', bottom: 65, right: 20, fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
            <Text style={{ position: 'absolute', top: 100, right: '25%', fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>+</Text>
          </View>

          {/* Foreground Text */}
          <View className="items-center mt-6 mb-8" style={{ zIndex: 1, paddingHorizontal: 10 }}>
            <Text className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Inter_700Bold' }}>
              Family Circle
            </Text>
            <Text 
              className="font-black text-red-600 mt-1 text-center" 
              style={{ fontFamily: 'Inter_800ExtraBold', letterSpacing: 1, fontSize: 32 }}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.5}
            >
              {(householdName || 'My Family').toUpperCase()}
            </Text>
            <Text className="text-sm font-medium text-slate-700 mt-2">
              {patients.length} members linked to central vault
            </Text>
          </View>

          {/* Add Member Box styled like the Search bar */}
          <Pressable
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              setAddModalVisible(true);
            }}
            className="w-full h-12 bg-white rounded-[14px] flex-row items-center px-4 active:opacity-80"
            style={{
              borderWidth: 1,
              borderColor: '#e2e8f0',
              zIndex: 1
            }}
          >
            <Icon name={UserPlus} size={18} color="#94a3b8" />
            <Text className="ml-3 text-slate-300 font-medium text-sm">Add New Member</Text>
          </Pressable>
        </Animated.View>

        {/* Family Patient List */}
        <View className="gap-3">
          {filteredPatients.length === 0 ? (
            <Card className="bg-card border-0 rounded-[22px] p-8 items-center justify-center shadow-none">
              <Icon name={User} size={36} color="#8e8e93" />
              <Text
                className="text-sm font-semibold text-foreground mt-3"
                style={{ includeFontPadding: false }}
              >
                No family members found
              </Text>
              <Text
                className="text-xs text-muted-foreground mt-1 text-center"
                style={{ includeFontPadding: false }}
              >
                {searchQuery ? 'Try a different search term' : 'Add a family member to get started'}
              </Text>
            </Card>
          ) : (
            filteredPatients.map((patient) => {
              const patientMeds = getMedicinesForPatient(patient.id);

              return (
                <Animated.View key={patient.id} entering={FadeInDown.duration(300)}>
                  <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none overflow-hidden">
                    {/* Top: Avatar, Name, Relation, Role */}
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1 pr-2">
                        <View
                          className="w-11 h-11 rounded-2xl items-center justify-center mr-3 shrink-0"
                          style={{ backgroundColor: `${patient.avatarColor}20` }}
                        >
                          <Text
                            className="text-base font-extrabold"
                            style={{ color: patient.avatarColor }}
                          >
                            {patient.name.charAt(0)}
                          </Text>
                        </View>

                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center gap-1.5">
                            <Text
                              className="text-[15px] font-bold text-foreground"
                              style={{ includeFontPadding: false }}
                              numberOfLines={1}
                            >
                              {patient.name}
                            </Text>
                            {patient.role === 'admin' && (
                              <View className="bg-primary/10 px-1.5 py-0.5 rounded-full">
                                <Text
                                  className="text-[9px] font-bold text-primary"
                                  style={{ includeFontPadding: false }}
                                >
                                  ADMIN
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text
                            className="text-xs text-muted-foreground mt-0.5"
                            style={{ includeFontPadding: false }}
                            numberOfLines={1}
                          >
                            {patient.relation} • {patient.age} yrs
                          </Text>
                        </View>
                      </View>

                      {patient.role !== 'admin' && (
                        <TouchableOpacity
                          onPress={() => {
                            try {
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            } catch {}
                            deletePatient(patient.id);
                          }}
                          className="w-8 h-8 rounded-full bg-secondary/40 items-center justify-center active:opacity-60 shrink-0"
                          hitSlop={6}
                        >
                          <Icon name={Trash2} size={13} color="#ef4444" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Chronic Conditions & Allergies Chips */}
                    <View className="mb-3">
                      <View className="flex-row flex-wrap gap-1.5">
                        {patient.chronicConditions.map((cond, idx) => (
                          <View
                            key={idx}
                            className="bg-secondary/40 px-2.5 py-1 rounded-full flex-row items-center gap-1.5"
                          >
                            <Icon name={Heart} size={10} color="#ef4444" />
                            <Text
                              className="text-[11px] font-medium text-foreground"
                              style={{ includeFontPadding: false }}
                            >
                              {cond}
                            </Text>
                          </View>
                        ))}

                        {patient.allergies.length > 0 ? (
                          patient.allergies.map((allergy, idx) => (
                            <View
                              key={idx}
                              className="bg-destructive/10 px-2.5 py-1 rounded-full flex-row items-center gap-1.5"
                            >
                              <Icon name={ShieldAlert} size={10} color="#ef4444" />
                              <Text
                                className="text-[11px] font-semibold text-destructive"
                                style={{ includeFontPadding: false }}
                              >
                                {allergy}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <View className="bg-secondary/30 px-2.5 py-1 rounded-full flex-row items-center gap-1.5">
                            <Icon name={Shield} size={10} color="#10b981" />
                            <Text
                              className="text-[11px] text-muted-foreground"
                              style={{ includeFontPadding: false }}
                            >
                              No allergies logged
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Assigned Tablets & Regimen */}
                    <View
                      className="pt-2.5"
                      style={{ borderTopWidth: 1, borderTopColor: 'rgba(0, 0, 0, 0.05)' }}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text
                          className="text-xs font-semibold text-muted-foreground"
                          style={{ includeFontPadding: false }}
                        >
                          assigned medicines ({patientMeds.length})
                        </Text>
                      </View>

                      {patientMeds.length === 0 ? (
                        <Text
                          className="text-xs text-muted-foreground"
                          style={{ includeFontPadding: false }}
                        >
                          No prescriptions assigned yet.
                        </Text>
                      ) : (
                        <View className="gap-1.5">
                          {patientMeds.map((med) => (
                            <View
                              key={med.id}
                              className="bg-background/80 rounded-xl p-2.5 flex-row items-center justify-between"
                            >
                              <View className="flex-row items-center gap-2 flex-1 min-w-0 pr-2">
                                <View className="w-7 h-7 rounded-lg bg-primary/10 items-center justify-center shrink-0">
                                  <Icon name={Pill} size={13} color="#2e67ff" />
                                </View>
                                <View className="flex-1 min-w-0">
                                  <Text
                                    className="text-xs font-bold text-foreground"
                                    style={{ includeFontPadding: false }}
                                    numberOfLines={1}
                                  >
                                    {med.name}
                                  </Text>
                                  <Text
                                    className="text-[10px] text-muted-foreground"
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
                                  in stock
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </Card>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>
      </TabPageTransition>

      {/* ── Add Family Member Modal (Modern Center Floating) ── */}
      <Modal visible={addModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 bg-black/40 justify-center items-center px-4"
        >
          <View className="w-full max-w-sm bg-card rounded-[28px] p-5 ">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text
                  className="text-base font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Add Family Member
                </Text>
                <Text
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ includeFontPadding: false }}
                >
                  Link health conditions & prescriptions
                </Text>
              </View>
              <Pressable
                onPress={() => setAddModalVisible(false)}
                className="w-8 h-8 rounded-full bg-secondary/60 items-center justify-center active:opacity-60"
                hitSlop={8}
              >
                <Icon name={X} size={16} color="#0e142b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="max-h-[380px]">
              {/* Full Name */}
              <View className="mb-3">
                <Text
                  className="text-[11px] font-semibold text-muted-foreground mb-1.5 ml-1"
                  style={{ includeFontPadding: false }}
                >
                  Full Name
                </Text>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="e.g. Dadi, Ali, Sara"
                  placeholderTextColor="#94a3b8"
                  className="bg-background text-foreground px-4 text-xs font-medium"
                  style={{
                    height: 44,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.06)',
                    includeFontPadding: false,
                  }}
                />
              </View>

              {/* Relation Chips */}
              <View className="mb-3">
                <Text
                  className="text-[11px] font-semibold text-muted-foreground mb-1.5 ml-1"
                  style={{ includeFontPadding: false }}
                >
                  Relation
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {RELATION_PRESETS.map((rel) => {
                    const isSelected = relationInput === rel;
                    return (
                      <TouchableOpacity
                        key={rel}
                        onPress={() => setRelationInput(rel)}
                        className={`px-3 py-1.5 rounded-full ${
                          isSelected
                            ? 'bg-primary'
                            : 'bg-background border border-black/[0.06]'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-white' : 'text-foreground'
                          }`}
                          style={{ includeFontPadding: false }}
                        >
                          {rel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Age */}
              <View className="mb-3">
                <Text
                  className="text-[11px] font-semibold text-muted-foreground mb-1.5 ml-1"
                  style={{ includeFontPadding: false }}
                >
                  Age (years)
                </Text>
                <TextInput
                  value={ageInput}
                  onChangeText={setAgeInput}
                  placeholder="65"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                  className="bg-background text-foreground px-4 text-xs font-medium"
                  style={{
                    height: 44,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.06)',
                    includeFontPadding: false,
                  }}
                />
              </View>

              {/* Conditions */}
              <View className="mb-3">
                <Text
                  className="text-[11px] font-semibold text-muted-foreground mb-1.5 ml-1"
                  style={{ includeFontPadding: false }}
                >
                  Conditions (comma separated)
                </Text>
                <TextInput
                  value={conditionInput}
                  onChangeText={setConditionInput}
                  placeholder="e.g. Diabetes, Hypertension"
                  placeholderTextColor="#94a3b8"
                  className="bg-background text-foreground px-4 text-xs font-medium"
                  style={{
                    height: 44,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.06)',
                    includeFontPadding: false,
                  }}
                />
              </View>

              {/* Allergies */}
              <View className="mb-4">
                <Text
                  className="text-[11px] font-semibold text-muted-foreground mb-1.5 ml-1"
                  style={{ includeFontPadding: false }}
                >
                  Known Allergies (comma separated)
                </Text>
                <TextInput
                  value={allergyInput}
                  onChangeText={setAllergyInput}
                  placeholder="e.g. Penicillin, Sulfa"
                  placeholderTextColor="#94a3b8"
                  className="bg-background text-foreground px-4 text-xs font-medium"
                  style={{
                    height: 44,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.06)',
                    includeFontPadding: false,
                  }}
                />
              </View>
            </ScrollView>

            {/* Buttons */}
            <View className="flex-row items-center gap-2.5 mt-2 pt-2">
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                className="flex-1 bg-background border border-black/[0.06] items-center justify-center active:opacity-70"
                style={{ height: 42, borderRadius: 999 }}
              >
                <Text
                  className="text-xs font-semibold text-muted-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreatePatient}
                className="flex-1 bg-primary items-center justify-center active:opacity-90"
                style={{ height: 42, borderRadius: 999 }}
              >
                <Text
                  className="text-xs font-bold text-white"
                  style={{ includeFontPadding: false }}
                >
                  Save Member
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Search Overlay ── */}
      <SearchOverlay
        isVisible={isSearchOpen}
        searchQuery={searchQuery}
        onClose={handleCloseSearch}
        topOffset={Math.max(insets.top + 8, 16) + 48}
      />
    </View>
  );
}
