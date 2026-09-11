import { AppLogo } from "@/components/ui/app-logo";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useFocusEffect } from "expo-router";
import {
  BarChart2,
  CheckCircle2,
  Clock,
  Fingerprint,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { DimensionValue } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// Semi-circle meter constants
// 180-degree arch spanning from left (28, 140) up over to right (252, 140)
// Center = (140, 140), Radius = 112
const CENTER_X = 140;
const CENTER_Y = 136;
const RADIUS = 104;
const ARC_LENGTH = Math.PI * RADIUS; // ~326.72
const TOTAL_TICKS = 25; // High-density precision ticks

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();

  // Telemetry data
  const totalScans = 14;
  const verifiedCount = 13;
  const counterfeitCount = 1;
  const targetSafety = totalScans > 0 ? Math.round((verifiedCount / totalScans) * 100) : 0;
  const targetCounterfeit = totalScans > 0 ? Math.round((counterfeitCount / totalScans) * 100) : 0;

  // 120 FPS / 60 FPS buttery UI-thread shared values
  const meterProgress = useSharedValue(0);
  const [displayNumber, setDisplayNumber] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Reset immediately to 0 on entry
      meterProgress.value = 0;
      setDisplayNumber(0);

      // Silky smooth integer ticker: only re-renders when the integer actually changes
      let timer: any = null;
      const duration = 1200;
      const startTime = Date.now() + 80;
      let lastRendered = 0;

      const tick = () => {
        const now = Date.now();
        if (now < startTime) {
          timer = requestAnimationFrame(tick);
          return;
        }

        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        // Smooth quadratic ease out: steady, continuous, no abrupt deceleration
        const eased = p * (2 - p);
        const currentInt = Math.round(eased * targetSafety);

        if (currentInt !== lastRendered) {
          lastRendered = currentInt;
          setDisplayNumber(currentInt);
        }

        if (p < 1) {
          timer = requestAnimationFrame(tick);
        }
      };

      timer = requestAnimationFrame(tick);

      // Reanimated synchronized smooth sweep
      meterProgress.value = withDelay(
        80,
        withTiming(1, {
          duration: 1200,
          easing: Easing.out(Easing.quad), // Smooth natural deceleration matching the number
        })
      );

      return () => {
        if (timer) cancelAnimationFrame(timer);
        meterProgress.value = 0;
      };
    }, [targetSafety])
  );

  // Animated SVG arc props
  const animatedArcProps = useAnimatedProps(() => {
    "worklet";
    const progress = meterProgress.value * (targetSafety / 100);
    const strokeDashoffset = ARC_LENGTH * (1 - progress);
    return {
      strokeDashoffset,
    };
  });

  // Animated needle / glow tip coordinate
  const animatedPointerProps = useAnimatedProps(() => {
    "worklet";
    const progress = meterProgress.value * (targetSafety / 100);
    const angle = Math.PI - progress * Math.PI;
    const cx = CENTER_X + RADIUS * Math.cos(angle);
    const cy = CENTER_Y - RADIUS * Math.sin(angle);
    return {
      cx,
      cy,
    };
  });

  // Pure GPU transform scaleX (Zero layout passes, rock-solid 120 FPS)
  const genuineBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: meterProgress.value,
        },
      ],
    };
  });

  const counterfeitBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: meterProgress.value,
        },
      ],
    };
  });

  // Modern telemetry radial tick marks (like high-end aerospace / medical instruments)
  const ticks = Array.from({ length: TOTAL_TICKS }).map((_, i) => {
    const fraction = i / (TOTAL_TICKS - 1);
    const angle = Math.PI - fraction * Math.PI;
    const innerR = i % 4 === 0 ? RADIUS - 18 : RADIUS - 12;
    const outerR = RADIUS - 6;

    const x1 = CENTER_X + innerR * Math.cos(angle);
    const y1 = CENTER_Y - innerR * Math.sin(angle);
    const x2 = CENTER_X + outerR * Math.cos(angle);
    const y2 = CENTER_Y - outerR * Math.sin(angle);

    const isMajor = i % 4 === 0;
    const isLit = fraction <= targetSafety / 100;

    return { id: i, x1, y1, x2, y2, isMajor, isLit, fraction };
  });

  return (
    <View className="flex-1 bg-background">
      {/* ── Top Header — identical to Home & Medicine Cabinet ── */}
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

      {/* ── Main Content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2 pb-14 gap-2.5"
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Title */}
        <Animated.View entering={FadeInDown.duration(280)} className="py-1">
          <Text
            className="text-lg font-bold text-foreground"
            style={{ includeFontPadding: false }}
          >
            Market Safety Index
          </Text>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
            style={{ includeFontPadding: false }}
          >
            Real-time medicine verification telemetry
          </Text>
        </Animated.View>

        {/* ── Modern World Unique Meter Card ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(80)}>
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none items-center overflow-hidden">
            {/* Meter header */}
            <View className="w-full mb-2">
              <Text
                className="text-sm font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                Market Safety Meter
              </Text>
              <Text
                className="text-xs text-muted-foreground mt-0.5"
                style={{ includeFontPadding: false }}
              >
                Current verification safety index
              </Text>
            </View>

            {/* Unique Gauge Architecture: Track + High-Precision Radial Calibrations + Dynamic Neon Arc + Leading Pulse Orb */}
            <View className="items-center justify-center relative mt-1" style={{ height: 162, width: 280 }}>
              <Svg width={280} height={160} viewBox="0 0 280 160">
                {/* Radial Telemetry Ticks */}
                {ticks.map((t) => (
                  <Line
                    key={t.id}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={t.isMajor ? "#cccccc" : "#e7e4e4"}
                    strokeWidth={t.isMajor ? 2 : 1}
                    strokeLinecap="round"
                  />
                ))}

                {/* Subtle base track */}
                <Path
                  d={`M ${CENTER_X - RADIUS} ${CENTER_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${CENTER_Y}`}
                  fill="none"
                  stroke="#e7e4e4"
                  strokeWidth={14}
                  strokeLinecap="round"
                />

                {/* Modern buttery 120fps animated primary neon arc */}
                <AnimatedPath
                  d={`M ${CENTER_X - RADIUS} ${CENTER_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${CENTER_Y}`}
                  fill="none"
                  stroke="#2e67ff"
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeDasharray={`${ARC_LENGTH}`}
                  animatedProps={animatedArcProps}
                />

                {/* Leading Pointer Orb (Unique Modern Instrument Indicator) */}
                <AnimatedCircle
                  r={9}
                  fill="#ffffff"
                  stroke="#2e67ff"
                  strokeWidth={3.5}
                  animatedProps={animatedPointerProps}
                />
              </Svg>

              {/* Center Modern Monolithic D-Display */}
              <View
                className="absolute bottom-0 bg-background border border-border px-5 py-2.5 rounded-xl items-center justify-center"
                style={{ minWidth: 112 }}
              >
                <View className="flex-row items-baseline justify-center">
                  <Text
                    className="text-3xl font-black text-foreground"
                    style={{ includeFontPadding: false }}
                  >
                    {displayNumber}
                  </Text>
                  <Text
                    className="text-sm font-extrabold text-primary ml-0.5"
                    style={{ includeFontPadding: false }}
                  >
                    %
                  </Text>
                </View>
                <Text
                  className="text-[10px] font-bold text-muted-foreground mt-0.5"
                  style={{ includeFontPadding: false }}
                >
                  Safety
                </Text>
              </View>
            </View>

            {/* Bottom Status pill with micro pulse dot */}
            <View className="flex-row items-center gap-2 mt-4 bg-background border border-border px-3.5 py-1.5 rounded-full">
              <View className="w-2 h-2 rounded-full bg-primary" />
              <Text
                className="text-xs font-bold text-foreground"
                style={{ includeFontPadding: false }}
              >
                {targetSafety >= 90
                  ? "High Trust Environment"
                  : targetSafety > 0
                  ? "Standard Market Activity"
                  : "No Verification Data"}
              </Text>
            </View>

            <Text
              className="text-xs text-muted-foreground text-center mt-2 px-4 leading-relaxed"
              style={{ includeFontPadding: false }}
            >
              Verify medicines to generate your cryptographic verification insights.
            </Text>
          </Card>
        </Animated.View>

        {/* ── Second Box: Authentication Summary ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(140)}>
          <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text
                  className="text-sm font-bold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Authentication Summary
                </Text>
                <Text
                  className="text-xs text-muted-foreground mt-0.5"
                  style={{ includeFontPadding: false }}
                >
                  {totalScans} total medicine scans
                </Text>
              </View>
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                <Icon name={BarChart2} size={15} color="#2b65ff" />
              </View>
            </View>

            {/* Buttery smooth 120fps progress track */}
            <View
              className="h-3 w-full rounded-full overflow-hidden flex-row my-2"
              style={{ backgroundColor: '#fee2e2' }}
            >
              <Animated.View
                style={[
                  { width: `${targetSafety}%`, transformOrigin: "left" },
                  genuineBarStyle,
                ]}
                className="h-full bg-primary rounded-l-full"
              />
              <Animated.View
                style={[
                  { width: `${targetCounterfeit}%`, transformOrigin: "left" },
                  counterfeitBarStyle,
                  { backgroundColor: '#f87171' },
                ]}
                className="h-full rounded-r-full"
              />
            </View>

            {/* Legend */}
            <View className="flex-row items-center justify-between pt-2">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Genuine {targetSafety}%
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: '#f87171' }}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ includeFontPadding: false }}
                >
                  Counterfeit {targetCounterfeit}%
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* ── Third Row: Verified Genuine & Detected Counterfeit ── */}
        <View className="flex-row gap-3">
          {/* Verified Genuine */}
          <Animated.View
            entering={FadeInDown.duration(300).delay(200)}
            className="flex-1"
          >
            <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
              <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center mb-3">
                <Icon name={ShieldCheck} size={16} color="#2b65ff" />
              </View>
              <Text
                className="text-2xl font-black text-foreground"
                style={{ includeFontPadding: false }}
              >
                {verifiedCount}
              </Text>
              <Text
                className="text-xs font-medium text-muted-foreground mt-1"
                style={{ includeFontPadding: false }}
              >
                Verified Genuine
              </Text>
            </Card>
          </Animated.View>

          {/* Detected Counterfeit */}
          <Animated.View
            entering={FadeInDown.duration(300).delay(240)}
            className="flex-1"
          >
            <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
              <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center mb-3">
                <Icon name={ShieldAlert} size={16} color="#0e142b" />
              </View>
              <Text
                className="text-2xl font-black text-foreground"
                style={{ includeFontPadding: false }}
              >
                {counterfeitCount}
              </Text>
              <Text
                className="text-xs font-medium text-muted-foreground mt-1"
                style={{ includeFontPadding: false }}
              >
                Detected Counterfeit
              </Text>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
