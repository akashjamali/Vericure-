import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Check,
  HeartPulse,
  Info,
  PenSquare,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface MedicalCondition {
  id: string;
  name: string;
  status: 'Active' | 'Controlled' | 'Under Monitoring';
  diagnosedYear?: string;
  notes?: string;
}

const COMMON_CONDITION_PRESETS = [
  'Hypertension',
  'Type-2 Diabetes',
  'Asthma',
  'Renal Impairment',
  'Hyperlipidemia',
  'Thyroid Disorder',
  'Migraine',
  'GERD / Acid Reflux',
  'Heart Disease',
  'Arthritis',
  'Celiac Disease',
  'Depression / Anxiety',
];

export default function MedicalConditionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Disease list state
  const [conditionsList, setConditionsList] = useState<MedicalCondition[]>([
    {
      id: '1',
      name: 'Hypertension',
      status: 'Controlled',
      diagnosedYear: '2022',
      notes: 'Monitor BP before taking decongestants & NSAIDs',
    },
    {
      id: '2',
      name: 'Type-2 Diabetes',
      status: 'Active',
      diagnosedYear: '2023',
      notes: 'Avoid high sugar syrups and corticosteroids',
    },
    {
      id: '3',
      name: 'Asthma',
      status: 'Under Monitoring',
      diagnosedYear: '2020',
      notes: 'Sensitive to non-selective beta-blockers',
    },
  ]);

  // Modal State for Adding / Editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConditionId, setEditingConditionId] = useState<string | null>(null);
  const [conditionName, setConditionName] = useState('');
  const [conditionStatus, setConditionStatus] = useState<
    'Active' | 'Controlled' | 'Under Monitoring'
  >('Active');
  const [conditionYear, setConditionYear] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {}
  };

  const handleOpenAdd = () => {
    triggerHaptic();
    setEditingConditionId(null);
    setConditionName('');
    setConditionStatus('Active');
    setConditionYear(new Date().getFullYear().toString());
    setConditionNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MedicalCondition) => {
    triggerHaptic();
    setEditingConditionId(item.id);
    setConditionName(item.name);
    setConditionStatus(item.status);
    setConditionYear(item.diagnosedYear || '');
    setConditionNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveCondition = () => {
    if (!conditionName.trim()) {
      Alert.alert('Required', 'Please enter a disease or condition name.');
      return;
    }
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    if (editingConditionId) {
      setConditionsList((prev) =>
        prev.map((c) =>
          c.id === editingConditionId
            ? {
                ...c,
                name: conditionName.trim(),
                status: conditionStatus,
                diagnosedYear: conditionYear.trim() || undefined,
                notes: conditionNotes.trim() || undefined,
              }
            : c
        )
      );
    } else {
      const newItem: MedicalCondition = {
        id: Date.now().toString(),
        name: conditionName.trim(),
        status: conditionStatus,
        diagnosedYear: conditionYear.trim() || undefined,
        notes: conditionNotes.trim() || undefined,
      };
      setConditionsList((prev) => [newItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCondition = (id: string, name: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Remove Condition',
      `Are you sure you want to remove "${name}" from your medical record?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            triggerHaptic();
            setConditionsList((prev) => prev.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  const handleTogglePreset = (preset: string) => {
    triggerHaptic();
    const existing = conditionsList.find(
      (c) => c.name.toLowerCase() === preset.toLowerCase()
    );
    if (existing) {
      setConditionsList((prev) => prev.filter((c) => c.id !== existing.id));
    } else {
      const newItem: MedicalCondition = {
        id: Date.now().toString(),
        name: preset,
        status: 'Active',
        diagnosedYear: new Date().getFullYear().toString(),
      };
      setConditionsList((prev) => [newItem, ...prev]);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Top Header with Back Button & App Logo ── */}
      <View
        className="bg-background pb-3"
        style={{ paddingTop: Math.max(insets.top, 20) + 8, zIndex: 60 }}
      >
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => {
                triggerHaptic();
                router.back();
              }}
              hitSlop={10}
              className="w-10 h-10 rounded-full items-center justify-center bg-card active:opacity-70"
              style={{ borderWidth: 0 }}
            >
              <Icon name={ArrowLeft} size={18} color="#0f172a" />
            </Pressable>
            <View>
              <Text
                className="text-lg font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                medical conditions
              </Text>
              <Text
                className="text-xs text-muted-foreground mt-0.5"
                style={{ includeFontPadding: false }}
              >
                diseases & contraindications
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleOpenAdd}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(46, 103, 255, 0.12)' }}
          >
            <Icon name={Plus} size={20} color="#2e67ff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Scrollable Body ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Overview Summary Banner ── */}
        <Animated.View entering={FadeInDown.duration(280)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3.5">
            <View className="flex-row items-start gap-3.5">
              <View className="w-11 h-11 rounded-2xl bg-primary/10 items-center justify-center shrink-0">
                <Icon name={Activity} size={22} color="#2e67ff" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  bioshield clinical radar
                </Text>
                <Text
                  className="text-xs text-muted-foreground mt-1 leading-relaxed"
                  style={{ includeFontPadding: false }}
                >
                  registered conditions are cross-referenced during medicine scans to protect against harmful drug interactions and organ toxicity.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2 mt-3.5 pt-3 border-t border-black/5">
              <View className="flex-row items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                <Icon name={HeartPulse} size={13} color="#2e67ff" />
                <Text className="text-xs font-semibold text-primary">
                  {conditionsList.length} active records
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
                <Icon name={ShieldAlert} size={13} color="#64748b" />
                <Text className="text-xs font-medium text-muted-foreground">
                  strict screening on
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Registered Conditions List ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(60)}>
          <View className="flex-row items-center justify-between mb-2.5 px-1">
            <Text
              className="text-xs font-semibold text-muted-foreground"
              style={{ includeFontPadding: false }}
            >
              your diagnosed conditions ({conditionsList.length})
            </Text>
            <TouchableOpacity
              onPress={handleOpenAdd}
              activeOpacity={0.7}
              className="flex-row items-center gap-1"
            >
              <Icon name={Plus} size={13} color="#2e67ff" />
              <Text className="text-xs font-semibold text-primary">add new</Text>
            </TouchableOpacity>
          </View>

          {conditionsList.length === 0 ? (
            <Card className="bg-card border-0 rounded-[22px] p-6 shadow-none items-center justify-center mb-3">
              <View className="w-12 h-12 rounded-full bg-secondary/40 items-center justify-center mb-2">
                <Icon name={Info} size={22} color="#64748b" />
              </View>
              <Text className="text-sm font-bold text-foreground">no conditions listed</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1 max-w-[260px]">
                tap "+ add new" or select from common clinical presets below to safeguard your medicine scans.
              </Text>
            </Card>
          ) : (
            <View className="gap-2.5 mb-3.5">
              {conditionsList.map((cond) => (
                <Card
                  key={cond.id}
                  className="bg-card border-0 rounded-[22px] p-4 shadow-none"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      {/* Name & Status */}
                      <View className="flex-row items-center gap-2 flex-wrap">
                        <Text
                          className="text-base font-bold text-foreground"
                          style={{ includeFontPadding: false }}
                        >
                          {cond.name}
                        </Text>
                        <View
                          className="px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor:
                              cond.status === 'Active'
                                ? 'rgba(239, 68, 68, 0.12)'
                                : cond.status === 'Controlled'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(46, 103, 255, 0.12)',
                          }}
                        >
                          <Text
                            className="text-xs font-semibold"
                            style={{
                              color:
                                cond.status === 'Active'
                                  ? '#ef4444'
                                  : cond.status === 'Controlled'
                                  ? '#10b981'
                                  : '#2e67ff',
                              includeFontPadding: false,
                            }}
                          >
                            {cond.status.toLowerCase()}
                          </Text>
                        </View>
                      </View>

                      {/* Diagnosed Year */}
                      {cond.diagnosedYear ? (
                        <Text
                          className="text-xs text-muted-foreground mt-1"
                          style={{ includeFontPadding: false }}
                        >
                          diagnosed: {cond.diagnosedYear}
                        </Text>
                      ) : null}

                      {/* Clinical Notes / Advice */}
                      {cond.notes ? (
                        <View className="mt-2.5 bg-background rounded-xl p-3">
                          <Text
                            className="text-xs text-muted-foreground leading-relaxed"
                            style={{ includeFontPadding: false }}
                          >
                            {cond.notes}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Action buttons */}
                    <View className="flex-row items-center gap-2 shrink-0">
                      <TouchableOpacity
                        onPress={() => handleOpenEdit(cond)}
                        activeOpacity={0.7}
                        className="w-9 h-9 rounded-full bg-secondary/50 items-center justify-center"
                        hitSlop={6}
                      >
                        <Icon name={PenSquare} size={15} color="#0f172a" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteCondition(cond.id, cond.name)}
                        activeOpacity={0.7}
                        className="w-9 h-9 rounded-full bg-destructive/10 items-center justify-center"
                        hitSlop={6}
                      >
                        <Icon name={Trash2} size={15} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </Animated.View>

        {/* ── Quick Add Presets Section ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(120)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3">
            <View className="mb-3">
              <Text
                className="text-sm font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                common diagnoses presets
              </Text>
              <Text
                className="text-xs text-muted-foreground mt-0.5"
                style={{ includeFontPadding: false }}
              >
                tap to toggle quickly into your medical record
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {COMMON_CONDITION_PRESETS.map((preset) => {
                const isSelected = conditionsList.some(
                  (c) => c.name.toLowerCase() === preset.toLowerCase()
                );
                return (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => handleTogglePreset(preset)}
                    activeOpacity={0.7}
                    className={`px-3.5 py-2 rounded-full flex-row items-center gap-1.5 ${
                      isSelected ? 'bg-primary/15' : 'bg-secondary/40'
                    }`}
                  >
                    {isSelected ? (
                      <Icon name={Check} size={12} color="#2e67ff" />
                    ) : (
                      <Icon name={Plus} size={12} color="#64748b" />
                    )}
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                      style={{ includeFontPadding: false }}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* ── Add / Edit Condition Modal ── */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center items-center bg-black/50 px-5"
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => {
              Keyboard.dismiss();
              setIsModalOpen(false);
            }}
          />

          <Animated.View
            entering={FadeIn.duration(200)}
            className="w-full bg-card rounded-[26px] p-5 shadow-none"
            style={{ maxHeight: '90%' }}
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                  <Icon name={Activity} size={16} color="#2e67ff" />
                </View>
                <Text
                  className="text-lg font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  {editingConditionId ? 'edit condition' : 'add medical condition'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setIsModalOpen(false);
                }}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full bg-secondary/60 items-center justify-center"
              >
                <Icon name={X} size={15} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View className="gap-3.5">
              {/* Disease Name */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  disease / diagnosis name
                </Text>
                <TextInput
                  value={conditionName}
                  onChangeText={setConditionName}
                  placeholder="e.g. type-2 diabetes, hypertension"
                  placeholderTextColor="#94a3b8"
                  className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                  style={{ height: 46, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}
                />
              </View>

              {/* Status Selector */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  clinical status
                </Text>
                <View className="flex-row items-center gap-2">
                  {(['Active', 'Controlled', 'Under Monitoring'] as const).map((st) => {
                    const active = conditionStatus === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        onPress={() => {
                          triggerHaptic();
                          setConditionStatus(st);
                        }}
                        activeOpacity={0.7}
                        className={`flex-1 py-2.5 rounded-full items-center justify-center ${
                          active ? 'bg-primary' : 'bg-background'
                        }`}
                        style={{
                          borderWidth: active ? 0 : 1,
                          borderColor: 'rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            active ? 'text-white' : 'text-muted-foreground'
                          }`}
                          style={{ includeFontPadding: false }}
                        >
                          {st === 'Under Monitoring' ? 'monitoring' : st.toLowerCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Diagnosed Year */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  year diagnosed (optional)
                </Text>
                <TextInput
                  value={conditionYear}
                  onChangeText={setConditionYear}
                  placeholder="e.g. 2023"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                  className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                  style={{ height: 46, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}
                />
              </View>

              {/* Clinical Warnings & Notes */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  clinical warnings & contraindications
                </Text>
                <TextInput
                  value={conditionNotes}
                  onChangeText={setConditionNotes}
                  placeholder="e.g. avoid nsaids, beta-blockers, or sugar syrups"
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={2}
                  className="bg-background rounded-2xl px-4 py-2.5 text-sm text-foreground font-medium"
                  style={{
                    height: 68,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.05)',
                    textAlignVertical: 'top',
                  }}
                />
              </View>

              {/* Modal Actions */}
              <View className="flex-row items-center gap-2.5 pt-2">
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsModalOpen(false);
                  }}
                  activeOpacity={0.7}
                  className="flex-1 items-center justify-center bg-secondary/50 rounded-full"
                  style={{ height: 46 }}
                >
                  <Text
                    className="text-sm font-semibold text-muted-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveCondition}
                  activeOpacity={0.7}
                  className="flex-1 items-center justify-center bg-primary rounded-full"
                  style={{ height: 46 }}
                >
                  <Text
                    className="text-sm font-bold text-white"
                    style={{ includeFontPadding: false }}
                  >
                    {editingConditionId ? 'update record' : 'save condition'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
