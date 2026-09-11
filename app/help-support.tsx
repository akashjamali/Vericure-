import { AppLogo } from "@/components/ui/app-logo";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Info,
  Mail,
  PhoneCall,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Linking, Pressable } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FaqItem {
  id: string;
  num: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "1",
    num: "1",
    question: "How do I scan a medicine?",
    answer:
      "Tap the 'Scan Drug Authenticity' banner on your Home dashboard or access the scanner tab directly. Point your camera at the QR code, GS1 DataMatrix code, or serial barcode printed on the medicine box or blister pack. The scanner will instantly process and verify the product against pharmaceutical registries.",
  },
  {
    id: "2",
    num: "2",
    question: "How should I capture the medicine?",
    answer:
      "Hold the medicine package steady in a well-lit area. Avoid harsh reflections or glares on glossy packaging. Make sure the entire square barcode and adjacent batch number digits fit squarely within the camera viewfinder frame.",
  },
  {
    id: "3",
    num: "3",
    question: "What does the verification result mean?",
    answer:
      "Verified Genuine confirms the cryptographic SHA-256 seal matches manufacturer batch numbers with zero tamper flags. Counterfeit or Anomaly warnings indicate non-registered serial IDs, expired certification seals, or flagged recalled batches.",
  },
  {
    id: "4",
    num: "4",
    question: "How do I save a medicine to My Cabinet?",
    answer:
      "Once a medicine is scanned and verified, tap 'Save to Cabinet' on the result screen. Alternatively, open 'My Medicine Cabinet' from your home screen and tap the '+ Add' button to manually enter prescription dosage, schedule, and expiration dates.",
  },
  {
    id: "5",
    num: "5",
    question: "How do I view my saved medicines?",
    answer:
      "Navigate to 'My Medicine Cabinet' from the home screen quick action or dashboard card. You will see summary statistics (Active, Expiring Soon, Expired) and full detailed records of all medications saved for family members.",
  },
  {
    id: "6",
    num: "6",
    question: "What should I do if an anomaly is detected?",
    answer:
      "Do not consume or administer the medication. Keep the packaging intact for inspection, report the counterfeit detection log to your dispensing pharmacy, and report the batch directly to regulatory healthcare authorities.",
  },
];

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const toggleFaq = (id: string) => {
    triggerHaptic();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAiAssistant = () => {
    triggerHaptic();
    Alert.alert(
      "AI Assistant",
      "VeriCure AI Assistant is ready to help you analyze drug packaging, dosage instructions, and verification queries."
    );
  };

  const handleSupportCall = () => {
    triggerHaptic();
    Alert.alert(
      "Request Support Call",
      "A VeriCure clinical verification specialist will contact your registered phone number within 15 minutes."
    );
  };

  const handleEmailSupport = () => {
    triggerHaptic();
    try {
      Linking.openURL("mailto:support@counterfeitdetector.pk?subject=VeriCure%20Inquiry");
    } catch {}
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
              hitSlop={8}
              className="w-9 h-9 rounded-full bg-background items-center justify-center border border-border active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name={ArrowLeft} size={18} color="#0e142b" />
            </Pressable>
            <AppLogo width={96} height={32} />
          </View>
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2 pb-16 gap-2.5"
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Animated.View entering={FadeInDown.duration(260)} className="py-1">
          <Text
            className="text-lg font-bold text-foreground"
            style={{ includeFontPadding: false }}
          >
            Help and Support
          </Text>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
            style={{ includeFontPadding: false }}
          >
            Get assistance with medicine verification and features
          </Text>
        </Animated.View>

        {/* ── Banner: How can we help you? ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(60)}>
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none items-start">
            <View className="w-11 h-11 rounded-xl bg-primary/10 border border-border items-center justify-center mb-3">
              <Icon name={HelpCircle} size={22} color="#2e67ff" />
            </View>
            <Text
              className="text-base font-bold text-foreground"
              style={{ includeFontPadding: false }}
            >
              How can we help you?
            </Text>
            <Text
              className="text-xs text-muted-foreground leading-relaxed mt-1"
              style={{ includeFontPadding: false }}
            >
              Get assistance with medicine verification, scanning, account-related questions, or other VeriCure features.
            </Text>
          </Card>
        </Animated.View>

        {/* ── Contact Quick Action Rows ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(110)} className="gap-2.5">
          {/* AI Assistant */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <Pressable
              onPress={handleAiAssistant}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                <View className="w-10 h-10 rounded-xl bg-primary/10 border border-border items-center justify-center shrink-0">
                  <Icon name={Bot} size={20} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-bold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    AI Assistant
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5 leading-relaxed"
                    style={{ includeFontPadding: false }}
                  >
                    Ask questions about medicine verification and get assistance instantly.
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#0e142b" />
            </Pressable>
          </Card>

          {/* Request Support Call */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <Pressable
              onPress={handleSupportCall}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                <View className="w-10 h-10 rounded-xl bg-primary/10 border border-border items-center justify-center shrink-0">
                  <Icon name={PhoneCall} size={20} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-bold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Request Support Call
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5 leading-relaxed"
                    style={{ includeFontPadding: false }}
                  >
                    Request a callback from a VeriCure support specialist.
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#0e142b" />
            </Pressable>
          </Card>

          {/* Email Support */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <Pressable
              onPress={handleEmailSupport}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                <View className="w-10 h-10 rounded-xl bg-primary/10 border border-border items-center justify-center shrink-0">
                  <Icon name={Mail} size={20} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-bold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Email Support
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    Contact our support team through email.
                  </Text>
                  <Text
                    className="text-xs font-semibold text-primary mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    support@counterfeitdetector.pk
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#0e142b" />
            </Pressable>
          </Card>
        </Animated.View>

        {/* ── Need Help with Verification Advisory ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(150)}>
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-xl bg-primary/10 border border-border items-center justify-center shrink-0 mt-0.5">
                <Icon name={Info} size={16} color="#2e67ff" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-sm font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Need help with verification?
                </Text>
                <Text
                  className="text-xs text-muted-foreground leading-relaxed mt-1"
                  style={{ includeFontPadding: false }}
                >
                  Make sure the medicine package is clearly visible when scanning. If a serial number is illegible, use manual entry in My Cabinet.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Frequently Asked Questions (Accordion) ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(190)} className="gap-2.5 pt-2">
          <View className="flex-row items-center justify-between px-1">
            <Text
              className="text-xs font-bold text-muted-foreground"
              style={{ includeFontPadding: false }}
            >
              Frequently asked questions
            </Text>
          </View>

          <View className="gap-2.5">
            {FAQ_DATA.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <Card
                  key={faq.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-none overflow-hidden"
                >
                  <Pressable
                    onPress={() => toggleFaq(faq.id)}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-3 flex-1 mr-3">
                      <View className="w-7 h-7 rounded-full bg-primary/10 border border-border items-center justify-center shrink-0">
                        <Text
                          className="text-xs font-bold text-primary"
                          style={{ includeFontPadding: false }}
                        >
                          {faq.num}
                        </Text>
                      </View>
                      <Text
                        className="text-sm font-bold text-foreground flex-1"
                        style={{ includeFontPadding: false }}
                      >
                        {faq.question}
                      </Text>
                    </View>
                    <Icon
                      name={isOpen ? ChevronDown : ChevronRight}
                      size={16}
                      color="#0e142b"
                    />
                  </Pressable>

                  {isOpen && (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      className="mt-3 pt-3 border-t border-border"
                    >
                      <Text
                        className="text-xs text-muted-foreground leading-relaxed pl-10"
                        style={{ includeFontPadding: false }}
                      >
                        {faq.answer}
                      </Text>
                    </Animated.View>
                  )}
                </Card>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
