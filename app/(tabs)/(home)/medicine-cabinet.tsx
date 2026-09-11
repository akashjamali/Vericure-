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
  Pill,
  Plus,
  Stethoscope,
  Thermometer,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MedicineStatus = "active" | "expiring" | "expired";

interface Medicine {
  id: string;
  name: string;
  generic: string;
  category: string;
  dose: string;
  quantity: string;
  manufactureDate: string;
  expiryDate: string;
  manufacturer: string;
  forMember: string;
  status: MedicineStatus;
  icon: any;
  notes?: string;
}

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: "1",
    name: "Augmentin 625mg",
    generic: "Amoxicillin and Clavulanate",
    category: "Antibiotic",
    dose: "1 tablet, twice daily",
    quantity: "14 tablets remaining",
    manufactureDate: "Jan 2025",
    expiryDate: "Nov 2028",
    manufacturer: "GlaxoSmithKline (GSK)",
    forMember: "Akash",
    status: "active",
    icon: Pill,
    notes: "Take with food",
  },
  {
    id: "2",
    name: "Panadol Extra",
    generic: "Paracetamol and Caffeine",
    category: "Analgesic",
    dose: "1-2 tablets as needed",
    quantity: "20 tablets remaining",
    manufactureDate: "Mar 2025",
    expiryDate: "Feb 2026",
    manufacturer: "GSK Consumer Healthcare",
    forMember: "Family",
    status: "expiring",
    icon: Thermometer,
    notes: "Max 4g per day",
  },
  {
    id: "3",
    name: "Omeprazole 20mg",
    generic: "Omeprazole",
    category: "Antacid",
    dose: "1 capsule before breakfast",
    quantity: "28 capsules remaining",
    manufactureDate: "Jun 2024",
    expiryDate: "May 2025",
    manufacturer: "Getz Pharma",
    forMember: "Father",
    status: "expired",
    icon: Package,
  },
  {
    id: "4",
    name: "Cetirizine 10mg",
    generic: "Cetirizine HCl",
    category: "Antihistamine",
    dose: "1 tablet once at night",
    quantity: "10 tablets remaining",
    manufactureDate: "Aug 2025",
    expiryDate: "Jul 2027",
    manufacturer: "Hilton Pharma",
    forMember: "Mother",
    status: "active",
    icon: Stethoscope,
  },
];

// status badge — only primary (active) or destructive (else)
// icon color driven by same token, passed as raw hex since Icon needs it
const STATUS_META: Record<
  MedicineStatus,
  { label: string; icon: any; iconColor: string; textClass: string; bgClass: string }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    iconColor: "#2b65ff",
    textClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  expiring: {
    label: "Expiring Soon",
    icon: AlertCircle,
    iconColor: "#ff6c35",
    textClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    iconColor: "#ff6c35",
    textClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
};

// ── Info row: same pattern as home page scan card rows ───────────────────────
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

// ── Individual medicine card ──────────────────────────────────────────────────
function MedicineCard({
  medicine,
  index,
  onDelete,
}: {
  medicine: Medicine;
  index: number;
  onDelete: (id: string) => void;
}) {
  const s = STATUS_META[medicine.status];
  const StatusIcon = s.icon;

  const expiryValueClass =
    medicine.status === "active"
      ? "text-primary font-semibold"
      : "text-destructive font-semibold";

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(index * 55)}>
      <Card className="bg-card border border-border rounded-xl p-4 shadow-none">

        {/* ── Card header: icon + name + status badge ── */}
        <View className="flex-row items-center gap-3 mb-3.5">
          <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
            <Icon name={medicine.icon} size={20} color="#2b65ff" />
          </View>

          <View className="flex-1 min-w-0 justify-center py-1">
            <Text
              className="text-sm font-bold text-foreground"
              style={{ includeFontPadding: false }}
              numberOfLines={1}
            >
              {medicine.name}
            </Text>
            <Text
              className="text-xs text-muted-foreground mt-1"
              style={{ includeFontPadding: false }}
              numberOfLines={1}
            >
              {medicine.generic}
            </Text>
          </View>

          {/* Status badge */}
          <View className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${s.bgClass}`}>
            <Icon name={StatusIcon} size={11} color={s.iconColor} />
            <Text className={`text-[11px] font-semibold ${s.textClass}`}>{s.label}</Text>
          </View>
        </View>

        {/* ── Info rows ── */}
        <InfoRow icon={Clock} label="Dose" value={medicine.dose} />
        <InfoRow icon={Package} label="Quantity" value={medicine.quantity} />
        <InfoRow icon={Calendar} label="Mfg. Date" value={medicine.manufactureDate} />
        <InfoRow
          icon={Calendar}
          label="Expiry Date"
          value={medicine.expiryDate}
          valueClass={expiryValueClass}
        />
        <InfoRow
          icon={Stethoscope}
          label="Manufacturer"
          value={medicine.manufacturer}
        />

        {/* ── Footer: category pill + member + delete ── */}
        <View className="flex-row items-center justify-between mt-3.5 pt-3 border-t border-border">
          <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-3 flex-wrap">
            <View className="border border-border rounded-full px-2.5 py-0.5 shrink-0">
              <Text
                className="font-medium text-muted-foreground"
                style={{ fontSize: 11, lineHeight: 15 }}
              >
                {medicine.category}
              </Text>
            </View>
            <Text
              className="text-muted-foreground"
              style={{ fontSize: 12, lineHeight: 16 }}
            >
              For:{" "}
              <Text
                className="font-semibold text-foreground"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                {medicine.forMember}
              </Text>
            </Text>
          </View>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                "Remove Medicine",
                `Remove ${medicine.name} from your cabinet?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => onDelete(medicine.id),
                  },
                ]
              );
            }}
            hitSlop={8}
            className="w-8 h-8 rounded-full border border-border items-center justify-center active:opacity-60 shrink-0"
          >
            <Icon name={Trash2} size={14} color="#ff6c35" />
          </Pressable>
        </View>

        {/* Notes chip */}
        {medicine.notes ? (
          <View className="mt-3 border border-border rounded-xl px-3 py-2.5 flex-row items-center gap-2">
            <Icon name={AlertCircle} size={13} color="#b0b9cc" />
            <Text className="text-xs text-muted-foreground leading-relaxed flex-1">
              {medicine.notes}
            </Text>
          </View>
        ) : null}
      </Card>
    </Animated.View>
  );
}

