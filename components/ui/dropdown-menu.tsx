import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeMenu: () => void;
  triggerRect: { x: number; y: number; width: number; height: number } | null;
  setTriggerRect: (rect: { x: number; y: number; width: number; height: number } | null) => void;
  triggerRef: React.RefObject<View | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

export function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('useDropdownMenu must be used within a DropdownMenu');
  }
  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const triggerRef = useRef<View | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, closeMenu, triggerRect, setTriggerRect, triggerRef }}
    >
      <View style={{ position: 'relative' }}>{children}</View>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children?: React.ReactNode;
  render?: React.ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children, render }: DropdownMenuTriggerProps) {
  const { open, setOpen, setTriggerRect, triggerRef } = useDropdownMenu();

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    if (triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setTriggerRect({ x, y, width, height });
        setOpen(!open);
      });
    } else {
      setOpen(!open);
    }
  };

  if (render) {
    return (
      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
          {render}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View ref={triggerRef} collapsable={false}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        {children}
      </TouchableOpacity>
    </View>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  width?: number;
}

export function DropdownMenuContent({
  children,
  style,
  align = 'end',
  sideOffset = 6,
  width = 230,
}: DropdownMenuContentProps) {
  const { open, setOpen, triggerRect } = useDropdownMenu();
  const screen = Dimensions.get('window');

  const [isMounted, setIsMounted] = useState(false);
  const progress = useSharedValue(0);

  const finishClose = useCallback(() => {
    setIsMounted(false);
    setOpen(false);
  }, [setOpen]);

  const handleDismiss = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    progress.value = withTiming(
      0,
      { duration: 150, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      }
    );
  }, [finishClose, progress]);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      progress.value = withSpring(1, {
        damping: 18,
        stiffness: 240,
        mass: 0.8,
      });
    } else if (isMounted) {
      progress.value = withTiming(
        0,
        { duration: 150, easing: Easing.out(Easing.quad) },
        (finished) => {
          if (finished) {
            runOnJS(finishClose)();
          }
        }
      );
    }
  }, [open, isMounted, progress, finishClose]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.93, 1]);
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    const translateY = interpolate(progress.value, [0, 1], [-8, 0]);

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  if (!isMounted) return null;

  const top = triggerRect ? triggerRect.y + triggerRect.height + sideOffset : 100;

  let left = triggerRect ? triggerRect.x : 20;
  if (align === 'end' && triggerRect) {
    left = triggerRect.x + triggerRect.width - width;
  } else if (align === 'center' && triggerRect) {
    left = triggerRect.x + (triggerRect.width - width) / 2;
  }

  // Keep within screen bounds
  left = Math.max(12, Math.min(left, screen.width - width - 12));

  return (
    <Modal
      transparent
      visible={isMounted}
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
            backdropStyle,
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top,
                  left,
                  width,
                  backgroundColor: '#ffffff',
                  borderRadius: 18,
                  padding: 7,
                  borderWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 8,
                  zIndex: 9999,
                },
                style,
                animatedStyle,
              ]}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <View style={{ paddingVertical: 2 }}>{children}</View>;
}

export function DropdownMenuLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ paddingHorizontal: 10, paddingVertical: 5 }, style]}>
      <Text
        style={{
          fontSize: 11.5,
          fontWeight: '600',
          color: '#94a3b8',
          includeFontPadding: false,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  checked?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function DropdownMenuItem({
  children,
  onSelect,
  disabled = false,
  checked,
  icon,
  style,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

  const handlePress = () => {
    if (disabled) return;
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelect?.();
    setOpen(false);
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.6}
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8.5,
          paddingHorizontal: 10,
          borderRadius: 11,
          backgroundColor: checked ? 'rgba(46, 103, 255, 0.08)' : 'transparent',
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 }}>
        {icon && <View style={{ flexShrink: 0 }}>{icon}</View>}
        <Text
          style={{
            fontSize: 13,
            fontWeight: checked ? '700' : '500',
            color: checked ? '#2e67ff' : '#1e293b',
            includeFontPadding: false,
          }}
          numberOfLines={1}
        >
          {children}
        </Text>
      </View>
      {checked && (
        <Icon name={Check} size={14} color="#2e67ff" />
      )}
    </TouchableOpacity>
  );
}

export function DropdownMenuSeparator() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        marginVertical: 4,
        marginHorizontal: 4,
      }}
    />
  );
}
