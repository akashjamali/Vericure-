const lightColors = {
  // Base colors
  background: '#f4f6fa',
  foreground: '#0e142b',

  // Card colors
  card: '#ffffff',
  cardForeground: '#0e142b',

  // Popover colors
  popover: '#ffffff',
  popoverForeground: '#0e142b',

  // Primary colors
  primary: '#2b65ff',
  primaryForeground: '#ffffff',

  // Secondary colors
  secondary: '#0e142b',
  secondaryForeground: '#ffffff',

  // Muted colors
  muted: '#ffffff',
  mutedForeground: '#0e142b',

  // Accent colors
  accent: '#ffffff',
  accentForeground: '#2e67ff',

  // Destructive colors
  destructive: '#ff6c35',
  destructiveForeground: '#ffffff',

  // Border and input
  border: 'transparent',
  input: '#cccccc',
  ring: '#2e6aff',

  // Charts
  chart1: '#2e67ff',
  chart2: '#00cdcc',
  chart3: '#f9ff40',
  chart4: '#00eeba',
  chart5: '#ff2822',

  // Sidebar
  sidebar: '#fafafa',
  sidebarForeground: '#0e142b',
  sidebarPrimary: '#2e67ff',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#ffffff',
  sidebarAccentForeground: '#2e67ff',
  sidebarBorder: '#ffffff',
  sidebarRing: '#2e6aff',

  // Text colors
  text: '#0e142b',
  textMuted: '#64748b',

  // Legacy support for existing components
  tint: '#2e67ff',
  icon: '#0e142b',
  tabIconDefault: '#64748b',
  tabIconSelected: '#2e67ff',

  // Default buttons, links, Send button, selected tabs
  blue: '#2e67ff',
  green: '#00eeba',
  red: '#ff6c35',
  orange: '#ff6c35',
  yellow: '#f9ff40',
  pink: '#ff2822',
  purple: '#2e6aff',
  teal: '#00cdcc',
  indigo: '#2e67ff',

  // Semantic states
  success: '#00eeba',
  successForeground: '#ffffff',
  warning: '#f9ff40',
  warningForeground: '#0e142b',
  info: '#2e67ff',
  infoForeground: '#ffffff',
  error: '#ff6c35',
  errorForeground: '#ffffff',
};

const darkColors = {
  // Base colors
  background: '#000000',
  foreground: '#ffffff',

  // Card colors
  card: '#0f0f0f',
  cardForeground: '#d9d9d9',

  // Popover colors
  popover: '#000000',
  popoverForeground: '#ffffff',

  // Primary colors
  primary: '#2b65ff',
  primaryForeground: '#ffffff',

  // Secondary colors
  secondary: '#ffffff',
  secondaryForeground: '#0e142b',

  // Muted colors
  muted: '#181818',
  mutedForeground: '#7b7e8c',

  // Accent colors
  accent: '#000e39',
  accentForeground: '#2b65ff',

  // Destructive colors
  destructive: '#ff6c35',
  destructiveForeground: '#ffffff',

  // Border and input
  border: '#26272e',
  input: '#162151',
  ring: '#2e6aff',

  // Charts
  chart1: '#2e67ff',
  chart2: '#00cdcc',
  chart3: '#f9ff40',
  chart4: '#00eeba',
  chart5: '#ff2822',

  // Sidebar
  sidebar: '#0f0f0f',
  sidebarForeground: '#d9d9d9',
  sidebarPrimary: '#2e6aff',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#000e39',
  sidebarAccentForeground: '#2b65ff',
  sidebarBorder: '#323e62',
  sidebarRing: '#2e6aff',

  // Text colors
  text: '#ffffff',
  textMuted: '#7b7e8c',

  // Legacy support for existing components
  tint: '#2b65ff',
  icon: '#7b7e8c',
  tabIconDefault: '#7b7e8c',
  tabIconSelected: '#2b65ff',

  // Palette
  blue: '#2b65ff',
  green: '#00eeba',
  red: '#ff6c35',
  orange: '#ff6c35',
  yellow: '#f9ff40',
  pink: '#ff2822',
  purple: '#2e6aff',
  teal: '#00cdcc',
  indigo: '#2b65ff',

  // Semantic states
  success: '#00eeba',
  successForeground: '#ffffff',
  warning: '#f9ff40',
  warningForeground: '#0e142b',
  info: '#2b65ff',
  infoForeground: '#ffffff',
  error: '#ff6c35',
  errorForeground: '#ffffff',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Export individual color schemes for easier access
export { darkColors, lightColors };

// Utility type for color keys
export type ColorKeys = keyof typeof lightColors;

// Helper function to get color with opacity (useful for React Native)
export const withOpacity = (color: string, opacity: number) => {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color;
  }

  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};
