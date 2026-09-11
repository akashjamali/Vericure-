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

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/(home)');
    }, 400);
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)/(home)');
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
              Login to your account
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              Enter your email below to login to your account
            </Text>
          </View>

          {/* Form */}
          <View className="gap-3">
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
              <View className="flex-row items-center justify-between px-1">
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 12,
                    color: '#475569',
                  }}
                >
                  Password
                </Text>
                <Pressable
                  onPress={() => router.push('/(auth)/forgot-password')}
                  hitSlop={8}
                >
                  <Text
                    style={{
                      fontFamily: 'Inter_500Medium',
                      fontSize: 12,
                      color: '#2b65ff',
                    }}
                  >
                    Forgot your password?
                  </Text>
                </Pressable>
              </View>
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
              onPress={handleLogin}
              className="w-full mt-1 rounded-full"
              style={{ height: 46 }}
            >
              Login
            </Button>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-0.5">
            <View className="flex-1 h-[1px] bg-slate-200" />
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 11,
                color: '#94a3b8',
                paddingHorizontal: 12,
              }}
            >
              Or
            </Text>
            <View className="flex-1 h-[1px] bg-slate-200" />
          </View>

          {/* Guest Button */}
          <Pressable
            onPress={handleGuestLogin}
            className="w-full rounded-full items-center justify-center active:opacity-80"
            style={{
              height: 46,
              backgroundColor: '#ffffff',
              borderWidth: 0,
              borderColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
            }}
          >
            <Text
              style={{
                color: '#334155',
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              Continue with guest
            </Text>
          </Pressable>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1.5 mt-2">
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#64748b',
              }}
            >
              Don't have an account?
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/signup')}
              hitSlop={8}
            >
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 13,
                  color: '#2b65ff',
                }}
              >
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <AvoidKeyboard />
    </View>
  );
}
