import { AppLogo } from "@/components/ui/app-logo";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();

  // Animation shared values for X/Twitter style opening
  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const navigateToLogin = () => {
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    // 1. Initial smooth entrance (fade in + scale to 1.0)
    logoOpacity.value = withTiming(1, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });

    logoScale.value = withSequence(
      // Step A: Settle into 1.0 at center
      withTiming(1, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      }),
      // Step B: Graceful brand presence delay
      withDelay(
        600,
        withTiming(0.92, {
          duration: 130,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      // Step C: Fast, buttery explosive zoom-out like X (Twitter)
      withTiming(
        32,
        {
          duration: 380,
          easing: Easing.bezier(0.6, 0.04, 0.2, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(navigateToLogin)();
          }
        }
      )
    );

    // Fade logo opacity toward end of zoom out
    logoOpacity.value = withDelay(
      1280,
      withTiming(0, {
        duration: 160,
        easing: Easing.in(Easing.quad),
      })
    );

    // Fade screen container to reveal login page cleanly
    screenOpacity.value = withDelay(
      1300,
      withTiming(0, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const animatedScreenStyle = useAnimatedStyle(() => {
    return {
      opacity: screenOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedScreenStyle]}>
      <Animated.View style={[styles.logoWrapper, animatedLogoStyle]}>
        <AppLogo width={140} height={46} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc", // Same pure white background as login page
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
