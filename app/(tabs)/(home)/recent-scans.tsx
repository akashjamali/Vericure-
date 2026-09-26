import { AppLogo } from "@/components/ui/app-logo";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Pressable, TextInput } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface RecentScanItem {
  id: string;
  name: string;
  generic: string;
  batchNumber: string;
  manufacturer: string;
  scannedAt: string;
  expiryDate: string;
  status: "verified" | "flagged";
  sealStatus: string;
}

export const RECENT_SCANS: RecentScanItem[] = [
  {
    id: "1",
    name: "Augmentin 625mg",
    generic: "Amoxicillin and Clavulanate",
    batchNumber: "BNT-89240-PK",
    manufacturer: "GlaxoSmithKline (GSK)",
    scannedAt: "Today, 2:15 PM",
    expiryDate: "Nov 2028",
    status: "verified",
    sealStatus: "SHA-256 Validated",
  },
  {
    id: "2",
    name: "Panadol Extra",
    generic: "Paracetamol and Caffeine",
    batchNumber: "GSK-44910-KHI",
    manufacturer: "GSK Consumer Healthcare",
    scannedAt: "Yesterday, 6:40 PM",
    expiryDate: "Feb 2026",
    status: "verified",
    sealStatus: "Cryptographic Verified",
  },
  {
    id: "3",
    name: "Brufen 400mg",
    generic: "Ibuprofen",
    batchNumber: "ABT-10293-LHR",
    manufacturer: "Abbott Laboratories",
    scannedAt: "08 Sep 2026, 11:20 AM",
    expiryDate: "Aug 2027",
    status: "verified",
    sealStatus: "SHA-256 Validated",
  },
  {
    id: "4",
    name: "Cravit 500mg",
    generic: "Levofloxacin",
    batchNumber: "SNT-77182-ISB",
    manufacturer: "Sanofi Pakistan",
    scannedAt: "05 Sep 2026, 4:10 PM",
    expiryDate: "Dec 2026",
    status: "verified",
    sealStatus: "Tamper Seal Intact",
  },
  {
    id: "5",
    name: "Nexum 40mg",
    generic: "Esomeprazole Magnesium",
    batchNumber: "GTZ-30948-PK",
    manufacturer: "Getz Pharma",
    scannedAt: "01 Sep 2026, 1:45 PM",
    expiryDate: "Oct 2027",
    status: "verified",
    sealStatus: "Cryptographic Verified",
  },
  {
    id: "6",
    name: "Arinac Forte",
    generic: "Ibuprofen & Pseudoephedrine",
    batchNumber: "ABT-99231-RAW",
    manufacturer: "Abbott Laboratories",
    scannedAt: "28 Aug 2026, 10:05 AM",
    expiryDate: "Jun 2025",
    status: "flagged",
    sealStatus: "Expired / Tampered Seal",
  },
];

// ── Info row: same pattern as medicine cabinet ───────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: any;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <View
      className="flex-row items-center justify-between py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.05)' }}
    >
      <View className="flex-row items-center gap-2.5 shrink-0">
        <Icon name={icon} size={14} color="#94a3b8" />
        <Text className="text-xs text-muted-foreground leading-5">{label}</Text>
      </View>
      <Text
        className={`text-sm font-medium text-right flex-1 ml-4 leading-5 ${valueClass ?? "text-foreground"}`}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Summary tile: identical to medicine cabinet ─────────────────────────────
function SummaryTile({
  count,
  label,
  accent,
}: {
  count: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <View className="flex-1 rounded-xl border border-border px-3 py-4 items-center gap-1 bg-card">
      <Text
        className={`text-xl font-extrabold ${accent ? "text-primary" : "text-foreground"}`}
      >
        {count}
      </Text>
      <Text className="text-xs text-muted-foreground font-semibold">{label}</Text>
    </View>
  );
}

// ── Individual scan card: identical structure to MedicineCard ───────────────
function ScanCard({
  scan,
  index,
  onViewCertificate,
}: {
  scan: RecentScanItem;
  index: number;
  onViewCertificate: (code: string, item: string) => void;
}) {
  const isVerified = scan.status === "verified";
  const StatusIcon = isVerified ? CheckCircle2 : AlertCircle;

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(index * 55)}>
      <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
        {/* ── Card header: icon + name + status badge ── */}
        <View className="flex-row items-center gap-3 mb-3.5">
          <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
            <Icon
              name={isVerified ? ShieldCheck : ShieldAlert}
              size={20}
              color={isVerified ? "#2b65ff" : "#ff6c35"}
            />
          </View>

          <View className="flex-1 min-w-0 justify-center py-1">
            <Text
              className="text-sm font-bold text-foreground"
              style={{ includeFontPadding: false }}
              numberOfLines={1}
            >
              {scan.name}
            </Text>
            <Text
              className="text-xs text-muted-foreground mt-1"
              style={{ includeFontPadding: false }}
              numberOfLines={1}
            >
              {scan.generic}
            </Text>
          </View>

          {/* Status badge */}
          <View
            className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${
              isVerified ? "bg-primary/10" : "bg-destructive/10"
            }`}
          >
            <Icon
              name={StatusIcon}
              size={11}
              color={isVerified ? "#2b65ff" : "#ff6c35"}
            />
            <Text
              className={`text-[11px] font-semibold ${
                isVerified ? "text-primary" : "text-destructive"
              }`}
            >
              {isVerified ? "Verified" : "Flagged"}
            </Text>
          </View>
        </View>

        {/* ── Info rows ── */}
        <InfoRow icon={Package} label="Batch Number" value={`#${scan.batchNumber}`} />
        <InfoRow icon={Stethoscope} label="Manufacturer" value={scan.manufacturer} />
        <InfoRow icon={Clock} label="Scanned At" value={scan.scannedAt} />
        <InfoRow
          icon={Calendar}
          label="Expiry Date"
          value={scan.expiryDate}
          valueClass={isVerified ? "text-primary font-semibold" : "text-destructive font-semibold"}
        />

        {/* ── Footer: security tag + action ── */}
        <View
          className="flex-row items-center justify-between mt-3.5 pt-3"
          style={{ borderTopWidth: 1, borderTopColor: 'rgba(0, 0, 0, 0.05)' }}
        >
          <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-3 flex-wrap">
            <View className="border border-border rounded-full px-2.5 py-0.5 shrink-0">
              <Text
                className="font-medium text-muted-foreground"
                style={{ fontSize: 11, lineHeight: 15 }}
              >
                {scan.sealStatus}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => onViewCertificate(scan.batchNumber, scan.name)}
            hitSlop={8}
            className="active:opacity-60"
          >
            <Text className="text-xs font-semibold text-primary">
              View Certificate ›
            </Text>
          </Pressable>
        </View>
      </Card>
    </Animated.View>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────────
