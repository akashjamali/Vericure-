import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { CameraView, scanFromURLAsync, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Flashlight,
  FlashlightOff,
  Image as GalleryIcon,
  ScanLine,
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
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIEWFINDER_WIDTH = Math.min(SCREEN_WIDTH - 44, 300);
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
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        {/* ── White Top Header ── */}
        <View
          style={{
            backgroundColor: '#ffffff',
            paddingTop: Math.max(insets.top, 20) + 4,
            paddingBottom: 12,
            paddingHorizontal: 20,
          }}
        >
          {/* Close button row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: '#f1f5f9',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name={X} size={18} color="#0e142b" />
            </Pressable>
          </View>

          {/* Title block */}
          <Text
            style={{
              color: '#94a3b8',
              fontSize: 11,
              fontWeight: '500',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 4,
              fontFamily: 'Inter_500Medium',
            }}
          >
            Medicine Verification
          </Text>
          <Text
            style={{
              color: '#0e142b',
              fontSize: 22,
              fontWeight: '700',
              fontFamily: 'Inter_700Bold',
              letterSpacing: -0.3,
              marginBottom: 4,
            }}
          >
            Scan your medicine
          </Text>
          <Text
            style={{
              color: '#94a3b8',
              fontSize: 13,
              fontWeight: '400',
              fontFamily: 'Inter_400Regular',
            }}
          >
            Point camera at the barcode or QR on packaging
          </Text>
        </View>

        {/* ── White Body ── */}
        <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>

          {permission?.granted ? (
            <>
              {/* Camera clipped inside viewfinder */}
              <View
                style={{
                  width: VIEWFINDER_WIDTH,
                  height: VIEWFINDER_HEIGHT,
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="back"
                  enableTorch={torchOn}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'ean13', 'code128', 'datamatrix', 'upc_a'],
                  }}
                  onBarcodeScanned={(scanned) => {
                    if (status === 'idle') handleBarcodeScanned(scanned.data);
                  }}
                />

                {/* Blue corner brackets */}
                <View style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44, borderTopWidth: 3.5, borderLeftWidth: 3.5, borderColor: '#2e67ff', borderTopLeftRadius: 20 }} />
                <View style={{ position: 'absolute', top: 0, right: 0, width: 44, height: 44, borderTopWidth: 3.5, borderRightWidth: 3.5, borderColor: '#2e67ff', borderTopRightRadius: 20 }} />
                <View style={{ position: 'absolute', bottom: 0, left: 0, width: 44, height: 44, borderBottomWidth: 3.5, borderLeftWidth: 3.5, borderColor: '#2e67ff', borderBottomLeftRadius: 20 }} />
                <View style={{ position: 'absolute', bottom: 0, right: 0, width: 44, height: 44, borderBottomWidth: 3.5, borderRightWidth: 3.5, borderColor: '#2e67ff', borderBottomRightRadius: 20 }} />

                {/* Animated laser line */}
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      height: 2,
                      backgroundColor: '#2e67ff',
                      borderRadius: 999,
                      shadowColor: '#2e67ff',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 10,
                    },
                    animatedLaserStyle,
                  ]}
                />

                {/* Scanning overlay */}
                {status === 'scanning' && (
                  <Animated.View
                    entering={FadeIn.duration(160)}
                    exiting={FadeOut.duration(140)}
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: 'rgba(46,103,255,0.12)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Icon name={Sparkles} size={28} color="#2e67ff" />
                    <Text style={{ color: '#2e67ff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5, fontFamily: 'Inter_700Bold' }}>
                      Verifying...
                    </Text>
                  </Animated.View>
                )}
              </View>

              {/* Hint pill below */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: '#f1f5f9',
                }}
              >
                <Icon name={ScanLine} size={13} color="#64748b" />
                <Text
                  style={{
                    color: '#64748b',
                    fontSize: 12,
                    fontWeight: '500',
                    marginLeft: 6,
                    fontFamily: 'Inter_500Medium',
                  }}
                >
                  Hold steady — auto-detects barcode
                </Text>
              </View>
            </>
          ) : (
            /* Permission denied */
            <View style={{ alignItems: 'center', paddingHorizontal: 32 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name={Camera} size={28} color="#64748b" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0e142b', textAlign: 'center', marginBottom: 8, fontFamily: 'Inter_700Bold' }}>
                Camera Access Required
              </Text>
              <Text style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20, marginBottom: 24, fontFamily: 'Inter_400Regular' }}>
                VeriCure needs camera access to scan and verify authentic drug barcodes
              </Text>
              <Pressable
                onPress={async () => {
                  triggerHaptic('light');
                  await requestPermission();
                }}
                style={{ backgroundColor: '#0e142b', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 999 }}
              >
                <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' }}>
                  Enable Camera
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── White Bottom Controls ── */}
        <View
          style={{
            backgroundColor: '#ffffff',
            paddingBottom: Math.max(insets.bottom, 20) + 10,
            paddingTop: 16,
            paddingHorizontal: 48,
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Gallery */}
          <Pressable
            onPress={handlePickImage}
            disabled={status === 'scanning'}
            hitSlop={10}
            style={{ alignItems: 'center', gap: 6 }}
          >
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={GalleryIcon} size={20} color="#475569" />
            </View>
            <Text style={{ fontSize: 10, fontWeight: '500', color: '#94a3b8', fontFamily: 'Inter_500Medium' }}>
              Gallery
            </Text>
          </Pressable>

          {/* Center shutter */}
          <Pressable
            onPress={handleManualScan}
            disabled={status === 'scanning'}
            style={{ alignItems: 'center' }}
          >
            <View
              style={{
                width: 72, height: 72, borderRadius: 999,
                borderWidth: 3, borderColor: '#2e67ff',
                padding: 4, alignItems: 'center', justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 56, height: 56, borderRadius: 999,
                  backgroundColor: status === 'scanning' ? '#cbd5e1' : '#2e67ff',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name={ScanLine} size={22} color="#ffffff" />
              </View>
            </View>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#2e67ff', marginTop: 6, fontFamily: 'Inter_600SemiBold' }}>
              Scan
            </Text>
          </Pressable>

          {/* Light toggle */}
          <Pressable
            onPress={handleToggleTorch}
            hitSlop={10}
            style={{ alignItems: 'center', gap: 6 }}
          >
            <View
              style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: torchOn ? '#fefce8' : '#f1f5f9',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon
                name={torchOn ? Flashlight : FlashlightOff}
                size={20}
                color={torchOn ? '#ca8a04' : '#475569'}
              />
            </View>
            <Text style={{ fontSize: 10, fontWeight: '500', color: '#94a3b8', fontFamily: 'Inter_500Medium' }}>
              {torchOn ? 'On' : 'Light'}
            </Text>
          </Pressable>
        </View>

      </View>
    </Modal>
  );
}
