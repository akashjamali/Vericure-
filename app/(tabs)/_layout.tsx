import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import { Activity, Home, Pill, User, Users } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedTabIcon = ({ focused, iconName }: { focused: boolean; iconName: any }) => {
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(focused ? '#ffffff' : 'transparent', { duration: 200 }),
      transform: [{ scale: withSpring(focused ? 1.1 : 1, { damping: 15, stiffness: 200 }) }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: focused ? '#eef6ff' : 'transparent',
        },
        animatedViewStyle,
      ]}
    >
      <Icon name={iconName} size={22} color={focused ? '#2b65ff' : '#94a3b8'} />
    </Animated.View>
  );
};

import { useScrollContext } from '@/providers/scroll-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 0);
  const { tabBarTranslateY } = useScrollContext();

  const animatedTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarTranslateY.value }],
    };
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: '#f4f6fa',
        },
        tabBarActiveTintColor: '#2b65ff',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#f4f6fa',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 10)),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 10),
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
          fontWeight: '600',
          marginTop: 3,
        },
      }}
    >
      {/* ── 1. Home Dashboard ── */}
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} iconName={Home} />,
        }}
      />

      {/* ── 2. Vault Inventory ── */}
      <Tabs.Screen
        name="cabinet"
        options={{
          title: 'Vault',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} iconName={Pill} />,
        }}
      />

      {/* ── 3. Family Patient Profiles ── */}
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} iconName={Users} />,
        }}
      />

      {/* ── 4. DrugRadar Cross-Interaction ── */}
      <Tabs.Screen
        name="drugradar"
        options={{
          title: 'DrugRadar',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} iconName={Activity} />,
        }}
      />

      {/* ── 5. Profile ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <AnimatedTabIcon focused={focused} iconName={User} />,
        }}
      />

      {/* Hidden Secondary Screens */}
      <Tabs.Screen name="pricefair" options={{ href: null }} />
      <Tabs.Screen name="insights" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
  );
}
