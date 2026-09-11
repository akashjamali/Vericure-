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
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, TextInput } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SavedReportItem {
  id: string;
  name: string;
  generic: string;
  batchNumber: string;
  manufacturer: string;
  savedAt: string;
  expiryDate: string;
  status: "verified" | "flagged";
  sealStatus: string;
}

export const INITIAL_SAVED_REPORTS: SavedReportItem[] = [
  {
    id: "1",
    name: "Augmentin 625mg",
    generic: "Amoxicillin and Clavulanate",
    batchNumber: "BNT-89240-PK",
    manufacturer: "GlaxoSmithKline (GSK)",
    savedAt: "10 Sep 2026",
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
    savedAt: "08 Sep 2026",
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
    savedAt: "04 Sep 2026",
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
    savedAt: "29 Aug 2026",
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
    savedAt: "25 Aug 2026",
    expiryDate: "Oct 2027",
    status: "verified",
    sealStatus: "Cryptographic Verified",
  },
  {
    id: "6",
    name: "Risek 20mg",
    generic: "Omeprazole",
    batchNumber: "GTZ-11029-PK",
    manufacturer: "Getz Pharma",
    savedAt: "20 Aug 2026",
    expiryDate: "May 2028",
    status: "verified",
    sealStatus: "SHA-256 Validated",
  },
  {
    id: "7",
    name: "Klaricid 250mg",
    generic: "Clarithromycin",
    batchNumber: "ABT-55421-KHI",
    manufacturer: "Abbott Laboratories",
    savedAt: "15 Aug 2026",
    expiryDate: "Jan 2027",
    status: "verified",
    sealStatus: "Cryptographic Verified",
  },
];

// ── Info row: same pattern as recent scans / medicine cabinet ────────────────
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
    <View className="flex-row items-center justify-between py-3 border-b border-border">
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

// ── Summary tile: identical to all report / medicine cabinet ────────────────
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

// ── Individual saved card: identical structure to recent scans ───────────────
function SavedCard({
  report,
  index,
  onViewCertificate,
  onRemove,
}: {
  report: SavedReportItem;
  index: number;
  onViewCertificate: (code: string, item: string, generic: string) => void;
  onRemove: (id: string, name: string) => void;
}) {
  const isVerified = report.status === "verified";
  const StatusIcon = isVerified ? CheckCircle2 : AlertCircle;

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(index * 50)}>
      <Card className="bg-card border border-border rounded-xl p-4 shadow-none">
        {/* ── Card header: icon + name + status badge ── */}
        <View className="flex-row items-center gap-3 mb-3.5">
          <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
            <Icon
              name={ShieldCheck}
              size={20}
              color="#2b65ff"
            />
          </View>

          <View className="flex-1 min-w-0 justify-center py-1">
            <Text
              className="text-sm font-bold text-foreground"
              style={{ includeFontPadding: false }}
              numberOfLines={1}
            >
              {report.name}
            </Text>
            <Text
              className="text-xs text-muted-foreground mt-1"
              style={{ includeFontPadding: false }}
              numberOfLines={1}
            >
              {report.generic}
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
        <InfoRow icon={Package} label="Batch Number" value={`#${report.batchNumber}`} />
        <InfoRow icon={Stethoscope} label="Manufacturer" value={report.manufacturer} />
        <InfoRow icon={Clock} label="Saved on" value={report.savedAt} />
        <InfoRow
          icon={Calendar}
          label="Expiry Date"
          value={report.expiryDate}
          valueClass={isVerified ? "text-primary font-semibold" : "text-destructive font-semibold"}
        />

        {/* ── Footer: security tag + actions ── */}
        <View className="flex-row items-center justify-between mt-3.5 pt-3 border-t border-border">
          <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-3 flex-wrap">
            <View className="border border-border rounded-full px-2.5 py-0.5 shrink-0">
              <Text
                className="font-medium text-muted-foreground"
                style={{ fontSize: 11, lineHeight: 15 }}
              >
                {report.sealStatus}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => onRemove(report.id, report.name)}
              hitSlop={8}
              className="p-1 active:opacity-60"
              accessibilityLabel="Remove from saved"
            >
              <Icon name={Trash2} size={15} color="#94a3b8" />
            </Pressable>

            <Pressable
              onPress={() => onViewCertificate(report.batchNumber, report.name, report.generic)}
              hitSlop={8}
              className="active:opacity-60"
            >
              <Text className="text-xs font-semibold text-primary">
                View Certificate ›
              </Text>
            </Pressable>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────────
export default function SavedReportsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [reports, setReports] = useState<SavedReportItem[]>(INITIAL_SAVED_REPORTS);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleRemove = (id: string, name: string) => {
    triggerHaptic();
    Alert.alert(
      "Remove Report",
      `Are you sure you want to remove "${name}" from your saved reports?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            triggerHaptic();
            setReports((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const filteredReports = reports.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.generic.toLowerCase().includes(search.toLowerCase()) ||
      r.manufacturer.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const verifiedCount = reports.filter((r) => r.status === "verified").length;

  const handleViewCertificate = (code: string, item: string, generic: string) => {
    triggerHaptic();
    router.push({
      pathname: "/(tabs)/(home)/scan-result",
      params: { code, item, generic },
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Header: identical to all report ── */}
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
            accessibilityLabel="Search saved reports"
          >
            <Icon
              name={Search}
              size={17}
              color={isSearchOpen || search ? "#2b65ff" : "#0e142b"}
            />
          </Pressable>
        </View>

        {/* Collapsible Search Bar (dedicated to Saved Reports) */}
        {isSearchOpen || search ? (
          <View className="px-5 pt-3">
            <View
              className="flex-row items-center bg-card border border-border px-4 py-2.5 gap-2.5"
              style={{ borderRadius: 999 }}
            >
              <Icon name={Search} size={15} color="#94a3b8" />
              <TextInput
                ref={searchInputRef}
                value={search}
                onChangeText={setSearch}
                placeholder="Search saved reports..."
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
            <Icon name={BookmarkCheck} size={22} color="#2b65ff" />
          </View>
          <View>
            <Text className="text-base font-bold text-foreground">Saved Reports</Text>
            <Text className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {filteredReports.length} saved certificate{filteredReports.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </Animated.View>

        {/* Summary strip */}
        <Animated.View entering={FadeIn.duration(240).delay(50)} className="flex-row gap-2.5">
          <SummaryTile count={verifiedCount} label="Genuine" />
          <SummaryTile count={reports.length} label="Active" />
          <SummaryTile count={reports.length} label="Total saved" />
        </Animated.View>

        {/* Section label */}
        <Text className="text-xs font-semibold text-muted-foreground px-1">
          Saved certificates
        </Text>

        {/* Cards */}
        {filteredReports.length === 0 ? (
          <Animated.View
            entering={FadeIn.duration(260)}
            className="items-center justify-center py-16 px-4 bg-card rounded-xl border border-border mt-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted items-center justify-center mb-3">
              <Icon name={FileText} size={22} color="#94a3b8" />
            </View>
            <Text className="text-sm font-bold text-foreground mb-1 text-center">
              {search ? "No reports match your search" : "No saved reports yet"}
            </Text>
            <Text className="text-xs text-muted-foreground text-center leading-relaxed">
              {search
                ? "Try searching by medicine name, manufacturer or batch number."
                : "Medicines and verified reports you bookmark will appear here."}
            </Text>
          </Animated.View>
        ) : (
          filteredReports.map((report, idx) => (
            <SavedCard
              key={report.id}
              report={report}
              index={idx}
              onViewCertificate={handleViewCertificate}
              onRemove={handleRemove}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
