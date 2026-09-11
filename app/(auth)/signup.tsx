import { AppLogo } from '@/components/ui/app-logo';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Button } from '@/components/ui/button';
import { HealthBackground } from '@/components/ui/health-background';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/(home)');
    }, 400);
  };

  return (
    <View className="flex-1 bg-background">
      <HealthBackground />

      {/* Top Left Brand Logo */}
      <View
        className="px-6 items-start"
        style={{ paddingTop: Math.max(insets.top, 20) + 8 }}
      >
        <AppLogo width={125} height={34} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center items-center px-6 pb-8"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[320px] gap-4">
          {/* Header */}
          <View className="items-center gap-1">
            <Text
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 24,
                color: '#1e293b',
                textAlign: 'center',
                letterSpacing: -0.3,
              }}
            >
              Create an account
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              Join VeriCure to manage your health securely
            </Text>
          </View>

          {/* Form */}
          <View className="gap-2.5">
            <View className="gap-1.5">
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  color: '#475569',
                  marginLeft: 4,
                }}
              >
                Full name
              </Text>
              <Input
                placeholder="John Doe"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setError('');
                }}
                autoCapitalize="words"
                variant="outline"
              />
            </View>

            <View className="gap-1.5">
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  color: '#475569',
                  marginLeft: 4,
                }}
              >
                Email
              </Text>
              <Input
                placeholder="m@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                variant="outline"
              />
            </View>

            <View className="gap-1.5">
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  color: '#475569',
                  marginLeft: 4,
                }}
              >
                Password
              </Text>
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry
                variant="outline"
              />
            </View>

            <View className="gap-1.5">
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 12,
                  color: '#475569',
                  marginLeft: 4,
                }}
              >
                Confirm password
              </Text>
              <Input
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                secureTextEntry
                variant="outline"
              />
            </View>

            {error ? (
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 12,
                  color: '#ef4444',
                  textAlign: 'center',
                  marginTop: 2,
                }}
              >
                {error}
              </Text>
            ) : null}

            <Button
              variant="default"
              size="sm"
              loading={isLoading}
              onPress={handleSignup}
              className="w-full mt-1.5 rounded-full"
            >
              Continue signup
            </Button>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1.5 mt-2">
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#64748b',
              }}
            >
              Already have an account?
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              hitSlop={8}
            >
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 13,
                  color: '#2b65ff',
                }}
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <AvoidKeyboard />
    </View>
  );
}
