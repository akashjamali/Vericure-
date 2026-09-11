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
  ArrowRight,
  Check,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Switch,
  TextInput,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SecurityPrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Settings State
  const [isPasscodeLockEnabled, setIsPasscodeLockEnabled] = useState(false);
  const [isDataSharingEnabled, setIsDataSharingEnabled] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleSavePassword = () => {
    triggerHaptic();
    setIsPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

      {/* ── Scrollable Body ── */}
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
            Security and Privacy
          </Text>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
            style={{ includeFontPadding: false }}
          >
            Manage app access controls and privacy preferences
          </Text>
        </Animated.View>

        {/* ── SECTION 1: APP ACCESS CONTROL ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(60)} className="gap-2.5">
          <Text
            className="text-xs font-bold text-muted-foreground px-1"
            style={{ includeFontPadding: false }}
          >
            App access control
          </Text>

          {/* App Passcode Lock Card */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text
                className="text-sm font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                App Passcode Lock
              </Text>
              <Text
                className="text-xs text-muted-foreground mt-1 leading-relaxed"
                style={{ includeFontPadding: false }}
              >
                Require phone passcode/PIN to open the app.
              </Text>
            </View>
            <Switch
              value={isPasscodeLockEnabled}
              onValueChange={(val) => {
                triggerHaptic();
                setIsPasscodeLockEnabled(val);
              }}
              trackColor={{ false: "#e7e4e4", true: "#2e67ff" }}
              thumbColor="#ffffff"
            />
          </Card>

          {/* Change Password Card */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <Pressable
              onPress={() => {
                triggerHaptic();
                setIsPasswordModalOpen(true);
              }}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-1 mr-4">
                <Text
                  className="text-sm font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Change Password
                </Text>
                <Text
                  className="text-xs text-muted-foreground mt-1 leading-relaxed"
                  style={{ includeFontPadding: false }}
                >
                  Update your account login password.
                </Text>
              </View>
              <View className="w-8 h-8 rounded-full bg-primary/10 border border-border items-center justify-center">
                <Icon name={ArrowRight} size={15} color="#2e67ff" />
              </View>
            </Pressable>
          </Card>
        </Animated.View>

        {/* ── SECTION 2: DATA & ANALYTICS ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(120)} className="gap-2.5">
          <Text
            className="text-xs font-bold text-muted-foreground px-1"
            style={{ includeFontPadding: false }}
          >
            Data & analytics
          </Text>

          {/* Anonymous Data Sharing */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text
                className="text-sm font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                Anonymous Data Sharing
              </Text>
              <Text
                className="text-xs text-muted-foreground mt-1 leading-relaxed"
                style={{ includeFontPadding: false }}
              >
                Share scan analytics to help improve fake medicine detection models.
              </Text>
            </View>
            <Switch
              value={isDataSharingEnabled}
              onValueChange={(val) => {
                triggerHaptic();
                setIsDataSharingEnabled(val);
              }}
              trackColor={{ false: "#e7e4e4", true: "#2e67ff" }}
              thumbColor="#ffffff"
            />
          </Card>

          {/* Your Privacy Matters Card */}
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-xl bg-primary/10 border border-border items-center justify-center shrink-0 mt-0.5">
                <Icon name={Check} size={16} color="#2e67ff" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-sm font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Your Privacy Matters
                </Text>
                <Text
                  className="text-xs text-muted-foreground leading-relaxed mt-1"
                  style={{ includeFontPadding: false }}
                >
                  Your account and verification data are protected. Data sharing is optional and can be disabled at any time.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* ── Change Password Popup Modal ── */}
      <Modal
        visible={isPasswordModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPasswordModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center bg-black/60 px-5"
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => {
              Keyboard.dismiss();
              setIsPasswordModalOpen(false);
            }}
          />

          <Animated.View
            entering={FadeIn.duration(200)}
            className="w-full bg-card border border-border rounded-3xl p-5 shadow-none"
            style={{ maxHeight: "85%" }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={Lock} size={18} color="#2e67ff" />
                </View>
                <Text
                  className="text-base font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Change Password
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setIsPasswordModalOpen(false);
                }}
                hitSlop={8}
                className="w-7 h-7 rounded-full border border-border items-center justify-center active:opacity-60"
              >
                <Icon name={X} size={14} color="#0e142b" />
              </Pressable>
            </View>

            {/* Inputs */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="gap-3.5 pb-2"
            >
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  Current password
                </Text>
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter current password"
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>

              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  New password
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>

              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  Confirm new password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>

              <View className="flex-row items-center gap-3 pt-2">
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsPasswordModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full border border-border items-center justify-center bg-background active:opacity-75"
                >
                  <Text
                    className="text-xs font-bold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSavePassword}
                  className="flex-1 py-3 rounded-full bg-primary items-center justify-center active:opacity-85"
                >
                  <Text
                    className="text-xs font-bold text-primary-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Update Password
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
