# 💊 VeriCure — Smart Pharmaceutical Verification & Healthcare Suite

> A modern, AI-augmented mobile health application built with **React Native**, **Expo SDK 57**, and **TailwindCSS / NativeWind v4**. Designed to safeguard patients against counterfeit drugs, track medical cabinets, verify price fairness, monitor batch recall alerts, and manage family health records.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠 Tech Stack & Architecture](#-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start & How to Run](#-quick-start--how-to-run)
  - [Prerequisites](#prerequisites)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Start the Development Server](#2-start-the-development-server)
  - [3. Running on Expo Go (Physical Device)](#3-running-on-expo-go-physical-device)
  - [4. Running on Emulators / Simulators](#4-running-on-emulators--simulators)
  - [5. Running in Web Browser](#5-running-in-web-browser)
- [🔍 Drug Authenticity Scanner](#-drug-authenticity-scanner)
- [📦 All Screens & Capabilities](#-all-screens--capabilities)
- [🎨 Theming & Design System](#-theming--design-system)
- [🔧 Troubleshooting & Common Issues](#-troubleshooting--common-issues)

---

## ✨ Key Features

1. **Landscape Drug Authenticity Scanner**:
   - High-precision optical scanner specifically proportioned in a **landscape viewfinder aspect ratio** for tablet strips, blister packs, paper tables, and box packaging.
   - Live laser beam animation with haptic feedback.
   - Multi-format barcode support: QR, DataMatrix, EAN-13, Code 128, UPC-A.
   - **Gallery Image Import & Decode**: Pick photos directly from your device gallery to automatically scan barcodes from saved images.
   - Built-in torch/flashlight control for low-light scanning.

2. **Smart Medicine Cabinet**:
   - Digital tracking of household medications, expiry warnings, remaining dosages, and refill schedules.
   - Color-coded badges for active, low-stock, and expired medicines.

3. **Drug Radar & Recall Alerts**:
   - Real-time pharmaceutical batch recall alerts issued by drug regulatory authorities.
   - Instant search by brand name, active salt, or lot number.

4. **PriceFair — Fair Price Comparator**:
   - Compare retail medicine prices against official Maximum Retail Prices (MRP) and subsidized generic alternatives.
   - Savings calculator highlighting price discrepancies.

5. **Family Health & Chronic Care Profiles**:
   - Multi-member family profiles tracking allergies, chronic conditions, and emergency medical contacts.

6. **Recent Scans & Verification History**:
   - Comprehensive log of verified batches, manufacturer authenticity certificates, and safety dossiers.

---

## 🛠 Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework** | [React Native 0.86.3](https://reactnative.dev) + [React 19.2.3](https://react.dev) |
| **Tooling & Platform** | [Expo SDK 57.0.8](https://expo.dev) (New Architecture enabled) |
| **Routing & Navigation** | [Expo Router v57.0.8](https://docs.expo.dev/router/introduction/) (File-based routing, nested tabs, modals) |
| **Styling** | [TailwindCSS v3.4](https://tailwindcss.com) + [NativeWind v4.2](https://www.nativewind.dev) |
| **Camera & Computer Vision** | `expo-camera` (~57.0.4) with `CameraView` & `scanFromURLAsync` |
| **Image & Media Library** | `expo-image-picker` (~57.0.20) + `expo-image` (~57.0.1) |
| **Animations** | [react-native-reanimated 4.5.1](https://docs.swmansion.com/react-native-reanimated/) |
| **Haptics & Device Feedback** | `expo-haptics` (~57.0.1) |
| **Icons & Typography** | `lucide-react-native` (^1.27.0) + `@expo-google-fonts/inter` |
| **Safe Area & UI Primitives** | `react-native-safe-area-context` + `react-native-screens` |

---

## 📁 Project Structure

```
akash_bhutto/
├── app/                           # Expo Router navigation tree
│   ├── _layout.tsx                # Root layout, theme provider, global toast/alerts
│   ├── index.tsx                  # Splash / entry redirect
│   ├── help-support.tsx           # Help center, FAQ, and drug authentication guide
│   ├── medical-conditions.tsx     # Medical conditions & chronic illness manager
│   ├── saved-reports.tsx          # Saved batch verification and audit reports
│   ├── security-privacy.tsx       # Security protocols, privacy controls, compliance
│   ├── sheet.tsx                  # Bottom sheet modal route
│   └── (tabs)/                    # Main bottom navigation tab bar
│       ├── _layout.tsx            # Tab bar controller with custom floating tabs
│       ├── (home)/                # Home stack
│       │   ├── _layout.tsx        # Home stack navigator
│       │   ├── index.tsx          # Main dashboard (stats, scanner trigger, quick links)
│       │   ├── medicine-cabinet.tsx # Cabinet inventory & refill tracker
│       │   ├── recent-scans.tsx   # History of scanned drugs & results
│       │   └── scan-result.tsx    # Detailed batch verification dossier
│       ├── cabinet.tsx            # Full medicine inventory view
│       ├── drugradar.tsx          # Drug recall bulletins & safety warnings
│       ├── pricefair.tsx          # Drug price fairness & generic comparisons
│       ├── family.tsx             # Family health manager & profiles
│       ├── profile.tsx            # User profile, preferences, settings
│       ├── search/                # Drug database search
│       └── settings/              # System settings & configuration
├── components/                    # Reusable React Native components
│   ├── drug-scanner-modal.tsx     # Landscape camera reticle, laser animation, gallery picker
│   ├── sheet.tsx                  # Interactive bottom sheet modal
│   └── ui/                        # Curated UI component library
│       ├── app-logo.tsx           # VeriCure SVG animated branding
│       ├── button.tsx             # Accessible button variants with haptics
│       ├── card.tsx               # Glassmorphic and bordered cards
│       ├── dropdown-menu.tsx      # Native animated dropdown menus
│       ├── health-background.tsx  # Dynamic ambient gradient backgrounds
│       ├── icon.tsx               # Unified Lucide icon wrapper
│       ├── input.tsx              # Clean form inputs with floating labels
│       ├── input-otp.tsx          # OTP / PIN code verification input
│       ├── mode-toggle.tsx        # Light/Dark mode switcher
│       └── tabs.tsx               # Segmented controllers and tab bars
├── hooks/                         # Custom React hooks (useColor, useColorScheme, etc.)
├── theme/                         # Design tokens, color palettes, and global styles
├── providers/                     # Scroll context, state providers
└── package.json                   # Dependencies and npm scripts
```

---

## 🚀 Quick Start & How to Run

### Prerequisites
- [Node.js](https://nodejs.org) (v18.x or v20.x recommended)
- [Git](https://git-scm.com)
- Mobile Device with **Expo Go** installed (Available on Google Play Store & Apple App Store)

---

### 1. Install Dependencies
Open your terminal in the project directory:

```bash
cd d:\project\akash_bhutto
npm install
```

---

### 2. Start the Development Server
Run the standard Expo development server:

```bash
npx expo start
```

Or clear the Metro cache to start fresh:
```bash
npx expo start -c
```

---

### 3. Running on Expo Go (Physical Device)

1. Open the **Expo Go** app on your iOS or Android phone.
2. Ensure your phone and your PC are connected to the **same Wi-Fi network**.
3. **Android**: Tap **"Scan QR code"** inside Expo Go and scan the terminal QR code.
4. **iOS**: Open the native **Camera app**, point it at the QR code, and tap the notification to launch in Expo Go.

#### **Tunnel Mode (If Wi-Fi connection fails or different subnets):**
If your phone cannot connect to your local PC IP address, launch Expo with tunnel mode:
```bash
npx expo start --tunnel
```

---

### 4. Running on Emulators / Simulators

- **Android Emulator**:
  Make sure Android Studio has an active virtual device running, then press:
  ```bash
  a
  ```
  *(Or run `npx expo start --android`)*

- **iOS Simulator** (macOS only):
  Press:
  ```bash
  i
  ```
  *(Or run `npx expo start --ios`)*

---

### 5. Running in Web Browser
To test the web layout on desktop:
Press:
```bash
w
```
*(Or run `npx expo start --web`)*

---

## 🔍 Drug Authenticity Scanner

The scanner modal (`components/drug-scanner-modal.tsx`) is designed for fast, accurate pharmaceutical package verification:

- **Landscape Viewfinder**: Proportioned (`340px × 210px`) to match landscape tablet strips, blister foil cards, and medicine box label geometries.
- **Corner Aligners**: Prominent 4.5px rounded alignment boundaries.
- **Scanning Laser**: Real-time Reanimated laser line that smoothly traverses the viewfinder frame.
- **Bottom Bar Controls**:
  - **Left**: Flashlight / Torch toggle for dim lighting conditions.
  - **Center**: Shutter capture button for instantaneous barcode detection.
  - **Right**: **Gallery Photo Picker** icon — open device photo gallery, choose any saved image or photo of medicine packaging, and scan the barcode directly via `scanFromURLAsync`.

---

## 📦 All Screens & Capabilities

| Screen Route | Description |
|---|---|
| `app/(tabs)/(home)/index.tsx` | Main dashboard featuring quick actions, scanner launch, verification statistics, urgent recalls, and daily medication schedule. |
| `app/(tabs)/(home)/scan-result.tsx` | Detailed drug dossier showing manufacturer verification status, batch authenticity certificate, chemical composition, and regulatory registry match. |
| `app/(tabs)/(home)/medicine-cabinet.tsx` | Home medicine inventory with dosage reminders and stock indicators. |
| `app/(tabs)/(home)/recent-scans.tsx` | Audit trail of all previous scans with timestamp and batch codes. |
| `app/(tabs)/drugradar.tsx` | Active regulatory recalls and safety advisories categorized by risk tier. |
| `app/(tabs)/pricefair.tsx` | Retail price analyzer comparing official MRP with market pharmacy costs. |
| `app/(tabs)/family.tsx` | Health profiles for family members, emergency medical cards, and allergies. |
| `app/(tabs)/profile.tsx` | Account management, dark mode toggle, security settings, and notifications. |
| `app/help-support.tsx` | Complete guide to drug verification, barcode standards, and customer care. |
| `app/security-privacy.tsx` | Data encryption details, HIPAA compliance notes, and data export options. |

---

## 🎨 Theming & Design System

The application utilizes a dark/light design system:
- **Design Tokens**: Standardized in `theme/colors.ts` and `theme/globals.ts`.
- **Dynamic Palette**: Read dynamically via the custom `useColor` hook.
- **Typography**: Clean hierarchy with Inter font family weights (Regular, Medium, SemiBold, Bold).
- **Haptic Tactility**: Tactile haptic pulses on button taps, scan events, and verification successes.

---

## 🔧 Troubleshooting & Common Issues

### 1. `Cannot connect to Metro bundler`
- Ensure your phone and computer are on the exact same Wi-Fi.
- On Windows, check that Windows Firewall is not blocking port `8081`.
- Alternatively, run with tunnel mode:
  ```bash
  npx expo start --tunnel
  ```

### 2. Camera permission denied
- Go to device Settings → Expo Go → Permissions → Camera, and toggle **Allow**.
- Inside the app, the scanner also features a one-tap fallback **"Enable Camera"** button.

### 3. Clear Cache
If code modifications do not immediately reflect, clear the Metro bundle cache:
```bash
npx expo start -c
```

---

## 📄 License
Private & Proprietary. All rights reserved.
