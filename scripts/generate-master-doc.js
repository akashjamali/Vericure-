const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  convertInchesToTwip,
} = require('docx');

// Palette constants
const COLOR_PRIMARY = '1E3A8A'; // Deep Navy / Primary
const COLOR_ACCENT = '0284C7';  // Medical Cyan
const COLOR_DARK = '0F172A';    // Slate 900
const COLOR_MUTED = '475569';   // Slate 600
const COLOR_LIGHT_BG = 'F1F5F9';// Slate 100
const COLOR_HEADER_BG = '1E293B';// Slate 800
const COLOR_WHITE = 'FFFFFF';
const COLOR_BORDER = 'CBD5E1';  // Slate 300

function createCell(text, isHeader = false, widthPercent = 25, align = AlignmentType.LEFT) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: {
      type: ShadingType.CLEAR,
      fill: isHeader ? COLOR_HEADER_BG : COLOR_WHITE,
    },
    margins: {
      top: convertInchesToTwip(0.08),
      bottom: convertInchesToTwip(0.08),
      left: convertInchesToTwip(0.12),
      right: convertInchesToTwip(0.12),
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
    },
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            color: isHeader ? COLOR_WHITE : COLOR_DARK,
            size: 20, // 10pt
            font: 'Arial',
          }),
        ],
      }),
    ],
  });
}

function createHeading1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 32, // 16pt
        color: COLOR_PRIMARY,
        font: 'Arial',
      }),
    ],
  });
}

function createHeading2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26, // 13pt
        color: COLOR_ACCENT,
        font: 'Arial',
      }),
    ],
  });
}

function createHeading3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        color: COLOR_DARK,
        font: 'Arial',
      }),
    ],
  });
}

function createPara(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120 },
    alignment: options.align || AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        size: 21, // 10.5pt
        color: options.color || COLOR_DARK,
        font: 'Arial',
        bold: options.bold || false,
        italics: options.italics || false,
      }),
    ],
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ' ',
        bold: true,
        size: 21,
        color: COLOR_DARK,
        font: 'Arial',
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      size: 21,
      color: COLOR_DARK,
      font: 'Arial',
    })
  );

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 60 },
    children: children,
  });
}

