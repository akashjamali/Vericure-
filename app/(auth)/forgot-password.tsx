import { AppLogo } from '@/components/ui/app-logo';
import { AvoidKeyboard } from '@/components/ui/avoid-keyboard';
import { Button } from '@/components/ui/button';
import { HealthBackground } from '@/components/ui/health-background';
import { InputOTP } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
    }, 300);
  };

  const handleOtpSubmit = (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    if (code.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpVerified(true);
    }, 300);
  };

  const handlePasswordSubmit = () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(auth)/login');
    }, 400);
  };

  const handleChangeEmail = () => {
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setOtp('');
    setError('');
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

      {/* Form centered in the middle of the screen */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center items-center px-6 pb-8"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[340px] gap-4">
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
              {isOtpVerified ? 'Set new password' : 'Forgot password?'}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                lineHeight: 18,
                textAlign: 'center',
                color: '#64748b',
                paddingHorizontal: 8,
              }}
            >
              {isOtpVerified
                ? 'Enter and confirm your new password below'
                : isOtpSent
                  ? 'Verify the code sent to your email to continue'
                  : 'Enter your email to receive a 6-digit verification code'}
            </Text>
          </View>

          {/* Single Unified Flow */}
          <View className="gap-3">
            {/* Email Field */}
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between px-1">
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 12,
                    color: '#475569',
                  }}
                >
                  Email
                </Text>
                {isOtpSent && !isOtpVerified && (
                  <Pressable onPress={handleChangeEmail} hitSlop={6}>
                    <Text
                      style={{
                        fontFamily: 'Inter_500Medium',
                        fontSize: 12,
                        color: '#2b65ff',
                      }}
                    >
                      Change
                    </Text>
                  </Pressable>
                )}
              </View>
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
                editable={!isOtpSent}
                variant="outline"
              />
            </View>

            {/* Continue Button (before OTP is sent) */}
            {!isOtpSent && (
              <Button
                variant="default"
                size="sm"
                loading={isLoading}
                onPress={handleEmailSubmit}
                className="w-full mt-1 rounded-full"
              >
                Continue
              </Button>
            )}

            {/* OTP Section (appears directly below email on Continue click) */}
            {isOtpSent && !isOtpVerified && (
              <View className="gap-4 mt-2">
                <View className="items-center px-2 py-1">
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 13,
                      lineHeight: 20,
                      textAlign: 'center',
                      color: '#64748b',
                    }}
                  >
                    Enter the 6-digit code sent to{' '}
                    <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#1e293b' }}>{email}</Text>
                  </Text>
                </View>

                {/* Professionally aligned OTP slots with clear vertical breathing room */}
                <View className="w-full items-center justify-center my-2">
                  <InputOTP
                    length={6}
                    value={otp}
                    onChangeText={(val) => {
                      setOtp(val);
                      setError('');
                      if (val.length === 6) {
                        handleOtpSubmit(val);
                      }
                    }}
                    slotStyle={{
                      width: 42,
                      height: 50,
                      borderRadius: 12,
                      backgroundColor: '#ffffff',
                    }}
                  />
                </View>

                <Button
                  variant="default"
                  size="sm"
                  loading={isLoading}
                  onPress={() => handleOtpSubmit()}
                  className="w-full rounded-full"
                  style={{ width: '100%', height: 46, alignItems: 'center', justifyContent: 'center' }}
                  textStyle={{ textAlign: 'center', width: '100%', fontWeight: '600', fontSize: 15 }}
                >
                  Verify code
                </Button>

                <Pressable
                  onPress={() => {
                    setOtp('');
                    setError('');
                  }}
                  hitSlop={10}
                  className="self-center py-2"
                >
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 13,
                      lineHeight: 18,
                      textAlign: 'center',
                      color: '#64748b',
                    }}
                  >
                    Didn't receive code?{' '}
                    <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#2b65ff' }}>
                      Resend
                    </Text>
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Set New Password Section (appears after OTP is verified) */}
            {isOtpVerified && (
              <View className="gap-2.5 mt-1">
                <View className="gap-1.5">
                  <Text
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 12,
                      color: '#475569',
                      marginLeft: 4,
                    }}
                  >
                    New password
                  </Text>
                  <Input
                    placeholder="••••••••"
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
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
                    Confirm new password
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

                <Button
                  variant="default"
                  size="sm"
                  loading={isLoading}
                  onPress={handlePasswordSubmit}
                  className="w-full mt-1.5 rounded-full"
                >
                  Reset password
                </Button>
              </View>
            )}

            {/* Inline Error Message */}
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
              Remember your password?
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
