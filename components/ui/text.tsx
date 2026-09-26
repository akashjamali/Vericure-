import { cssInterop } from 'nativewind';
import { useColor } from '@/hooks/useColor';
import { FONT_SIZE } from '@/theme/globals';
import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'sectionHeading'
  | 'subheading'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'caption'
  | 'button'
  | 'title'
  | 'subtitle'
  | 'link';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

const headingVariants: TextVariant[] = ['display', 'heading', 'sectionHeading', 'subheading', 'title', 'subtitle'];

export const Text = React.memo(
  forwardRef<RNText, TextProps>(
    (
      { variant = 'body', lightColor, darkColor, style, children, ...props },
      ref
    ) => {
      const textColor = useColor('text', {
        light: lightColor,
        dark: darkColor,
      });
      const mutedColor = useColor('textMuted');
      const defaultAccessibilityRole = headingVariants.includes(variant)
        ? 'header'
        : undefined;

      const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
          color: textColor,
        };

        switch (variant) {
          case 'display':
            return {
              ...baseStyle,
              fontSize: 32,
              fontWeight: '600',
              lineHeight: 38,
              letterSpacing: -0.5,
            };
          case 'heading':
          case 'title':
            return {
              ...baseStyle,
              fontSize: 24,
              fontWeight: '600',
              lineHeight: 30,
              letterSpacing: -0.3,
            };
          case 'sectionHeading':
          case 'subtitle':
            return {
              ...baseStyle,
              fontSize: 18,
              fontWeight: '600',
              lineHeight: 24,
              letterSpacing: -0.2,
            };
          case 'subheading':
            return {
              ...baseStyle,
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 22,
            };
          case 'bodySmall':
            return {
              ...baseStyle,
              fontSize: 13.5,
              fontWeight: '400',
              lineHeight: 20,
            };
          case 'label':
            return {
              ...baseStyle,
              fontSize: 12.5,
              fontWeight: '500',
              lineHeight: 18,
            };
          case 'caption':
            return {
              ...baseStyle,
              fontSize: 12,
              fontWeight: '400',
              lineHeight: 16,
              color: mutedColor,
            };
          case 'button':
            return {
              ...baseStyle,
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 20,
            };
          case 'link':
            return {
              ...baseStyle,
              fontSize: 15,
              fontWeight: '500',
              lineHeight: 22,
              textDecorationLine: 'underline',
            };
          default: // 'body'
            return {
              ...baseStyle,
              fontSize: 15,
              fontWeight: '400',
              lineHeight: 22,
            };
        }
      };

      return (
        <RNText
          ref={ref}
          style={[getTextStyle(), style]}
          accessibilityRole={defaultAccessibilityRole}
          {...props}
        >
          {children}
        </RNText>
      );
    }
  )
);

Text.displayName = 'Text';

cssInterop(Text, { className: 'style' });
