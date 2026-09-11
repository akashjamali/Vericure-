import React from 'react';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface AppLogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export function AppLogo({ width = 96, height = 32, style }: AppLogoProps) {
  const fontSize = Math.round(height * 0.60);
  const borderRadius = 999;
  const borderColor = '#e7e4e4';
  const veriTextColor = '#000000';

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
              color: veriTextColor,
            },
          ]}
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
    // Ab choti width ki wajah se text naturally side gaps ke bina fill ho jayega
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHalf: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderRightWidth: 0, // Darmiyan ki line hatane ke liye
    paddingLeft: 4,      // Sirf curve area ko bachane ke liye minimal padding
  },
  rightHalf: {
    backgroundColor: '#2b65ff',
    borderWidth: 1.5,
    borderColor: '#2b65ff',
    paddingRight: 4,     // Sirf curve area ko bachane ke liye minimal padding
  },
  logoText: {
    fontWeight: '500',
    letterSpacing: 0,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif-medium' },
    }),
  },
});