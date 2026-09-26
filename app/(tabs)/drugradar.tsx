import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { SearchOverlay } from '@/components/ui/search-overlay';
import { TabPageTransition } from '@/components/ui/tab-page-transition';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import * as Haptics from 'expo-haptics';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Pill,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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

interface Medication {
  id: string;
  name: string;
  generic: string;
  class: string;
}

const DRUG_CATALOG: Medication[] = [
  { id: '1', name: 'Brufen 400mg', generic: 'Ibuprofen', class: 'NSAID' },
  { id: '2', name: 'Warfarin 5mg', generic: 'Warfarin Sodium', class: 'Anticoagulant' },
  { id: '3', name: 'Augmentin 625mg', generic: 'Amoxicillin + Clavulanic', class: 'Antibiotic' },
  { id: '4', name: 'Panadol Extra', generic: 'Paracetamol + Caffeine', class: 'Analgesic' },
  { id: '5', name: 'Nexum 40mg', generic: 'Esomeprazole', class: 'PPI' },
  { id: '6', name: 'Glucophage 500mg', generic: 'Metformin', class: 'Antidiabetic' },
  { id: '7', name: 'Cravit 500mg', generic: 'Levofloxacin', class: 'Fluoroquinolone' },
  { id: '8', name: 'Lipitor 20mg', generic: 'Atorvastatin', class: 'Statin' },
];

interface ConflictVerdict {
  severity: 'severe' | 'moderate' | 'safe';
  headline: string;
  badge: string;
  mechanism: string;
  clinicalAction: string;
  foodWarnings: { label: string; note: string }[];
}

const CONFLICT_DATABASE: Record<string, ConflictVerdict> = {
  '1-2': {
    severity: 'severe',
    headline: 'Major Gastrointestinal Hemorrhage Risk',
    badge: 'Contraindicated',
    mechanism: 'Ibuprofen impairs platelet function and erodes gastric mucosal barrier, amplifying Warfarin systemic anticoagulation.',
    clinicalAction: 'Strictly avoid. Switch to selective paracetamol under physician supervision.',
    foodWarnings: [
      { label: 'Alcohol', note: 'Severe gastric lining hemorrhage risk.' },
      { label: 'Cranberry Juice', note: 'Alters hepatic Warfarin metabolism.' },
    ],
  },
  '1-3': {
    severity: 'moderate',
    headline: 'Renal Clearance Competition',
    badge: 'Moderate Caution',
    mechanism: 'NSAIDs reduce prostaglandin synthesis, decreasing renal blood flow and delaying amoxicillin elimination.',
    clinicalAction: 'Space doses by minimum 3 hours. Drink at least 2.5L water daily.',
    foodWarnings: [
      { label: 'Dairy', note: 'Separate from milk/calcium by 2 hours.' },
    ],
  },
  '1-4': {
    severity: 'safe',
    headline: 'Dual-Pathway Analgesia (Compatible)',
    badge: 'Safe Combination',
    mechanism: 'Paracetamol acts centrally via COX-3/endocannabinoid pathway; Ibuprofen acts peripheral inflammatory cascades without enzyme collision.',
    clinicalAction: 'Safe to alternate. Do not exceed 4,000mg Paracetamol per 24 hours.',
    foodWarnings: [
      { label: 'Caffeine', note: 'Limit extra coffee due to Panadol Extra caffeine content.' },
    ],
  },
  '3-5': {
    severity: 'moderate',
    headline: 'Gastric pH Elevation Reduces Absorption',
    badge: 'Moderate Caution',
    mechanism: 'Esomeprazole suppresses gastric acid, elevating stomach pH and reducing bioavailability of antibiotic salts.',
    clinicalAction: 'Take Nexum 1 hour before breakfast, take Augmentin with meals.',
    foodWarnings: [
      { label: 'Citrus', note: 'Avoid heavy grapefruit or orange juice near intake.' },
    ],
  },
  '6-8': {
    severity: 'safe',
    headline: 'Cardiometabolic Synergy (Compatible)',
    badge: 'Safe Combination',
    mechanism: 'No cytochrome P450 competition. Standard dual therapy for concurrent diabetes and hyperlipidemia.',
    clinicalAction: 'Monitor annual HbA1c and liver transaminases (ALT/AST).',
    foodWarnings: [
      { label: 'Grapefruit', note: 'May increase serum statin concentrations.' },
    ],
  },
  '5-7': {
    severity: 'moderate',
    headline: 'Fluoroquinolone Bioavailability Reduction',
    badge: 'Moderate Caution',
    mechanism: 'Proton pump inhibitors alter gastric environment, lowering peak levofloxacin serum concentration.',
    clinicalAction: 'Administer Cravit at least 2 hours prior to or 4 hours after antacids.',
    foodWarnings: [
      { label: 'Dairy & Calcium', note: 'Chelates fluoroquinolone molecules.' },
    ],
  },
};

