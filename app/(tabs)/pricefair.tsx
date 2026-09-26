import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import * as Haptics from 'expo-haptics';
import {
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  DollarSign,
  ExternalLink,
  HelpCircle,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GenericOption {
  name: string;
  manufacturer: string;
  pricePKR: number;
  drapReg: string;
  bioEquivalence: string;
  inStockNearby: boolean;
}

interface BrandedDrugComparison {
  id: string;
  brandName: string;
  brandManufacturer: string;
  activeSalt: string;
  dosage: string;
  brandPricePKR: number;
  bestGenericPricePKR: number;
  generics: GenericOption[];
}

const COMPARISON_DATABASE: BrandedDrugComparison[] = [
  {
    id: '1',
    brandName: 'Augmentin 625mg',
    brandManufacturer: 'GlaxoSmithKline (GSK)',
    activeSalt: 'Amoxicillin + Clavulanic Acid',
    dosage: '625mg (10 Tablets)',
    brandPricePKR: 1180,
    bestGenericPricePKR: 390,
    generics: [
      {
        name: 'Amoxyclav 625mg',
        manufacturer: 'Getz Pharma (Pvt) Ltd',
        pricePKR: 390,
        drapReg: 'DRAP-048192-A',
        bioEquivalence: '99.8% Certified',
        inStockNearby: true,
      },
      {
        name: 'Clavam 625mg',
        manufacturer: 'Ferozsons Laboratories',
        pricePKR: 440,
        drapReg: 'DRAP-039102-B',
        bioEquivalence: '99.4% Certified',
        inStockNearby: true,
      },
      {
        name: 'Augmax 625mg',
        manufacturer: 'Bosch Pharmaceuticals',
        pricePKR: 410,
        drapReg: 'DRAP-088192-C',
        bioEquivalence: '99.6% Certified',
        inStockNearby: false,
      },
    ],
  },
  {
    id: '2',
    brandName: 'Nexum 40mg',
    brandManufacturer: 'Getz Pharma / Nexium Astra',
    activeSalt: 'Esomeprazole Magnesium',
    dosage: '40mg (14 Capsules)',
    brandPricePKR: 850,
    bestGenericPricePKR: 280,
    generics: [
      {
        name: 'Esomax 40mg',
        manufacturer: 'Searle Company Limited',
        pricePKR: 280,
        drapReg: 'DRAP-029481-S',
        bioEquivalence: '99.9% Certified',
        inStockNearby: true,
      },
      {
        name: 'Esocare 40mg',
        manufacturer: 'Sami Pharmaceuticals',
        pricePKR: 310,
        drapReg: 'DRAP-010294-M',
        bioEquivalence: '99.5% Certified',
        inStockNearby: true,
      },
    ],
  },
  {
    id: '3',
    brandName: 'Lipitor 20mg',
    brandManufacturer: 'Pfizer Laboratories',
    activeSalt: 'Atorvastatin Calcium',
    dosage: '20mg (30 Tablets)',
    brandPricePKR: 1650,
    bestGenericPricePKR: 520,
    generics: [
      {
        name: 'Atorva 20mg',
        manufacturer: 'Getz Pharma',
        pricePKR: 520,
        drapReg: 'DRAP-077412-G',
        bioEquivalence: '99.7% Certified',
        inStockNearby: true,
      },
      {
        name: 'Lipiget 20mg',
        manufacturer: 'Getz Pharma',
        pricePKR: 580,
        drapReg: 'DRAP-099231-L',
        bioEquivalence: '99.8% Certified',
        inStockNearby: true,
      },
    ],
  },
  {
    id: '4',
    brandName: 'Cravit 500mg',
    brandManufacturer: 'Sanofi Pakistan',
    activeSalt: 'Levofloxacin',
    dosage: '500mg (10 Tablets)',
    brandPricePKR: 980,
    bestGenericPricePKR: 340,
    generics: [
      {
        name: 'Levoquin 500mg',
        manufacturer: 'Highnoon Laboratories',
        pricePKR: 340,
        drapReg: 'DRAP-055192-H',
        bioEquivalence: '99.6% Certified',
        inStockNearby: true,
      },
      {
        name: 'Novidat 500mg',
        manufacturer: 'Searle Company Limited',
        pricePKR: 360,
        drapReg: 'DRAP-066491-N',
        bioEquivalence: '99.5% Certified',
        inStockNearby: true,
      },
    ],
  },
];

export default function PriceFairScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDrug, setSelectedDrug] = useState<BrandedDrugComparison>(COMPARISON_DATABASE[0]);
  const [search, setSearch] = useState('');
  const [monthlyCycles, setMonthlyCycles] = useState(3);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const savingsPerPack = selectedDrug.brandPricePKR - selectedDrug.bestGenericPricePKR;
  const savingsPercent = Math.round((savingsPerPack / selectedDrug.brandPricePKR) * 100);
  const totalQuarterlySavings = savingsPerPack * monthlyCycles;

  const filteredList = COMPARISON_DATABASE.filter(
    (item) =>
      item.brandName.toLowerCase().includes(search.toLowerCase()) ||
      item.activeSalt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
      {/* ── Top App Bar ── */}
      <View
        className="pb-2"
        style={{
          backgroundColor: '#F8FAFC',
          paddingTop: Math.max(insets.top, 20) + 8,
          zIndex: 60,
        }}
      >
        <View className="flex-row items-center justify-between px-4">
          <AppLogo width={124} height={32} />
          <View
            className="flex-row items-center gap-1.5 px-3 py-1"
            style={{
              borderRadius: 20,
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
            }}
          >
            <Icon name={CircleDollarSign} size={14} color="#10B981" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: '#10B981',
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              PriceFair
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-2 pb-16 gap-3.5"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Headline ── */}
        <Animated.View entering={FadeIn.duration(240)}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Inter_700Bold',
              color: '#111827',
            }}
          >
            Generic Benchmark
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '400',
              color: '#4B5563',
              marginTop: 2,
              lineHeight: 18,
            }}
          >
            Find DRAP-certified, 100% bio-equivalent alternatives at fair benchmark prices
          </Text>
        </Animated.View>

        {/* ── Search Drug Selector ── */}
        <View
          className="flex-row items-center px-3.5 py-2.5 bg-card border border-border/40 rounded-full"
        >
          <Icon name={Search} size={15} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search expensive brand (Augmentin, Nexum, Lipitor)..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-xs text-foreground ml-2 p-0"
          />
          {search ? (
            <Pressable onPress={() => setSearch('')} hitSlop={6}>
              <Icon name={X} size={14} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>

        {/* Quick Drug Pills Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-4 px-4 gap-2"
        >
          {filteredList.map((d) => {
            const isSelected = selectedDrug.id === d.id;
            return (
              <Pressable
                key={d.id}
                onPress={() => {
                  triggerHaptic();
                  setSelectedDrug(d);
                }}
                className="px-3 py-1.5 mr-2"
                style={{
                  borderRadius: 20,
                  backgroundColor: isSelected ? '#2563EB' : '#ffffff',
                  borderWidth: 1,
                  borderColor: isSelected ? '#2563EB' : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isSelected ? '#ffffff' : '#111827',
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  {d.brandName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Price Comparison Hero Card ── */}
        <Animated.View entering={FadeInDown.duration(280)}>
          <Card>
            {/* Top Formulation Badge */}
            <View className="flex-row items-center justify-between pb-3 border-b border-border/40">
              <View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', fontFamily: 'Inter_700Bold' }}>
                  {selectedDrug.brandName}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>
                  {selectedDrug.activeSalt} • {selectedDrug.dosage}
                </Text>
              </View>
              <View
                className="px-2.5 py-1"
                style={{
                  borderRadius: 8,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981' }}>
                  Save {savingsPercent}%
                </Text>
              </View>
            </View>

            {/* Side-by-side Pricing Matrix */}
            <View className="flex-row items-center justify-between py-4">
              {/* Multinational Brand */}
              <View className="flex-1 items-center pr-2 border-r border-border/50">
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280' }}>
                  brand origin
                </Text>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: '800',
                    color: '#6B7280',
                    textDecorationLine: 'line-through',
                    marginTop: 2,
                  }}
                >
                  PKR {selectedDrug.brandPricePKR}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 2 }}>
                  {selectedDrug.brandManufacturer}
                </Text>
              </View>

              {/* Bio-Equivalent Generic */}
              <View className="flex-1 items-center pl-2">
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#10B981' }}>
                  certified generic
                </Text>
                <Text
                  style={{
                    fontSize: 23,
                    fontWeight: '800',
                    color: '#10B981',
                    marginTop: 2,
                  }}
                >
                  PKR {selectedDrug.bestGenericPricePKR}
                </Text>
                <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '500', textAlign: 'center', marginTop: 2 }}>
                  Save PKR {savingsPerPack} / pack
                </Text>
              </View>
            </View>

            {/* Quarterly Routine Impact Banner */}
            <View
              className="p-3"
              style={{
                borderRadius: 12,
                backgroundColor: '#F0FDF4',
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.15)',
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon name={TrendingDown} size={16} color="#10B981" />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#166534' }}>
                    3-Month Routine Patient Savings:
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#166534' }}>
                  PKR {totalQuarterlySavings.toLocaleString()}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Certified Bio-Equivalent Alternatives ── */}
        <View className="mt-1">
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              color: '#111827',
              marginBottom: 10,
            }}
          >
            Verified Bio-Equivalent Options ({selectedDrug.generics.length})
          </Text>

          <View className="gap-2.5">
            {selectedDrug.generics.map((generic, idx) => (
              <Animated.View key={idx} entering={FadeInDown.duration(280).delay(idx * 55)}>
                <Card>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 min-w-0 mr-3">
                      <View className="flex-row items-center gap-2">
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            fontFamily: 'Inter_600SemiBold',
                            color: '#111827',
                          }}
                          numberOfLines={1}
                        >
                          {generic.name}
                        </Text>
                        {generic.inStockNearby && (
                          <View
                            className="px-2 py-0.5"
                            style={{
                              borderRadius: 6,
                              backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            }}
                          >
                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#10B981' }}>
                              In Stock
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }} numberOfLines={1}>
                        {generic.manufacturer}
                      </Text>

                      <View className="flex-row items-center gap-3 mt-2">
                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                          Reg: {generic.drapReg}
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Icon name={ShieldCheck} size={12} color="#10B981" />
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#10B981' }}>
                            {generic.bioEquivalence}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Price and Choice */}
                    <View className="items-end shrink-0">
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '800',
                          color: '#111827',
                          fontFamily: 'Inter_700Bold',
                        }}
                      >
                        PKR {generic.pricePKR}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '600', marginTop: 1 }}>
                        -PKR {selectedDrug.brandPricePKR - generic.pricePKR}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* ── DRAP Regulatory Transparency Footnote ── */}
        <Card style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.04)' }}>
          <View className="flex-row items-start gap-3">
            <Icon name={ShieldCheck} size={18} color="#2563EB" />
            <View className="flex-1">
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#111827' }}>
                Regulatory Standards Notice
              </Text>
              <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 15 }}>
                All generic alternatives listed have passed DRAP (Drug Regulatory Authority of Pakistan) dissolution testing and contain the identical active pharmaceutical ingredient (API) in matching pharmacokinetic strengths.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
