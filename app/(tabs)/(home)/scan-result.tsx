import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useInventory } from '@/providers/inventory-context';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Heart,
  Layers,
  Pill,
  RotateCcw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Share, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { patients, addMedicine, getMedicinesForPatient } = useInventory();

  const params = useLocalSearchParams<{
    code?: string;
    item?: string;
    generic?: string;
  }>();

  const scannedItemName = params.item || 'Augmentin 625mg';
  const scannedGeneric = params.generic || 'Amoxicillin + Clavulanate Potassium';
  const scannedBatch = params.code || 'BNT-89240-PK';

  // Assignment state
  const [assignedPatientId, setAssignedPatientId] = useState<string | null>(null);
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [allergyAlert, setAllergyAlert] = useState<{ patientName: string; allergy: string } | null>(null);

  const triggerHaptic = (type: 'light' | 'success' | 'warning' = 'light') => {
    try {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {}
  };

  const handleBack = () => {
    triggerHaptic('light');
    router.back();
  };

  const handleScanAnother = () => {
    triggerHaptic('light');
    router.replace('/(tabs)/(home)');
  };

  const handleSelectPatient = (patientId: string) => {
    const selected = patients.find((p) => p.id === patientId);
    if (!selected) return;

    // Check allergy conflict
    const hasAllergyConflict = selected.allergies.some((al) => {
      const lowerAl = al.toLowerCase();
      const lowerGen = scannedGeneric.toLowerCase();
      const lowerName = scannedItemName.toLowerCase();
      return (
        (lowerAl.includes('penicillin') && (lowerGen.includes('amoxicillin') || lowerName.includes('augmentin'))) ||
        (lowerAl.includes('nsaid') && (lowerGen.includes('ibuprofen') || lowerName.includes('brufen'))) ||
        (lowerAl.includes('sulfa') && lowerGen.includes('sulfa'))
      );
    });

    if (hasAllergyConflict) {
      triggerHaptic('warning');
      const matchedAllergy = selected.allergies[0];
      setAllergyAlert({ patientName: selected.name, allergy: matchedAllergy });
      setAssignedPatientId(patientId);
      return;
    }

    commitAssignment(patientId);
  };

  const commitAssignment = (patientId: string) => {
    triggerHaptic('success');
    setAllergyAlert(null);
    setAssignedPatientId(patientId);

    // Save into central inventory under this patient!
    addMedicine({
      name: scannedItemName,
      generic: scannedGeneric,
      dosage: '625mg',
      category: 'Antibiotic',
      batchNumber: scannedBatch,
      expiryDate: '2028-11-15',
      totalQuantity: 14,
      remainingQuantity: 14,
      unit: 'tablets',
      lowStockThreshold: 4,
      assignedPatientId: patientId,
      location: 'Main Cabinet',
      form: 'Tablet',
    });

    setAssignedSuccess(true);
  };

  const handleAssignGeneral = () => {
    triggerHaptic('success');
    addMedicine({
      name: scannedItemName,
      generic: scannedGeneric,
      dosage: '625mg',
      category: 'Antibiotic',
      batchNumber: scannedBatch,
      expiryDate: '2028-11-15',
      totalQuantity: 14,
      remainingQuantity: 14,
      unit: 'tablets',
      lowStockThreshold: 4,
      assignedPatientId: undefined,
      location: 'Main Cabinet',
      form: 'Tablet',
    });
    setAssignedPatientId('general');
    setAssignedSuccess(true);
  };

  const assignedPatientObj = patients.find((p) => p.id === assignedPatientId);

  return (
    <View className="flex-1 bg-background">
      {/* ── Top Header ── */}
      <View
        className="bg-background pb-3"
        style={{
          paddingTop: Math.max(insets.top, 20) + 8,
          zIndex: 60,
        }}
      >
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              className="w-9 h-9 rounded-full bg-background items-center justify-center  active:opacity-60"
              accessibilityRole="button"
            >
              <Icon name={ArrowLeft} size={18} color="#0e142b" />
            </Pressable>
            <AppLogo width={96} height={32} />
          </View>

          <Pressable
            onPress={() => {
              Share.share({
                message: `PharmaPulse Verification: ${scannedItemName} (#${scannedBatch}) Verified 100% Genuine.`,
              });
            }}
            hitSlop={8}
            className="w-9 h-9 rounded-full bg-background items-center justify-center  active:opacity-60"
          >
            <Icon name={Share2} size={16} color="#0e142b" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-3 pb-12 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Authentic Verification Card ── */}
        <Animated.View
          entering={FadeIn.duration(280)}
          className="items-center py-4 bg-card rounded-xl border border-border"
        >
          <View className="w-12 h-12 rounded-full bg-emerald-500/10 items-center justify-center mb-2.5">
            <Icon name={ShieldCheck} size={24} color="#10b981" />
          </View>

          <View className="flex-row items-center gap-1.5 mb-1">
            <Text className="text-xs font-bold text-emerald-600" style={{ includeFontPadding: false }}>
              100% Genuine Authentic
            </Text>
            <Icon name={CheckCircle2} size={13} color="#10b981" />
          </View>

          <Text className="text-lg font-bold text-foreground text-center" style={{ includeFontPadding: false }}>
            {scannedItemName}
          </Text>
          <Text className="text-xs text-muted-foreground text-center mt-0.5" style={{ includeFontPadding: false }}>
            {scannedGeneric}
          </Text>
        </Animated.View>

        {/* ── Patient Assignment Section ── */}
        <Animated.View entering={FadeInDown.duration(320).delay(60)}>
          <Card className="bg-card rounded-xl  p-4 shadow-none">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-sm font-bold text-foreground" style={{ includeFontPadding: false }}>
                  Assign to Household Patient
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5" style={{ includeFontPadding: false }}>
                  Select which family member this medicine belongs to:
                </Text>
              </View>
              <View className="w-7 h-7 rounded-full bg-primary/10 items-center justify-center">
                <Icon name={User} size={14} color="#2e67ff" />
              </View>
            </View>

            {/* Allergy Conflict Warning Banner */}
            {allergyAlert && (
              <View className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 my-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <Icon name={ShieldAlert} size={15} color="#dc2626" />
                  <Text className="text-xs font-bold text-destructive" style={{ includeFontPadding: false }}>
                    Severe Allergy Warning!
                  </Text>
                </View>
                <Text className="text-xs text-foreground leading-relaxed" style={{ includeFontPadding: false }}>
                  {allergyAlert.patientName} has a documented allergy to <Text className="font-bold text-destructive">{allergyAlert.allergy}</Text>. This medicine contains beta-lactam components that may trigger an adverse reaction!
                </Text>

                <View className="flex-row items-center gap-2 mt-2 pt-2 border-t border-destructive/20">
                  <TouchableOpacity
                    onPress={() => commitAssignment(assignedPatientId!)}
                    className="bg-destructive px-3 py-1.5 rounded-lg"
                  >
                    <Text className="text-[11px] font-bold text-white" style={{ includeFontPadding: false }}>
                      Assign Anyway (Physician Approved)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAllergyAlert(null)}
                    className="px-3 py-1.5 rounded-lg bg-background border border-border"
                  >
                    <Text className="text-[11px] font-semibold text-muted-foreground" style={{ includeFontPadding: false }}>
                      Choose Another Member
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Success Banner */}
            {assignedSuccess && (
              <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 my-2 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon name={CheckCircle2} size={16} color="#10b981" />
                  <View>
                    <Text className="text-xs font-bold text-emerald-600" style={{ includeFontPadding: false }}>
                      Saved to {assignedPatientObj ? assignedPatientObj.name : 'General Cabinet'}!
                    </Text>
                    <Text className="text-[10px] text-muted-foreground" style={{ includeFontPadding: false }}>
                      Inventory & dosage tracker updated
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/cabinet')}
                  className="bg-emerald-600 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[10px] font-bold text-white" style={{ includeFontPadding: false }}>
                    View Cabinet
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Registered Patients Selector List */}
            <View className="gap-2 mt-2">
              {patients.map((patient) => {
                const isSelected = assignedPatientId === patient.id && assignedSuccess;
                return (
                  <TouchableOpacity
                    key={patient.id}
                    onPress={() => handleSelectPatient(patient.id)}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between p-3 rounded-xl border ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background border-border'
                    }`}
                  >
                    <View className="flex-row items-center gap-2.5">
                      <View
                        className="w-9 h-9 rounded-full items-center justify-center"
                        style={{ backgroundColor: patient.avatarColor }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#ffffff',
                            textAlign: 'center',
                            includeFontPadding: false,
                            lineHeight: 16,
                          }}
                        >
                          {patient.name.charAt(0).toLowerCase()}
                        </Text>
                      </View>

                      <View>
                        <View className="flex-row items-center gap-1.5">
                          <Text className="text-sm font-semibold text-foreground" style={{ includeFontPadding: false }}>
                            {patient.name.toLowerCase()}
                          </Text>
                          <Text className="text-xs text-muted-foreground" style={{ includeFontPadding: false }}>
                            ({patient.relation.toLowerCase()})
                          </Text>
                        </View>
                        <Text className="text-xs text-muted-foreground mt-0.5" style={{ includeFontPadding: false }}>
                          patient of: {patient.chronicConditions.join(', ').toLowerCase()}
                        </Text>
                      </View>
                    </View>

                    <View
                      className={`px-2.5 py-1 rounded-lg ${
                        isSelected ? 'bg-primary' : 'bg-card border border-border'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          isSelected ? 'text-white' : 'text-primary'
                        }`}
                        style={{ includeFontPadding: false }}
                      >
                        {isSelected ? 'Saved' : 'Assign'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* General Stock Option */}
              <TouchableOpacity
                onPress={handleAssignGeneral}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-3 rounded-xl border bg-background border-border mt-1"
              >
                <View className="flex-row items-center gap-2.5">
                  <View className="w-8 h-8 rounded-full bg-muted-foreground/10 items-center justify-center">
                    <Icon name={Layers} size={15} color="#8e8e93" />
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-foreground" style={{ includeFontPadding: false }}>
                      Household General Cabinet
                    </Text>
                    <Text className="text-[10px] text-muted-foreground mt-0.5" style={{ includeFontPadding: false }}>
                      Keep unassigned for general family use
                    </Text>
                  </View>
                </View>

                <View className="px-2.5 py-1 rounded-lg bg-card border border-border">
                  <Text className="text-[10px] font-bold text-muted-foreground" style={{ includeFontPadding: false }}>
                    General
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {/* ── Technical Specifications Table ── */}
        <Animated.View
          entering={FadeInDown.duration(320).delay(120)}
          className="bg-card rounded-xl  p-4 gap-3.5"
        >
          <Text className="text-xs font-semibold text-muted-foreground" style={{ includeFontPadding: false }}>
            Medicine Specifications
          </Text>

          <View className="divide-y divide-border">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-xs text-muted-foreground">Batch Number</Text>
              <Text className="text-xs font-mono font-bold text-foreground">{scannedBatch}</Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-xs text-muted-foreground">Manufacturer</Text>
              <Text className="text-xs font-medium text-foreground">GlaxoSmithKline (GSK)</Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-xs text-muted-foreground">Expiry Date</Text>
              <Text className="text-xs font-bold text-emerald-600">11 / 2028 (34 Months Remaining)</Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-xs text-muted-foreground">Pack Quantity</Text>
              <Text className="text-xs font-medium text-foreground">14 Film-Coated Tablets</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Action Buttons ── */}
        <Animated.View entering={FadeInDown.duration(320).delay(160)} className="gap-2.5 pt-1">
          <Pressable
            onPress={handleScanAnother}
            className="w-full py-3.5 rounded-full bg-primary flex-row items-center justify-center gap-2 active:opacity-90"
          >
            <Icon name={RotateCcw} size={16} color="#ffffff" />
            <Text className="text-white text-xs font-bold">Scan Another Medicine</Text>
          </Pressable>

          <Pressable
            onPress={handleBack}
            className="w-full py-3.5 rounded-full bg-background  flex-row items-center justify-center gap-2 active:opacity-75"
          >
            <Icon name={FileText} size={15} color="#0e142b" />
            <Text className="text-foreground text-xs font-semibold">Back to Dashboard</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
