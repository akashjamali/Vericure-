import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { SearchOverlay } from '@/components/ui/search-overlay';
import { TabPageTransition } from '@/components/ui/tab-page-transition';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Activity,
  Bell,
  Check,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  PenSquare,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
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
  TouchableOpacity,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  // User Profile State
  const [name, setName] = useState('Akash Bhutto');
  const [username, setUsername] = useState('akashbhutto');

  // BioShield Allergies State
  const [isBioShieldActive, setIsBioShieldActive] = useState(true);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    'Penicillin',
    'Sulfa Drugs',
    'Aspirin / NSAIDs',
  ]);

  // Preference Toggle
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  // Edit Modal Draft State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draftName, setDraftName] = useState('Akash Bhutto');
  const [draftUsername, setDraftUsername] = useState('akashbhutto');
  const [draftPassword, setDraftPassword] = useState('');

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {}
  };

  const handleOpenSearch = () => {
    triggerHaptic();
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCloseSearch = () => {
    triggerHaptic();
    Keyboard.dismiss();
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const toggleAllergy = (allergy: string) => {
    triggerHaptic();
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleOpenEdit = () => {
    triggerHaptic();
    setDraftName(name);
    setDraftUsername(username);
    setDraftPassword('');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    if (draftName.trim()) setName(draftName.trim());
    if (draftUsername.trim()) setUsername(draftUsername.trim().replace(/^@/, ''));
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Log Out',
      'Are you sure you want to sign out of your account on this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Top Header with App Logo & Search Button (Consistent with other tabs) ── */}
      <View
        className="bg-background pb-2"
        style={{
          paddingTop: Math.max(insets.top, 20) + 8,
          zIndex: 60,
        }}
      >
        {!isSearchOpen ? (
          <Animated.View
            entering={FadeIn.duration(280).easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(200).easing(Easing.in(Easing.cubic))}
            className="flex-row items-center justify-between px-5"
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
            className="flex-row items-center gap-2.5 px-5"
          >
            <View className="flex-1">
              <Input
                ref={searchInputRef}
                icon={Search}
                placeholder="Search medicines, members, settings..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                variant="filled"
                containerStyle={{
                  borderRadius: 999,
                  borderWidth: 0,
                  backgroundColor: '#ffffff',
                }}
                rightComponent={
                  searchQuery ? (
                    <Pressable
                      onPress={() => setSearchQuery('')}
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

            <Pressable
              onPress={handleCloseSearch}
              hitSlop={8}
              className="py-2 px-1"
            >
              <Text className="text-sm font-semibold text-primary">
                Cancel
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* ── Scrollable Body ── */}
      <TabPageTransition>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: insets.bottom + 36,
          }}
          showsVerticalScrollIndicator={false}
        >
        {/* ── User Profile Identity Card ── */}
        <Animated.View entering={FadeInDown.duration(280)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3.5 flex-1 min-w-0 pr-2">
                {/* Profile Avatar */}
                <View
                  className="w-13 h-13 rounded-full items-center justify-center shrink-0 overflow-hidden bg-white"
                  style={{
                    width: 52,
                    height: 52,
                    borderWidth: 2,
                    borderColor: '#2e67ff',
                    padding: 2,
                  }}
                >
                  <Image
                    source={require('@/assets/images/profile-avatar.jpg')}
                    style={{ width: '100%', height: '100%', borderRadius: 999 }}
                    resizeMode="cover"
                  />
                </View>

                {/* Identity Text */}
                <View className="flex-1 min-w-0">
                  <Text
                    className="text-lg font-bold text-foreground"
                    style={{ includeFontPadding: false }}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                  <Text
                    className="text-sm text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                    numberOfLines={1}
                  >
                    @{username}
                  </Text>
                  <View className="flex-row items-center gap-1.5 mt-2 self-start bg-primary/10 px-2.5 py-1 rounded-full">
                    <Icon name={ShieldCheck} size={13} color="#2e67ff" />
                    <Text
                      className="text-xs font-semibold text-primary"
                      style={{ includeFontPadding: false }}
                    >
                      verified account
                    </Text>
                  </View>
                </View>
              </View>

              {/* Edit Icon Button */}
              <TouchableOpacity
                onPress={handleOpenEdit}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-full bg-secondary/50 items-center justify-center shrink-0"
              >
                <Icon name={PenSquare} size={17} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {/* ── BioShield Health Profile (Allergies & Screening) ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(80)}>
          <Card className="bg-card border-0 rounded-[22px] p-4 shadow-none mb-3">
            <View className="flex-row items-center justify-between mb-3.5">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                  <Icon name={Shield} size={16} color="#2e67ff" />
                </View>
                <View>
                  <Text
                    className="text-sm font-bold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    bioshield screening
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    drug sensitivity & allergy radar
                  </Text>
                </View>
              </View>

              <Switch
                value={isBioShieldActive}
                onValueChange={(val) => {
                  triggerHaptic();
                  setIsBioShieldActive(val);
                }}
                trackColor={{ false: '#e2e8f0', true: '#2e67ff' }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Allergy Triggers */}
            <View>
              <Text
                className="text-xs font-semibold text-muted-foreground mb-2.5"
                style={{ includeFontPadding: false }}
              >
                known allergies & sensitivities
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  'Penicillin',
                  'Sulfa Drugs',
                  'Aspirin / NSAIDs',
                  'Cephalosporins',
                  'Latex',
                ].map((allergy) => {
                  const active = selectedAllergies.includes(allergy);
                  return (
                    <TouchableOpacity
                      key={allergy}
                      onPress={() => toggleAllergy(allergy)}
                      activeOpacity={0.7}
                      className={`px-3.5 py-2 rounded-full flex-row items-center gap-2 ${
                        active
                          ? 'bg-destructive/10'
                          : 'bg-secondary/40'
                      }`}
                    >
                      <View
                        className={`w-2 h-2 rounded-full ${
                          active ? 'bg-destructive' : 'bg-muted-foreground'
                        }`}
                      />
                      <Text
                        className={`text-xs font-medium ${
                          active ? 'text-destructive' : 'text-foreground'
                        }`}
                        style={{ includeFontPadding: false }}
                      >
                        {allergy}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Settings & Navigation Options (Single Minimal Card) ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(120)}>
          <Card className="bg-card border-0 rounded-[22px] p-2 shadow-none mb-3">
            {/* 1. Medical Conditions & Diseases (Dedicated Management Page) */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                router.push('/medical-conditions');
              }}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-3.5 rounded-2xl active:bg-secondary/30"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <Icon name={Activity} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    medical conditions & diseases
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    diagnosed diseases, status & contraindications
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="bg-primary/10 px-2.5 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-primary">manage</Text>
                </View>
                <Icon name={ChevronRight} size={16} color="#8e8e93" />
              </View>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.04)', marginHorizontal: 12 }} />

            {/* 2. Saved Reports */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                router.push('/saved-reports');
              }}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-3.5 rounded-2xl active:bg-secondary/30"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <Icon name={FileText} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    saved scan reports
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    7 verified certificates
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="bg-primary/10 px-2.5 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-primary">7</Text>
                </View>
                <Icon name={ChevronRight} size={16} color="#8e8e93" />
              </View>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.04)', marginHorizontal: 12 }} />

            {/* 3. Notifications */}
            <View className="flex-row items-center justify-between p-3.5">
              <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <Icon name={Bell} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    verification alerts
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    safety alerts & dosage reminders
                  </Text>
                </View>
              </View>
              <Switch
                value={isNotificationEnabled}
                onValueChange={(val) => {
                  triggerHaptic();
                  setIsNotificationEnabled(val);
                }}
                trackColor={{ false: '#e2e8f0', true: '#2e67ff' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.04)', marginHorizontal: 12 }} />

            {/* 4. Security & Privacy */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                router.push('/security-privacy');
              }}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-3.5 rounded-2xl active:bg-secondary/30"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <Icon name={Shield} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    security & privacy
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    passcode & encrypted telemetry
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#8e8e93" />
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.04)', marginHorizontal: 12 }} />

            {/* 5. Help & Support */}
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                router.push('/help-support');
              }}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-3.5 rounded-2xl active:bg-secondary/30"
            >
              <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <Icon name={HelpCircle} size={18} color="#2e67ff" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    help & support
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    faq library & verified support
                  </Text>
                </View>
              </View>
              <Icon name={ChevronRight} size={16} color="#8e8e93" />
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* ── Log Out Button ── */}
        <Animated.View entering={FadeInDown.duration(280).delay(180)}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="w-full py-4 bg-card rounded-full flex-row items-center justify-center gap-2 active:opacity-75"
          >
            <Icon name={LogOut} size={17} color="#ef4444" />
            <Text
              className="text-sm font-semibold text-destructive"
              style={{ includeFontPadding: false }}
            >
              sign out
            </Text>
          </TouchableOpacity>
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

      {/* ── Edit Profile Modal (Borderless Floating Card) ── */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-center items-center bg-black/50 px-5"
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
            className="w-full bg-card rounded-[26px] p-5 shadow-none"
            style={{ maxHeight: '85%' }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-lg font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                edit profile
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setIsEditModalOpen(false);
                }}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full bg-secondary/60 items-center justify-center"
              >
                <Icon name={X} size={15} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View className="gap-3.5">
              {/* Full Name */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  full name
                </Text>
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="e.g. akash bhutto"
                  placeholderTextColor="#94a3b8"
                  className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                  style={{ height: 46, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}
                />
              </View>

              {/* Username */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  username
                </Text>
                <TextInput
                  value={draftUsername}
                  onChangeText={setDraftUsername}
                  placeholder="e.g. akashbhutto"
                  autoCapitalize="none"
                  placeholderTextColor="#94a3b8"
                  className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                  style={{ height: 46, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}
                />
              </View>

              {/* Password */}
              <View>
                <Text
                  className="text-xs font-semibold text-muted-foreground mb-1.5"
                  style={{ includeFontPadding: false }}
                >
                  new password (optional)
                </Text>
                <TextInput
                  value={draftPassword}
                  onChangeText={setDraftPassword}
                  placeholder="leave empty to keep current"
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="bg-background rounded-full px-4 text-sm text-foreground font-medium"
                  style={{ height: 46, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}
                />
              </View>

              {/* Actions */}
              <View className="flex-row items-center gap-2.5 pt-2">
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsEditModalOpen(false);
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
                  onPress={handleSaveProfile}
                  activeOpacity={0.7}
                  className="flex-1 items-center justify-center bg-primary rounded-full"
                  style={{ height: 46 }}
                >
                  <Text
                    className="text-sm font-bold text-white"
                    style={{ includeFontPadding: false }}
                  >
                    save changes
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
