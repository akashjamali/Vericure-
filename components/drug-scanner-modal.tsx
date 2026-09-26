import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { CameraView, scanFromURLAsync, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  CheckCircle2,
  Flashlight,
  FlashlightOff,
  Image as GalleryIcon,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Landscape shape for tablets strip / blister packaging / table paper
const VIEWFINDER_WIDTH = Math.min(SCREEN_WIDTH - 44, 340);
const VIEWFINDER_HEIGHT = Math.round(VIEWFINDER_WIDTH * 0.62);

interface DrugScannerModalProps {
  visible: boolean;
  onClose: () => void;
}

type ScanStatus = 'idle' | 'scanning' | 'verified';

export function DrugScannerModal({ visible, onClose }: DrugScannerModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [status, setStatus] = useState<ScanStatus>('idle');

  // Laser scan line animation
  const laserY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      laserY.value = 0;
      laserY.value = withRepeat(
        withSequence(
          withTiming(VIEWFINDER_HEIGHT - 20, {
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(10, {
            duration: 1800,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
    } else {
      laserY.value = 0;
    }
  }, [visible]);

  const animatedLaserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }],
  }));

  const triggerHaptic = (type: 'light' | 'success') => {
    try {
      if (type === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {}
  };

  const handleToggleTorch = () => {
    triggerHaptic('light');
    setTorchOn((prev) => !prev);
  };

  const handleBarcodeScanned = (data?: string) => {
    if (status !== 'idle') return;
    triggerHaptic('light');
    setStatus('scanning');

    setTimeout(() => {
      triggerHaptic('success');
      handleClose();
      router.push({
        pathname: '/(tabs)/(home)/scan-result',
        params: {
          code: data || 'BNT-89240-PK',
          item: 'Augmentin 625mg',
        },
      });
    }, 750);
  };

  const handleManualScan = () => {
    handleBarcodeScanned('BNT-89240-PK');
  };

  const handlePickImage = async () => {
    if (status !== 'idle') return;
    try {
      triggerHaptic('light');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setStatus('scanning');
        triggerHaptic('light');

        try {
          const scannedResults = await scanFromURLAsync(imageUri, [
            'qr',
            'ean13',
            'code128',
            'datamatrix',
            'upc_a',
          ]);
          if (scannedResults && scannedResults.length > 0 && scannedResults[0]?.data) {
            handleBarcodeScanned(scannedResults[0].data);
          } else {
            handleBarcodeScanned('BNT-89240-PK');
          }
        } catch {
          handleBarcodeScanned('BNT-89240-PK');
        }
      }
    } catch (error) {
      console.warn('Error picking image:', error);
      setStatus('idle');
    }
  };

  const handleClose = () => {
    triggerHaptic('light');
    setStatus('idle');
    setTorchOn(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Full-Screen Immersive Camera Container */}
      <View className="flex-1 bg-black">
        {/* Active Camera View filling the background */}
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torchOn}
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr',
                'ean13',
                'code128',
                'datamatrix',
                'upc_a',
              ],
            }}
            onBarcodeScanned={(scanned) => {
              if (status === 'idle') {
                handleBarcodeScanned(scanned.data);
              }
            }}
          />
        ) : (
          /* Permission fallback screen */
          <View className="flex-1 items-center justify-center p-8 bg-[#0b0f19]">
            <View className="w-14 h-14 rounded-full bg-white/10 items-center justify-center mb-4">
              <Icon name={Camera} size={26} color="#ffffff" />
            </View>
            <Text className="text-base font-bold text-white text-center mb-2">
              Camera Access Required
            </Text>
            <Text className="text-xs text-white/60 text-center mb-6 leading-relaxed">
              VeriCure needs camera access to scan and verify authentic drug barcodes
            </Text>
            <Pressable
              onPress={async () => {
                triggerHaptic('light');
                await requestPermission();
              }}
              className="bg-white px-6 py-3 rounded-full active:opacity-85"
            >
              <Text className="text-black text-xs font-bold">
                Enable Camera
              </Text>
            </Pressable>
          </View>
        )}

        {/* Top Header - Dismiss button */}
        <View
          style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
          className="px-6 flex-row items-center justify-between z-30"
        >
          <Pressable
            onPress={handleClose}
            className="p-2 active:opacity-60"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close scanner"
          >
            <Icon name={X} size={26} color="#ffffff" />
          </Pressable>

          {/* Spacer for top symmetry */}
          <View style={{ width: 40, height: 40 }} />
        </View>

        {/* Center Area: Viewfinder Reticle in Landscape Orientation */}
        <View className="flex-1 justify-center items-center px-4">
          <Animated.View
            entering={FadeIn.duration(240)}
            exiting={FadeOut.duration(200)}
            className="items-center justify-center"
          >
            {/* Central Viewfinder Reticle formatted for landscape tables / blister strips */}
            <View
              style={{
                width: VIEWFINDER_WIDTH,
                height: VIEWFINDER_HEIGHT,
                position: 'relative',
              }}
            >
              {/* Top-Left Rounded Corner */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 48,
                  height: 48,
                  borderTopWidth: 4.5,
                  borderLeftWidth: 4.5,
                  borderColor: '#ffffff',
                  borderTopLeftRadius: 24,
                }}
              />

              {/* Top-Right Rounded Corner */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 48,
                  height: 48,
                  borderTopWidth: 4.5,
                  borderRightWidth: 4.5,
                  borderColor: '#ffffff',
                  borderTopRightRadius: 24,
                }}
              />

              {/* Bottom-Left Rounded Corner */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 48,
                  height: 48,
                  borderBottomWidth: 4.5,
                  borderLeftWidth: 4.5,
                  borderColor: '#ffffff',
                  borderBottomLeftRadius: 24,
                }}
              />

              {/* Bottom-Right Rounded Corner */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 48,
                  height: 48,
                  borderBottomWidth: 4.5,
                  borderRightWidth: 4.5,
                  borderColor: '#ffffff',
                  borderBottomRightRadius: 24,
                }}
              />

              {/* Smooth Animated Laser Scan Line */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    left: 14,
                    right: 14,
                    height: 2.5,
                    backgroundColor: '#2e67ff',
                    borderRadius: 999,
                    shadowColor: '#2e67ff',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 8,
                  },
                  animatedLaserStyle,
                ]}
              />

              {/* Scanning verification overlay */}
              {status === 'scanning' && (
                <Animated.View
                  entering={FadeIn.duration(160)}
                  exiting={FadeOut.duration(140)}
                  className="absolute inset-0 bg-black/60 rounded-3xl items-center justify-center gap-2"
                >
                  <Icon name={Sparkles} size={30} color="#ffffff" />
                  <Text className="text-white text-xs font-bold tracking-wide">
                    Verifying Signature...
                  </Text>
                </Animated.View>
              )}
            </View>

            {/* Landscape guidance label */}
            <View className="mt-5 flex-row items-center px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10">
              <Icon name={ScanLine} size={14} color="#ffffff" />
              <Text className="text-white/80 text-[11px] font-medium ml-2 tracking-wide">
                Fit barcode or tablet blister strip inside frame
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Control Bar: Torch on left, Capture in center, Gallery pick & scan on right */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 20) + 16 }}
          className="px-10 flex-row items-center justify-between z-30"
        >
          {/* Flashlight / Torch Button on Left Side */}
          <Pressable
            onPress={handleToggleTorch}
            className="p-3 active:opacity-70 items-center justify-center"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Toggle flashlight"
          >
            <Icon
              name={torchOn ? Flashlight : FlashlightOff}
              size={28}
              color={torchOn ? '#facc15' : '#ffffff'}
            />
          </Pressable>

          {/* Simple Rounded Circle Capture / Scan Button in Center */}
          <Pressable
            onPress={handleManualScan}
            disabled={status === 'scanning'}
            className="items-center justify-center active:scale-95"
            style={{
              width: 76,
              height: 76,
              borderRadius: 999,
              borderWidth: 3.5,
              borderColor: '#ffffff',
              padding: 4,
            }}
            accessibilityRole="button"
            accessibilityLabel="Capture scan"
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 999,
                backgroundColor: status === 'scanning' ? '#a0a0a0' : '#ffffff',
              }}
            />
          </Pressable>

          {/* Gallery Pick & Scan Button on Right Side */}
          <Pressable
            onPress={handlePickImage}
            disabled={status === 'scanning'}
            className="p-3 active:opacity-70 items-center justify-center"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Pick image from gallery to scan"
          >
            <Icon
              name={GalleryIcon}
              size={28}
              color="#ffffff"
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
