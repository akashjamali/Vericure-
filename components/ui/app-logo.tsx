import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface AppLogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export function AppLogo({ width = 140, height = 36, style }: AppLogoProps) {
  const fontSize = Math.round(height * 0.42);
  const borderRadius = 999;
  const borderColor = '#d1d5db';
  const leftTextColor = '#111827';

  return (
    <View
      style={[
        styles.capsule,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      {/* Left Half: "Veri" */}
      <View
        style={[
          styles.half,
          styles.leftHalf,
          {
            borderColor,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
          },
        ]}
      >
        <Text
          style={[
            styles.logoText,
            {
              fontSize,
              color: leftTextColor,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Veri
        </Text>
      </View>

      {/* Right Half: "Cure" */}
      <View
        style={[
          styles.half,
          styles.rightHalf,
          {
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          },
        ]}
      >
        <Text
          style={[
            styles.logoText,
            {
              fontSize,
              color: '#ffffff',
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Cure
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  half: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHalf: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderRightWidth: 0,
    paddingLeft: 8, // Text ko darmian ki taraf rakhne ke liye
  },
  rightHalf: {
    backgroundColor: '#2b65ff',
    borderWidth: 1.5,
    borderColor: '#2b65ff',
    paddingRight: 8, // Text ko darmian ki taraf rakhne ke liye
  },
  logoText: {
    fontFamily: 'Poppins-Medium', // Smooth, non-bold custom font
    fontWeight: '700', // Regular (400) se thora better visiblity ke liye 500 use kiya hai
    textAlign: 'center',
    includeFontPadding: false,
    letterSpacing: 0, // Extra spacing hata di hai smooth look ke liye
  },
});