import { AppLogo } from "@/components/ui/app-logo";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  LogOut,
  Shield,
  ShieldCheck,
  User,
  UserCog,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // User Profile State
  const [name, setName] = useState("Akash Bhutto");
  const [username, setUsername] = useState("akashbhutto");
  const [password, setPassword] = useState("••••••••••••");

  // Edit Modal Draft State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftName, setDraftName] = useState("Akash Bhutto");
  const [draftUsername, setDraftUsername] = useState("akashbhutto");
  const [draftPassword, setDraftPassword] = useState("");

  // Preference Toggle
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleOpenEdit = () => {
    triggerHaptic();
    setDraftName(name);
    setDraftUsername(username);
    setDraftPassword("");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    triggerHaptic();
    if (draftName.trim()) setName(draftName.trim());
    if (draftUsername.trim()) setUsername(draftUsername.trim().replace(/^@/, ""));
    if (draftPassword.trim()) setPassword("••••••••••••");
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    triggerHaptic();
    Alert.alert(
      "Log Out",
      "Are you sure you want to sign out of your VeriCure account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            triggerHaptic();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Top Header with App Logo ── */}
      <View
        className="bg-background pb-3"
        style={{ paddingTop: Math.max(insets.top, 20) + 8, zIndex: 60 }}
      >
        <View className="flex-row items-center justify-between px-5">
          <View className="items-start">
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
        {/* Section Heading */}
        <Animated.View entering={FadeInDown.duration(260)} className="py-1">
          <Text
            className="text-lg font-bold text-foreground"
            style={{ includeFontPadding: false }}
          >
            User Profile
          </Text>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
            style={{ includeFontPadding: false }}
          >
            Manage your account credentials and system preferences
          </Text>
        </Animated.View>

        {/* ── User Profile Card ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(50)}>
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <View className="flex-row items-center gap-3.5">
              {/* Profile Image with Full Rounded Border & Bg */}
              <View
                className="w-14 h-14 rounded-full items-center justify-center shrink-0 overflow-hidden"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: '#2b65ff',
                  backgroundColor: '#ffffff',
                  padding: 2,
                }}
              >
                <Image
                  source={require('@/assets/images/profile-avatar.jpg')}
                  style={{ width: '100%', height: '100%', borderRadius: 999 }}
                  resizeMode="cover"
                />
              </View>

              {/* Identity Info */}
              <View className="flex-1 min-w-0">
                <Text
                  className="text-base font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                  numberOfLines={1}
                >
                  {name}
                </Text>
                <Text
                  className="text-xs text-muted-foreground mt-0.5 font-medium"
                  style={{ includeFontPadding: false }}
                  numberOfLines={1}
                >
                  @{username}
                </Text>

                {/* Verified Patient Tag */}
                <View className="flex-row items-center gap-1.5 mt-2 bg-primary/10 border border-border px-2.5 py-0.5 rounded-full self-start">
                  <Icon name={ShieldCheck} size={12} color="#2e67ff" />
                  <Text
                    className="text-[11px] font-bold text-primary"
                    style={{ includeFontPadding: false }}
                  >
                    Verified Patient
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Category 1: Account Settings ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(100)} className="gap-2">
          <Text
            className="text-xs font-bold text-muted-foreground px-1"
            style={{ includeFontPadding: false }}
          >
            Account settings
          </Text>

          <Card className="bg-card border border-border rounded-xl p-2 shadow-none overflow-hidden">
            {/* Edit Profile Button */}
            <Pressable
              onPress={handleOpenEdit}
              className="flex-row items-center justify-between p-3 rounded-xl active:bg-background"
            >
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={UserCog} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Edit Profile
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    Update name, username, and password
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#0e142b" />
            </Pressable>

            <View className="h-[1px] bg-border mx-3" />

            {/* Verification Region (Not Available) */}
            <View className="flex-row items-center justify-between p-3 rounded-xl opacity-75">
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-9 h-9 items-center justify-center">
                  <Icon name={Globe} size={20} color="#0e142b" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Verification Region
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    Regional cryptographic gateway registry
                  </Text>
                </View>
              </View>

              {/* Not Available Pill */}
              <View className="bg-background border border-border px-2.5 py-1 rounded-full">
                <Text
                  className="text-[10px] font-bold text-muted-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Not available
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Category 2: Preference and Features ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(150)} className="gap-2">
          <Text
            className="text-xs font-bold text-muted-foreground px-1"
            style={{ includeFontPadding: false }}
          >
            Preference and features
          </Text>

          {/* 1. Saved Scan Reports */}
          <Card className="bg-card border border-border rounded-xl p-3 shadow-none">
            <Pressable
              onPress={() => {
                triggerHaptic();
                router.push("/saved-reports");
              }}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={FileText} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Saved Scan Reports
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    7 authenticated cryptographic certificates
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                  <Text className="text-xs font-bold text-primary">7</Text>
                </View>
                <Icon name={ChevronRight} size={16} color="#0e142b" />
              </View>
            </Pressable>
          </Card>

          {/* 2. Verification Notification */}
          <Card className="bg-card border border-border rounded-xl p-3 shadow-none">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={ShieldCheck} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Verification Notification
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    Alerts on counter-check results and warnings
                  </Text>
                </View>
              </View>

              {/* Native Switch with index.css brand color */}
              <Switch
                value={isNotificationEnabled}
                onValueChange={(val) => {
                  triggerHaptic();
                  setIsNotificationEnabled(val);
                }}
                trackColor={{ false: "#e7e4e4", true: "#2e67ff" }}
                thumbColor="#ffffff"
              />
            </View>
          </Card>

          {/* 3. Security and Privacy */}
          <Card className="bg-card border border-border rounded-xl p-3 shadow-none">
            <Pressable
              onPress={() => {
                triggerHaptic();
                router.push("/security-privacy");
              }}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={Shield} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Security and Privacy
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    App passcode lock and privacy governance
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#0e142b" />
            </Pressable>
          </Card>

          {/* 4. Help and Support */}
          <Card className="bg-card border border-border rounded-xl p-3 shadow-none">
            <Pressable
              onPress={() => {
                triggerHaptic();
                router.push("/help-support");
              }}
              className="flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3 flex-1 mr-3">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={HelpCircle} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Help and Support
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    Assistant, support callback, and FAQ library
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#0e142b" />
            </Pressable>
          </Card>
        </Animated.View>

        {/* ── Log Out Button ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(200)} className="pt-2">
          <Pressable
            onPress={handleLogout}
            className="w-full py-3.5 bg-card flex-row items-center justify-center gap-2 active:opacity-75"
            style={{ borderRadius: 999, overflow: "hidden" }}
          >
            <Icon name={LogOut} size={16} color="#ff6c35" />
            <Text
              className="text-sm font-bold text-destructive"
              style={{ includeFontPadding: false }}
            >
              Log out
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* ── Edit Profile Dialog (Fully Rounded Minimal Popup) ── */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center bg-black/60 px-5"
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => {
              Keyboard.dismiss();
              setIsEditModalOpen(false);
            }}
          />

          <Animated.View
            entering={FadeIn.duration(200)}
            className="w-full bg-card border border-border rounded-3xl p-5 shadow-none"
            style={{ maxHeight: "85%" }}
          >
            {/* Simple Minimal Header: Title + Close Icon (no divider bands) */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon name={UserCog} size={18} color="#2e67ff" />
                </View>
                <Text
                  className="text-base font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Edit Profile
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setIsEditModalOpen(false);
                }}
                hitSlop={8}
                className="w-7 h-7 rounded-full border border-border items-center justify-center active:opacity-60"
              >
                <Icon name={X} size={14} color="#0e142b" />
              </Pressable>
            </View>

            {/* Form Fields */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="gap-3.5 pb-2"
            >
              {/* Full Name */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  Full name
                </Text>
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="e.g. Akash Bhutto"
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground font-medium"
                />
              </View>

              {/* Username */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  Username
                </Text>
                <TextInput
                  value={draftUsername}
                  onChangeText={setDraftUsername}
                  placeholder="e.g. akashbhutto"
                  autoCapitalize="none"
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground font-medium"
                />
              </View>

              {/* Password */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  Password
                </Text>
                <TextInput
                  value={draftPassword}
                  onChangeText={setDraftPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground font-medium"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center gap-3 pt-2">
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsEditModalOpen(false);
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
                  onPress={handleSaveProfile}
                  className="flex-1 py-3 rounded-full bg-primary items-center justify-center active:opacity-85"
                >
                  <Text
                    className="text-xs font-bold text-primary-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    Save Changes
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