// ── Summary tile ──────────────────────────────────────────────────────────────
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

// ── Add Medicine Modal ───────────────────────────────────────────────────────
function AddMedicineModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (med: Omit<Medicine, "id">) => void;
}) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [generic, setGeneric] = useState("");
  const [category, setCategory] = useState("Antibiotic");
  const [dose, setDose] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [forMember, setForMember] = useState("Self");
  const [notes, setNotes] = useState("");

  const categories = [
    "Antibiotic",
    "Analgesic",
    "Antacid",
    "Antihistamine",
    "Vitamin",
    "General",
  ];
  const members = ["Self", "Family", "Mother", "Father"];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter a medicine name.");
      return;
    }
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    onAdd({
      name: name.trim(),
      generic: generic.trim() || name.trim(),
      category,
      dose: dose.trim() || "1 tablet daily",
      quantity: quantity.trim() || "10 tablets",
      manufactureDate: manufactureDate.trim() || "Jan 2025",
      expiryDate: expiryDate.trim() || "Dec 2027",
      manufacturer: manufacturer.trim() || "Generic",
      forMember,
      status: "active",
      icon: Pill,
      notes: notes.trim() || undefined,
    });

    setName("");
    setGeneric("");
    setDose("");
    setQuantity("");
    setExpiryDate("");
    setManufactureDate("");
    setManufacturer("");
    setNotes("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center bg-black/60 px-5"
      >
        <Pressable
          className="absolute inset-0"
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />

        <Animated.View
          entering={FadeIn.duration(200)}
          className="w-full bg-card border border-border rounded-3xl p-5 shadow-none"
          style={{ maxHeight: "85%" }}
        >
          {/* Simple header */}
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
                <Icon name={Pill} size={18} color="#2b65ff" />
              </View>
              <Text className="text-base font-bold text-foreground">Add Medicine</Text>
            </View>

            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                onClose();
              }}
              hitSlop={8}
              className="w-7 h-7 rounded-full border border-border items-center justify-center active:opacity-60"
            >
              <Icon name={X} size={14} color="#0e142b" />
            </Pressable>
          </View>

          {/* Form fields */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerClassName="gap-3 pb-2"
          >
            {/* Medicine Name */}
            <View>
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                Medicine name *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Augmentin 625mg"
                placeholderTextColor="#94a3b8"
                className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
              />
            </View>

            {/* Generic Formula */}
            <View>
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                Generic / formula
              </Text>
              <TextInput
                value={generic}
                onChangeText={setGeneric}
                placeholder="e.g. Amoxicillin & Clavulanic Acid"
                placeholderTextColor="#94a3b8"
                className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
              />
            </View>

            {/* Category selection */}
            <View>
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2 py-0.5"
              >
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                      setCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-full border ${
                      category === cat
                        ? "bg-primary border-primary"
                        : "bg-background border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        category === cat ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Dose & Quantity in a row */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Dosage
                </Text>
                <TextInput
                  value={dose}
                  onChangeText={setDose}
                  placeholder="e.g. 1 tab, twice daily"
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Quantity
                </Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 14 tablets"
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>
            </View>

            {/* Expiry Date & Manufacturer in a row */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Expiry date
                </Text>
                <TextInput
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="e.g. Nov 2028"
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Manufacturer
                </Text>
                <TextInput
                  value={manufacturer}
                  onChangeText={setManufacturer}
                  placeholder="e.g. GSK"
                  placeholderTextColor="#94a3b8"
                  className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
                />
              </View>
            </View>

            {/* Member assignment */}
            <View>
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                For member
              </Text>
              <View className="flex-row gap-2 flex-wrap">
                {members.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => {
                      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                      setForMember(m);
                    }}
                    className={`px-3 py-1.5 rounded-full border ${
                      forMember === m
                        ? "bg-primary border-primary"
                        : "bg-background border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        forMember === m ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {m}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View>
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                Notes (Optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Take after meals"
                placeholderTextColor="#94a3b8"
                className="bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground"
              />
            </View>

            {/* Action buttons */}
            <View className="flex-row gap-3 pt-3">
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }}
                className="flex-1 py-3 rounded-full border border-border items-center justify-center active:opacity-60"
              >
                <Text className="text-sm font-semibold text-foreground">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                className="flex-1 py-3 rounded-full bg-primary items-center justify-center active:opacity-80"
              >
                <Text className="text-sm font-bold text-primary-foreground">Save Medicine</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function MedicineCabinetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const triggerHaptic = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
  };

  const handleDelete = (id: string) =>
    setMedicines((prev) => prev.filter((m) => m.id !== id));

  const handleAddMedicine = (newMed: Omit<Medicine, "id">) => {
    const created: Medicine = {
      ...newMed,
      id: Date.now().toString(),
    };
    setMedicines((prev) => [created, ...prev]);
  };

  const activeCount   = medicines.filter((m) => m.status === "active").length;
  const expiringCount = medicines.filter((m) => m.status === "expiring").length;
  const expiredCount  = medicines.filter((m) => m.status === "expired").length;

  return (
    <View className="flex-1 bg-background">

      {/* ── Header — identical to home / scan-result ── */}
      <View
        className="bg-background pb-3"
        style={{ paddingTop: Math.max(insets.top, 20) + 8, zIndex: 60 }}
      >
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => { triggerHaptic(); router.back(); }}
              hitSlop={8}
              className="w-9 h-9 rounded-full bg-background items-center justify-center border border-border active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name={ArrowLeft} size={18} color="#0e142b" />
            </Pressable>
            <AppLogo width={96} height={32} />
          </View>

          <Pressable
            onPress={() => {
              triggerHaptic();
              setIsAddModalOpen(true);
            }}
            className="flex-row items-center gap-1.5 bg-primary px-4 py-2 rounded-full active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Add medicine"
          >
            <Icon name={Plus} size={14} color="#ffffff" />
            <Text className="text-xs font-bold text-primary-foreground">Add</Text>
          </Pressable>
        </View>
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
            <Icon name={Pill} size={22} color="#2b65ff" />
          </View>
          <View>
            <Text className="text-base font-bold text-foreground">Medicine Cabinet</Text>
            <Text className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {medicines.length} medicine{medicines.length !== 1 ? "s" : ""} stored
            </Text>
          </View>
        </Animated.View>

        {/* Summary strip */}
        <Animated.View entering={FadeIn.duration(240).delay(50)} className="flex-row gap-2.5">
          <SummaryTile count={activeCount}   label="Active" />
          <SummaryTile count={expiringCount} label="Expiring" />
          <SummaryTile count={expiredCount}  label="Expired"  />
        </Animated.View>

        {/* Section label */}
        <Text className="text-xs font-semibold text-muted-foreground px-1">
          All medicines
        </Text>

        {/* Cards */}
        {medicines.length === 0 ? (
          <Animated.View
            entering={FadeIn.duration(260)}
            className="items-center py-16 gap-3"
          >
            <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
              <Icon name={Pill} size={26} color="#2b65ff" />
            </View>
            <Text className="text-sm font-bold text-foreground">Cabinet is empty</Text>
            <Text className="text-xs text-muted-foreground text-center leading-relaxed max-w-[200px]">
              Tap Add to save your first medicine
            </Text>
          </Animated.View>
        ) : (
          <View className="gap-3">
            {medicines.map((med, i) => (
              <MedicineCard key={med.id} medicine={med} index={i} onDelete={handleDelete} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Add Medicine Modal ── */}
      <AddMedicineModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedicine}
      />
    </View>
  );
}