export default function RecentScansScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const filteredScans = RECENT_SCANS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.generic.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const verifiedCount = RECENT_SCANS.filter((s) => s.status === "verified").length;
  const flaggedCount = RECENT_SCANS.filter((s) => s.status === "flagged").length;

  const handleViewCertificate = (code: string, item: string) => {
    triggerHaptic();
    router.push({
      pathname: "/(tabs)/(home)/scan-result",
      params: { code, item },
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Header — identical to medicine cabinet ── */}
      <View
        className="bg-background pb-3"
        style={{ paddingTop: Math.max(insets.top, 20) + 8, zIndex: 60 }}
      >
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => {
                triggerHaptic();
                router.back();
              }}
              hitSlop={8}
              className="w-9 h-9 rounded-full bg-background items-center justify-center border border-border active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name={ArrowLeft} size={18} color="#0e142b" />
            </Pressable>
            <AppLogo width={96} height={32} />
          </View>

          {/* Search Button in Header */}
          <Pressable
            onPress={() => {
              triggerHaptic();
              setIsSearchOpen((prev) => {
                const next = !prev;
                if (next) {
                  setTimeout(() => searchInputRef.current?.focus(), 150);
                } else {
                  setSearch("");
                }
                return next;
              });
            }}
            hitSlop={8}
            className={`w-9 h-9 rounded-full items-center justify-center border active:opacity-60 ${
              isSearchOpen || search
                ? "bg-primary/10 border-primary"
                : "bg-background border-border"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Search scans"
          >
            <Icon
              name={Search}
              size={17}
              color={isSearchOpen || search ? "#2b65ff" : "#0e142b"}
            />
          </Pressable>
        </View>

        {/* Collapsible Search Bar (dedicated to Recent Scans only) */}
        {isSearchOpen || search ? (
          <View className="px-5 pt-3">
            <View className="flex-row items-center bg-card border border-border rounded-full px-4 py-2.5 gap-2.5">
              <Icon name={Search} size={15} color="#94a3b8" />
              <TextInput
                ref={searchInputRef}
                value={search}
                onChangeText={setSearch}
                placeholder="Search recent scans..."
                placeholderTextColor="#94a3b8"
                className="flex-1 text-xs text-foreground p-0"
              />
              {search ? (
                <Pressable
                  onPress={() => setSearch("")}
                  hitSlop={8}
                  className="w-5 h-5 rounded-full bg-muted items-center justify-center"
                >
                  <Icon name={X} size={11} color="#0e142b" />
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>

      {/* ── Content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2 pb-14 gap-2.5"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Animated.View entering={FadeIn.duration(220)} className="flex-row items-center gap-3.5">
          <View className="w-11 h-11 rounded-xl bg-primary/10 items-center justify-center">
            <Icon name={QrCode} size={22} color="#2b65ff" />
          </View>
          <View>
            <Text className="text-base font-bold text-foreground">Recent Scans</Text>
            <Text className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {filteredScans.length} scan{filteredScans.length !== 1 ? "s" : ""} recorded
            </Text>
          </View>
        </Animated.View>

        {/* Summary strip */}
        <Animated.View entering={FadeIn.duration(240).delay(50)} className="flex-row gap-2.5">
          <SummaryTile count={verifiedCount} label="Genuine" />
          <SummaryTile count={flaggedCount} label="Flagged" />
          <SummaryTile count={RECENT_SCANS.length} label="Total" />
        </Animated.View>

        {/* Section label */}
        <Text className="text-xs font-semibold text-muted-foreground px-1">
          All scans
        </Text>

        {/* Cards */}
        {filteredScans.length === 0 ? (
          <Animated.View
            entering={FadeIn.duration(260)}
            className="items-center py-16 gap-3"
          >
            <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
              <Icon name={QrCode} size={26} color="#2b65ff" />
            </View>
            <Text className="text-sm font-bold text-foreground">No scans found</Text>
            <Text className="text-xs text-muted-foreground text-center leading-relaxed max-w-[200px]">
              Try searching for a different medicine or batch number
            </Text>
          </Animated.View>
        ) : (
          <View className="gap-3">
            {filteredScans.map((scan, i) => (
              <ScanCard
                key={scan.id}
                scan={scan}
                index={i}
                onViewCertificate={handleViewCertificate}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