function getVerdict(idA: string, idB: string): ConflictVerdict {
  const k1 = `${idA}-${idB}`;
  const k2 = `${idB}-${idA}`;
  if (CONFLICT_DATABASE[k1]) return CONFLICT_DATABASE[k1];
  if (CONFLICT_DATABASE[k2]) return CONFLICT_DATABASE[k2];

  return {
    severity: 'safe',
    headline: 'No Critical Clinical Collision Detected',
    badge: 'Compatible Pair',
    mechanism: 'These agents utilize divergent hepatic clearance pathways without direct pharmacokinetic enzyme competition.',
    clinicalAction: 'Take according to standard prescribing schedules and maintain normal hydration.',
    foodWarnings: [
      { label: 'General', note: 'Take with room-temperature water.' },
    ],
  };
}

export default function DrugRadarScreen() {
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<[string, string]>(['1', '2']);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  const drugA = DRUG_CATALOG.find((d) => d.id === selectedIds[0]) || DRUG_CATALOG[0];
  const drugB = DRUG_CATALOG.find((d) => d.id === selectedIds[1]) || DRUG_CATALOG[1];
  const verdict = getVerdict(drugA.id, drugB.id);

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

  const toggleDrug = (drug: Medication) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    if (selectedIds[0] === drug.id || selectedIds[1] === drug.id) return;
    setSelectedIds([selectedIds[1], drug.id]);
  };

  const setPreset = (id1: string, id2: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSelectedIds([id1, id2]);
  };

  const getSeverityColors = () => {
    switch (verdict.severity) {
      case 'severe':
        return {
          pillBg: '#fee2e2',
          pillText: '#dc2626',
          dot: '#dc2626',
          icon: AlertOctagon,
          iconColor: '#dc2626',
          bgTint: '#fef2f2',
        };
      case 'moderate':
        return {
          pillBg: '#fef3c7',
          pillText: '#d97706',
          dot: '#d97706',
          icon: AlertTriangle,
          iconColor: '#d97706',
          bgTint: '#fffbeb',
        };
      case 'safe':
      default:
        return {
          pillBg: '#dcfce7',
          pillText: '#16a34a',
          dot: '#16a34a',
          icon: ShieldCheck,
          iconColor: '#16a34a',
          bgTint: '#f0fdf4',
        };
    }
  };

  const sevColors = getSeverityColors();

  const filteredCatalog = DRUG_CATALOG.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.generic.toLowerCase().includes(q) ||
      d.class.toLowerCase().includes(q)
    );
  });

  return (
    <View className="flex-1 bg-background">
      {/* ── Top App Bar (Identical to Home, Vault & Family) ── */}
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
                placeholder="Search drug or category..."
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
        {/* ── Active Pair Comparison Box ── */}
        <Animated.View entering={FadeInDown.duration(280)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-1.5">
                <Icon name={Activity} size={15} color="#2e67ff" />
                <Text
                  className="text-xs font-semibold text-muted-foreground"
                  style={{ includeFontPadding: false }}
                >
                  active cross-check
                </Text>
              </View>
              <View
                className="flex-row items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ backgroundColor: sevColors.pillBg }}
              >
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: sevColors.dot }} />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: sevColors.pillText, includeFontPadding: false }}
                >
                  {verdict.badge.toLowerCase()}
                </Text>
              </View>
            </View>

            {/* Drug comparison cards */}
            <View className="flex-row items-center gap-2.5">
              <View className="flex-1 bg-background rounded-2xl p-3.5">
                <Text className="text-xs font-semibold text-primary mb-1" style={{ includeFontPadding: false }}>
                  medicine a
                </Text>
                <Text className="text-base font-bold text-foreground" numberOfLines={1} style={{ includeFontPadding: false }}>
                  {drugA.name}
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1} style={{ includeFontPadding: false }}>
                  {drugA.generic}
                </Text>
              </View>

              <View className="w-8 h-8 rounded-full bg-secondary/60 items-center justify-center shrink-0">
                <Text className="text-xs font-bold text-muted-foreground" style={{ includeFontPadding: false }}>
                  vs
                </Text>
              </View>

              <View className="flex-1 bg-background rounded-2xl p-3.5">
                <Text className="text-xs font-semibold text-primary mb-1" style={{ includeFontPadding: false }}>
                  medicine b
                </Text>
                <Text className="text-base font-bold text-foreground" numberOfLines={1} style={{ includeFontPadding: false }}>
                  {drugB.name}
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1} style={{ includeFontPadding: false }}>
                  {drugB.generic}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Interaction Verdict Summary Card ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(80)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3">
            <View className="flex-row items-center gap-3 mb-2.5">
              <View
                className="w-10 h-10 rounded-2xl items-center justify-center shrink-0"
                style={{ backgroundColor: sevColors.bgTint }}
              >
                <Icon name={sevColors.icon} size={19} color={sevColors.iconColor} />
              </View>
              <View className="flex-1 min-w-0">
                <Text
                  className="text-base font-bold text-foreground leading-snug"
                  style={{ includeFontPadding: false }}
                >
                  {verdict.headline.toLowerCase()}
                </Text>
                <Text
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ includeFontPadding: false }}
                >
                  pharmacological cross-analysis
                </Text>
              </View>
            </View>

            {/* Biochemical Mechanism */}
            <View className="bg-background rounded-2xl p-3.5 my-2">
              <Text className="text-xs font-bold text-foreground mb-1" style={{ includeFontPadding: false }}>
                biochemical clash mechanism
              </Text>
              <Text className="text-xs text-muted-foreground leading-relaxed" style={{ includeFontPadding: false }}>
                {verdict.mechanism}
              </Text>
            </View>

            {/* Clinical Action Plan */}
            <View className="bg-background rounded-2xl p-3.5">
              <Text className="text-xs font-bold text-foreground mb-1" style={{ includeFontPadding: false }}>
                clinical recommendation
              </Text>
              <Text className="text-xs text-foreground font-medium leading-relaxed" style={{ includeFontPadding: false }}>
                {verdict.clinicalAction}
              </Text>
            </View>

            {/* Food Warnings */}
            {verdict.foodWarnings.length > 0 && (
              <View
                className="mt-3 pt-3"
                style={{ borderTopWidth: 1, borderTopColor: 'rgba(0, 0, 0, 0.05)' }}
              >
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-2"
                  style={{ includeFontPadding: false }}
                >
                  dietary & lifestyle precautions
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {verdict.foodWarnings.map((item, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center gap-1.5 bg-secondary/40 px-3 py-1.5 rounded-full"
                    >
                      <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <Text className="text-xs font-semibold text-foreground" style={{ includeFontPadding: false }}>
                        {item.label.toLowerCase()}:
                      </Text>
                      <Text className="text-xs text-muted-foreground" style={{ includeFontPadding: false }}>
                        {item.note}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>
        </Animated.View>

        {/* ── Quick Test Regimens ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(140)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3">
            <View className="flex-row items-center justify-between mb-2.5">
              <Text
                className="text-xs font-semibold text-muted-foreground"
                style={{ includeFontPadding: false }}
              >
                clinical presets
              </Text>
              <Icon name={Sparkles} size={14} color="#2e67ff" />
            </View>

            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => setPreset('1', '2')}
                activeOpacity={0.7}
                className="bg-secondary/40 px-3.5 py-2 rounded-full flex-row items-center gap-1.5 active:opacity-60"
              >
                <View className="w-2 h-2 rounded-full bg-destructive" />
                <Text className="text-xs font-semibold text-foreground" style={{ includeFontPadding: false }}>
                  Brufen + Warfarin (Severe)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPreset('1', '3')}
                activeOpacity={0.7}
                className="bg-secondary/40 px-3.5 py-2 rounded-full flex-row items-center gap-1.5 active:opacity-60"
              >
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d97706' }} />
                <Text className="text-xs font-semibold text-foreground" style={{ includeFontPadding: false }}>
                  Augmentin + Brufen (Moderate)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPreset('1', '4')}
                activeOpacity={0.7}
                className="bg-secondary/40 px-3.5 py-2 rounded-full flex-row items-center gap-1.5 active:opacity-60"
              >
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }} />
                <Text className="text-xs font-semibold text-foreground" style={{ includeFontPadding: false }}>
                  Panadol + Brufen (Safe)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPreset('3', '5')}
                activeOpacity={0.7}
                className="bg-secondary/40 px-3.5 py-2 rounded-full flex-row items-center gap-1.5 active:opacity-60"
              >
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d97706' }} />
                <Text className="text-xs font-semibold text-foreground" style={{ includeFontPadding: false }}>
                  Augmentin + Nexum (pH Shift)
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {/* ── Select Medication From Catalog ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(200)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-[15px] font-bold text-foreground" style={{ includeFontPadding: false }}>
                  Select from Catalog
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5" style={{ includeFontPadding: false }}>
                  Tap any drug to test live conflict
                </Text>
              </View>
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                <Icon name={Pill} size={15} color="#2e67ff" />
              </View>
            </View>

            <View className="gap-2 mt-2">
              {filteredCatalog.map((drug) => {
                const isSelected = selectedIds.includes(drug.id);
                return (
                  <TouchableOpacity
                    key={drug.id}
                    onPress={() => toggleDrug(drug)}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between p-3.5 rounded-2xl ${
                      isSelected
                        ? 'bg-primary/10'
                        : 'bg-background/80'
                    }`}
                  >
                    <View className="flex-row items-center gap-3 flex-1 min-w-0 pr-2">
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center shrink-0 ${
                          isSelected ? 'bg-primary' : 'bg-secondary/60'
                        }`}
                      >
                        <Icon
                          name={isSelected ? CheckCircle2 : Pill}
                          size={14}
                          color={isSelected ? '#ffffff' : '#2e67ff'}
                        />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? 'text-primary' : 'text-foreground'
                          }`}
                          style={{ includeFontPadding: false }}
                          numberOfLines={1}
                        >
                          {drug.name}
                        </Text>
                        <Text
                          className="text-[10px] text-muted-foreground mt-0.5"
                          style={{ includeFontPadding: false }}
                          numberOfLines={1}
                        >
                          {drug.generic} • {drug.class}
                        </Text>
                      </View>
                    </View>

                    <View
                      className={`px-3 py-1 rounded-full shrink-0 ${
                        isSelected ? 'bg-primary' : 'bg-secondary/40'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          isSelected ? 'text-white' : 'text-muted-foreground'
                        }`}
                        style={{ includeFontPadding: false }}
                      >
                        {isSelected ? 'Active' : '+ Add'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </Animated.View>
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
