import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function HealthBackground() {
  const w = SCREEN_WIDTH || 390;
  const h = SCREEN_HEIGHT || 844;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <Svg height="100%" width="100%" viewBox={`0 0 ${w} ${h}`}>
        <Defs>
          {/* Smooth full-screen calm health wash */}
          <LinearGradient id="healthBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#eef3f8" stopOpacity="1" />
            <Stop offset="50%" stopColor="#f4f6fa" stopOpacity="1" />
            <Stop offset="100%" stopColor="#f4f6fa" stopOpacity="1" />
          </LinearGradient>

          {/* Soft top diffused aura */}
          <RadialGradient
            id="clinicalMist"
            cx="50%"
            cy="10%"
            rx="65%"
            ry="45%"
            fx="50%"
            fy="10%"
          >
            <Stop offset="0%" stopColor="#2e67ff" stopOpacity="0.04" />
            <Stop offset="70%" stopColor="#eef3f8" stopOpacity="0" />
          </RadialGradient>

          {/* Calming bottom ambient glow */}
          <RadialGradient
            id="calmMist"
            cx="75%"
            cy="90%"
            rx="60%"
            ry="50%"
            fx="75%"
            fy="90%"
          >
            <Stop offset="0%" stopColor="#2e67ff" stopOpacity="0.02" />
            <Stop offset="70%" stopColor="#f4f6fa" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base dull healthcare gradient layer */}
        <Rect x="0" y="0" width={w} height={h} fill="url(#healthBgGrad)" />

        {/* Diffused clinical ambient light layers */}
        <Rect x="0" y="0" width={w} height={h} fill="url(#clinicalMist)" />
        <Rect x="0" y="0" width={w} height={h} fill="url(#calmMist)" />
      </Svg>
    </View>
  );
}
