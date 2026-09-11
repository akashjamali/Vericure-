import { AppLogo } from '@/components/ui/app-logo';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  RotateCcw,
  Share2,
  ShieldCheck,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, Share } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    item?: string;
    generic?: string;
  }>();

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleBack = () => {
    triggerHaptic();
    router.back();
  };

  const handleScanAnother = () => {
    triggerHaptic();
    router.replace('/(tabs)/(home)');
  };

  const handleShare = async () => {
    triggerHaptic();
    try {
      await Share.share({
        message: `VeriCure Authentic Medicine Verification\nProduct: Augmentin 625mg\nBatch: #BNT-89240-PK\nStatus: 100% Genuine Verified\nExpiry: 11/2028`,
      });
    } catch {}
  };

  return (
    <View className="flex-1 bg-background">
      {/* Same Header as Home Screen: AppLogo on left, Clean Actions on right */}
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
              className="w-9 h-9 rounded-full bg-background items-center justify-center border border-border active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name={ArrowLeft} size={18} color="#0e142b" />
            </Pressable>

            <AppLogo width={96} height={32} />
          </View>

          <Pressable
            onPress={handleShare}
            hitSlop={8}
            className="w-9 h-9 rounded-full bg-background items-center justify-center border border-border active:opacity-60"
            accessibilityRole="button"
            accessibilityLabel="Share verification"
          >
            <Icon name={Share2} size={16} color="#0e142b" />
          </Pressable>
        </View>
      </View>

      {/* Main Content: Clean Minimal Smooth Results */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-3 pb-12 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {/* Verification Status Banner */}
        <Animated.View
          entering={FadeIn.duration(280)}
          className="items-center py-4 bg-card rounded-xl border border-border"
        >
          <View className="w-14 h-14 rounded-full bg-emerald-500/10 items-center justify-center mb-3">
            <Icon name={ShieldCheck} size={28} color="#10b981" />
          </View>

          <View className="flex-row items-center gap-1.5 mb-1">
            <Text className="text-xs font-bold text-emerald-600">
              Authentic medicine
            </Text>
            <Icon name={CheckCircle2} size={14} color="#10b981" />
          </View>

          <Text className="text-xl font-bold text-foreground text-center">
            {params.item || 'Augmentin 625mg'}
          </Text>

          <Text className="text-xs text-muted-foreground text-center mt-0.5">
            {params.generic || 'Amoxicillin & Clavulanate Potassium'}
          </Text>
        </Animated.View>

        {/* Clean Smooth Text Details Table */}
        <Animated.View
          entering={FadeInDown.duration(320).delay(80)}
          className="bg-card rounded-xl border border-border p-4 gap-3.5"
        >
          <Text
            className="text-xs font-semibold text-muted-foreground"
            style={{ includeFontPadding: false }}
          >
            Verification specifications
          </Text>

          <View className="divide-y divide-border">
            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">Status</Text>
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-xs font-bold text-emerald-600">
                  100% Genuine Verified
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">
                Batch Number
              </Text>
              <Text className="text-xs font-mono font-bold text-foreground">
                {params.code || 'BNT-89240-PK'}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">
                Manufacturer
              </Text>
              <Text className="text-xs font-medium text-foreground">
                GlaxoSmithKline (GSK)
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">
                Manufacturing Date
              </Text>
              <Text className="text-xs font-medium text-foreground">
                01 / 2025
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">Expiry Date</Text>
              <Text className="text-xs font-bold text-emerald-600">
                11 / 2028 (34 Months Remaining)
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">
                Packaging Surface
              </Text>
              <Text className="text-xs font-medium text-foreground">
                Genuine Box & Blister Imprint
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">
                Cryptographic Seal
              </Text>
              <Text className="text-xs font-mono text-foreground">
                SHA-256 Validated
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2.5">
              <Text className="text-xs text-muted-foreground">
                Anomaly Confidence
              </Text>
              <Text className="text-xs font-bold text-emerald-600">
                99.98% Authentic
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.duration(320).delay(140)}
          className="gap-2.5 pt-1"
        >
          <Pressable
            onPress={handleScanAnother}
            className="w-full py-3.5 rounded-full bg-[#2b65ff] flex-row items-center justify-center gap-2 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="Scan another drug"
          >
            <Icon name={RotateCcw} size={16} color="#ffffff" />
            <Text className="text-white text-xs font-bold">
              Scan Another Medicine
            </Text>
          </Pressable>

          <Pressable
            onPress={handleBack}
            className="w-full py-3.5 rounded-full bg-background border border-border flex-row items-center justify-center gap-2 active:opacity-75"
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
          >
            <Icon name={FileText} size={15} color="#0e142b" />
            <Text className="text-foreground text-xs font-semibold">
              Back to Home
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