async function generateMasterDoc() {
  const doc = new Document({
    creator: 'Antigravity IDE - Spinach',
    title: 'VeriCure Master Technical & Architectural Specification',
    description: 'Complete UI, Component, and Tech Stack Documentation for VeriCure Application',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children: [
          // Title Banner
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({
                text: 'VERICURE HEALTHCARE SYSTEM',
                bold: true,
                size: 40, // 20pt
                color: COLOR_PRIMARY,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: 'Master Architectural, Component, UI & Technology Blueprint',
                italics: true,
                size: 24, // 12pt
                color: COLOR_MUTED,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 },
            children: [
              new TextRun({
                text: 'Version 1.0.0 | Release Ready | React Native & Expo SDK 57',
                bold: true,
                size: 18,
                color: COLOR_ACCENT,
                font: 'Arial',
              }),
            ],
          }),

          // Section 1: Executive Summary
          createHeading1('1. Executive Overview'),
          createPara(
            'VeriCure is an enterprise-grade mobile pharmaceutical verification and patient medication stewardship platform. Built with React Native and Expo SDK 57, the application empowers consumers, patients, and healthcare providers to combat counterfeit pharmaceuticals, manage medicine inventories, track drug recalls in real time, and audit retail pricing transparency.'
          ),
          createPara(
            'The core pillar of the platform is an advanced optical scanner tailored with a landscape aspect ratio viewfinder designed explicitly for blister packaging, prescription cards, and tablet strip form factors, complete with gallery image decoding for offline or saved packaging scans.'
          ),

          // Section 2: Technology Stack & Matrix
          createHeading1('2. Technology Stack & Runtime Matrix'),
          createPara(
            'The application is constructed on the modern React Native New Architecture foundation, ensuring 60+ FPS UI fluidity, zero-bridge native overhead, and high-performance optical barcode processing.'
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Category', true, 22),
                  createCell('Package / Runtime', true, 26),
                  createCell('Version', true, 16),
                  createCell('Technical Role & Architectural Impact', true, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Core Framework', false, 22),
                  createCell('React Native', false, 26),
                  createCell('0.86.3', false, 16),
                  createCell('Mobile runtime with New Architecture support', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Frontend Library', false, 22),
                  createCell('React', false, 26),
                  createCell('19.2.3', false, 16),
                  createCell('Next-gen React compiler runtime & hooks', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Platform SDK', false, 22),
                  createCell('Expo SDK', false, 26),
                  createCell('~57.0.8', false, 16),
                  createCell('Unified tooling, Metro bundler, native modules', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Routing & Navigation', false, 22),
                  createCell('Expo Router', false, 26),
                  createCell('~57.0.8', false, 16),
                  createCell('File-system routing with nested stacks and tab groups', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Styling Engine', false, 22),
                  createCell('TailwindCSS / NativeWind', false, 26),
                  createCell('v3.4 / v4.2', false, 16),
                  createCell('Utility-first CSS compiled to React Native StyleSheet', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Camera & Barcode', false, 22),
                  createCell('expo-camera', false, 26),
                  createCell('~57.0.4', false, 16),
                  createCell('Real-time CameraView & scanFromURLAsync barcode reader', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Media & Gallery', false, 22),
                  createCell('expo-image-picker', false, 26),
                  createCell('~57.0.20', false, 16),
                  createCell('Device photo library access for offline image scanning', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Animation Engine', false, 22),
                  createCell('react-native-reanimated', false, 26),
                  createCell('4.5.1', false, 16),
                  createCell('60fps laser scanning bar and transition animations', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tactile Engine', false, 22),
                  createCell('expo-haptics', false, 26),
                  createCell('~57.0.1', false, 16),
                  createCell('Hardware haptic feedback for user taps and scan hits', false, 36),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Iconography', false, 22),
                  createCell('lucide-react-native', false, 26),
                  createCell('^1.27.0', false, 16),
                  createCell('Medical and general iconography library', false, 36),
                ],
              }),
            ],
          }),

          // Section 3: Architecture & Directory Structure
          createHeading1('3. File Structure & Architectural Hierarchy'),
          createPara(
            'The repository adheres strictly to Expo Router convention where files and directories within `app/` dictate URL routing, modal presentations, and nested layouts.'
          ),
          createBullet('Root layout orchestrator initializing ThemeProvider, dark/light context, and safe area bounds.', 'app/_layout.tsx:'),
          createBullet('Entry route performing onboarding validation and directing to (tabs)/(home).', 'app/index.tsx:'),
          createBullet('Main bottom navigation controller defining floating tabs (Home, Radar, PriceFair, Cabinet, Family, Profile).', 'app/(tabs)/_layout.tsx:'),
          createBullet('Executive dashboard with verification widgets, emergency recalls, and daily medicine timeline.', 'app/(tabs)/(home)/index.tsx:'),
          createBullet('High-resolution pharmaceutical authenticity verification dossier showing batch numbers, expiration, manufacturer, and DRAP status.', 'app/(tabs)/(home)/scan-result.tsx:'),
          createBullet('Comprehensive household medicine tracker with expiry alerts and dosage scheduling.', 'app/(tabs)/(home)/medicine-cabinet.tsx:'),
          createBullet('Audit trail of all verified scans, timestamps, and pass/fail logs.', 'app/(tabs)/(home)/recent-scans.tsx:'),
          createBullet('Regulatory recall bulletin monitoring flagged lots and batch hazard warnings.', 'app/(tabs)/drugradar.tsx:'),
          createBullet('Drug pricing intelligence comparing actual pharmacy retail prices against government Maximum Retail Prices (MRP).', 'app/(tabs)/pricefair.tsx:'),
          createBullet('Multi-patient family profile manager storing chronic conditions, known drug allergies, and emergency cards.', 'app/(tabs)/family.tsx:'),
          createBullet('User profile, biometric security, dark mode toggle, and notification preferences.', 'app/(tabs)/profile.tsx:'),
          createBullet('Frequently Asked Questions, regulatory guidelines, and support ticket system.', 'app/help-support.tsx:'),
          createBullet('Data encryption protocols, privacy guarantees, and audit export.', 'app/security-privacy.tsx:'),

          // Section 4: Optical Scanner & Landscape Viewfinder
          createHeading1('4. Optical Scanner & Computer Vision Engine'),
          createPara(
            'The Drug Authenticity Scanner is implemented in `components/drug-scanner-modal.tsx`. Designed specifically for pharmaceutical packaging, it introduces key innovations:'
          ),
          createHeading2('A. Landscape Aspect Ratio Reticle'),
          createPara(
            'Unlike generic QR scanners that enforce square frames, medicine blister packaging, foil strips, and cartons are predominantly rectangular. The viewfinder utilizes dynamic proportions (Width = Math.min(SCREEN_WIDTH - 44, 340), Height = Width * 0.62 ~ 210px) with 4.5px thick rounded corner indicators to guide patients to frame their medications effortlessly.'
          ),
          createHeading2('B. Reanimated Scanning Laser'),
          createPara(
            'A high-visibility laser sweep animated via `react-native-reanimated` runs on the UI thread at native 60fps across the landscape reticle height without consuming JavaScript thread cycles.'
          ),
          createHeading2('C. Multi-Format Barcode Engine'),
          createPara(
            'The scanner actively hooks into native camera feeds with MLKit/Vision support for GS1 DataMatrix, EAN-13, QR codes, Code 128, and UPC-A.'
          ),
          createHeading2('D. Gallery Image Picker & Offline Image Decoder'),
          createPara(
            'Positioned symmetrically on the right side of the bottom control bar, the Gallery button connects with `expo-image-picker`. When the user selects a photo of medicine packaging, the image URI is fed to `scanFromURLAsync` to extract barcode payloads directly, ensuring seamless verification even without direct camera access.'
          ),

          // Section 5: Screen-by-Screen UI Analysis
          createHeading1('5. Detailed Screen & UI Specifications'),

          createHeading2('1. Dashboard (Home Screen)'),
          createPara(
            'The central control center of the VeriCure app. Features:'
          ),
          createBullet('Brand header with animated VeriCure logo, notification bell, and dark mode toggle.', 'Header:'),
          createBullet('Prominent interactive card with gradient aura inviting the user to scan medicine for counterfeit detection.', 'Hero Scan Banner:'),
          createBullet('Total Verified, Counterfeit Alerts Blocked, and Cabinet Items at a glance.', 'Verification Metrics:'),
          createBullet('Quick navigators for Medicine Cabinet, Drug Radar, Price Check, and Saved Reports.', 'Quick Actions Grid:'),
          createBullet('Urgent drug recall ticker warning patients of compromised batches.', 'Recall Alert Banner:'),
          createBullet('Morning, afternoon, and evening medication schedule with one-tap completion checks.', 'Daily Medicine Regimen:'),

          createHeading2('2. Scan Result Dossier'),
          createPara(
            'Triggered automatically upon successful barcode detection or image decoding:'
          ),
          createBullet('Green shield badge indicating "Authentic Verified Product" or red warning for counterfeit.', 'Status Banner:'),
          createBullet('Brand Name, Active Formula, Strength (e.g. 625mg), Dosage Form (Tablet / Capsule).', 'Product Identity:'),
          createBullet('Manufacturer name, license code, manufacturing date, and verified expiry date.', 'Batch Intelligence:'),
          createBullet('Direct cross-reference against national drug registration databases.', 'Regulatory Match:'),
          createBullet('Buttons to save dossier to PDF, export report, or add medicine directly to the digital cabinet.', 'Action Bar:'),

          createHeading2('3. Medicine Cabinet'),
          createPara(
            'Allows patients to eliminate expired medications and maintain safe household inventories:'
          ),
          createBullet('Filter by Active, Low Stock, and Expired categories.', 'Category Tabs:'),
          createBullet('Displays pill count remaining, daily reminder times, and color-coded expiration warning indicators.', 'Medicine Cards:'),
          createBullet('Input modal to log batch code, pharmacy name, expiry, and dosage rules.', 'Add Medication Modal:'),

          createHeading2('4. Drug Radar (Recall & Safety Advisories)'),
          createPara(
            'Keeps users informed about pharmaceutical recalls issued by health authorities:'
          ),
          createBullet('Tier 1 (Critical Hazard - Immediate cessation), Tier 2 (Quality defect), Tier 3 (Packaging discrepancy).', 'Recall Severity Tiers:'),
          createBullet('Search bar querying brand names, chemical salts, and lot numbers against contaminated product registries.', 'Real-time Search:'),
          createBullet('Symptom checklists and steps to report adverse drug events.', 'Guidance Protocols:'),

          createHeading2('5. PriceFair (Pricing Intelligence)'),
          createPara(
            'Protects consumers from inflated pharmacy pricing and price gouging:'
          ),
          createBullet('Side-by-side comparison of local pharmacy price vs. Government Gazetted MRP.', 'Price Comparison Table:'),
          createBullet('Calculates overcharge amount and percentage savings if purchasing generic equivalents.', 'Savings Calculator:'),
          createBullet('Lists verified bioequivalent generic brands with identical API composition at lower costs.', 'Generic Alternatives:'),

          createHeading2('6. Family Health Manager'),
          createPara(
            'Manages healthcare profiles for multiple dependents and family members:'
          ),
          createBullet('Switch seamlessly between Self, Spouse, Children, and Elderly Parents.', 'Member Selector:'),
          createBullet('Lists known drug allergies (e.g., Penicillin, NSAIDs) with severe interaction warnings during drug scans.', 'Allergy Safeguards:'),
          createBullet('Quick emergency phone contacts for attending physicians and local ambulance dispatch.', 'Emergency Contacts:'),

          // Section 6: UI Component Library
          createHeading1('6. Reusable UI Components Directory'),
          createPara(
            'Located in `components/ui/`, all components utilize the centralized design system and `useColor` token hook for automatic dark/light theme switching:'
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Component', true, 25),
                  createCell('Source Path', true, 35),
                  createCell('Purpose & Capabilities', true, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('AppLogo', false, 25),
                  createCell('components/ui/app-logo.tsx', false, 35),
                  createCell('Scalable SVG branded medical cross and wordmark with glowing gradients', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Button', false, 25),
                  createCell('components/ui/button.tsx', false, 35),
                  createCell('Customizable button supporting Primary, Secondary, Outline, Ghost, and Destructive variants with haptic feedback', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Card', false, 25),
                  createCell('components/ui/card.tsx', false, 35),
                  createCell('Container card with subtle border styling, glassmorphism, and theme-aware shadows', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('DropdownMenu', false, 25),
                  createCell('components/ui/dropdown-menu.tsx', false, 35),
                  createCell('Accessible animated modal dropdown for filter menus and option pickers', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('HealthBackground', false, 25),
                  createCell('components/ui/health-background.tsx', false, 35),
                  createCell('Subtle ambient background gradient enhancing medical aesthetic', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Icon', false, 25),
                  createCell('components/ui/icon.tsx', false, 35),
                  createCell('Lucide icon wrapper with normalized sizing and theme color adaptation', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Input', false, 25),
                  createCell('components/ui/input.tsx', false, 35),
                  createCell('Form text fields with focus transitions, clear buttons, and error message states', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('InputOTP', false, 25),
                  createCell('components/ui/input-otp.tsx', false, 35),
                  createCell('PIN / OTP segmented verification input for 2FA and batch code entry', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('ModeToggle', false, 25),
                  createCell('components/ui/mode-toggle.tsx', false, 35),
                  createCell('Sun/Moon theme switcher switching system palette seamlessly', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Tabs', false, 25),
                  createCell('components/ui/tabs.tsx', false, 35),
                  createCell('Segmented tab control for switching filter states and category views', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('DrugScannerModal', false, 25),
                  createCell('components/drug-scanner-modal.tsx', false, 35),
                  createCell('Landscape camera scanner, laser sweep, torch toggle, and gallery image picker', false, 40),
                ],
              }),
            ],
          }),

          // Section 7: Running & Deployment
          createHeading1('7. Execution, Testing & Deployment Guide'),
          createPara(
            'To run and test the VeriCure mobile application across all supported targets, execute the following steps:'
          ),
          createHeading2('A. Standard Local Dev Server'),
          createBullet('Execute `npm install` to ensure all native modules are installed.', 'Step 1:'),
          createBullet('Execute `npx expo start` to launch the Metro bundler at `http://localhost:8081`.', 'Step 2:'),
          createBullet('Scan the terminal QR code using Expo Go on Android or the iOS Camera app.', 'Step 3:'),

          createHeading2('B. Tunnel Mode (Across Different Wi-Fi Subnets)'),
          createPara(
            'When the mobile device is on cellular data or an isolated guest Wi-Fi network, execute:'
          ),
          createBullet('Run `npx expo start --tunnel` to establish a secure tunnel proxy via ngrok.', 'Command:'),

          createHeading2('C. Metro Bundler Terminal Hotkeys'),
          createBullet('Press `a` in the terminal to spawn and link to an Android Virtual Device (AVD).', 'Android Emulator:'),
          createBullet('Press `i` in the terminal to attach to an active Xcode iOS Simulator.', 'iOS Simulator:'),
          createBullet('Press `w` in the terminal to launch the responsive web preview in Chrome or Edge.', 'Web Browser:'),
          createBullet('Press `r` to trigger a fast hot reload of the JavaScript bundle.', 'Reload Bundle:'),
          createBullet('Press `m` to toggle the developer menu.', 'Dev Menu:'),

          // Section 8: Quality Assurance & Standards
          createHeading1('8. Code Standards & Future Roadmap'),
          createBullet('Strict TypeScript validation enforced across all screens (`npx tsc --noEmit`).', 'Static Typing:'),
          createBullet('All colors derived via `useColor` tokens to ensure flawless contrast in dark and light themes.', 'Theme Fidelity:'),
          createBullet('Screen reader labels (`accessibilityLabel`, `accessibilityRole`) applied on all interactive buttons and scanner controls.', 'Accessibility:'),
          createBullet('Integration with offline SQLite cache for offline barcode verification in remote rural clinics.', 'Roadmap 1:'),
          createBullet('Deep integration with Government Drug Regulatory Authority API webhooks for automated recall push notifications.', 'Roadmap 2:'),

          // Document Footer / Sign-off
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({
                text: '— End of Specification Document —',
                italics: true,
                size: 20,
                color: COLOR_MUTED,
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'VeriCure_Master_Project_Documentation.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Document successfully written to:', outputPath);
}

generateMasterDoc().catch((err) => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
