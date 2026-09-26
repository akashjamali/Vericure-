import React, { createContext, useContext, useState } from 'react';

export interface Patient {
  id: string;
  name: string;
  relation: string; // 'Father' | 'Mother' | 'Self' | 'Child' | 'Spouse' | 'Grandparent'
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  role: 'admin' | 'member';
  avatarColor: string;
  chronicConditions: string[]; // e.g. ['Hypertension', 'Type 2 Diabetes']
  allergies: string[]; // e.g. ['Penicillin', 'Sulfa Drugs']
}

export interface Medicine {
  id: string;
  name: string;
  generic: string;
  dosage: string;
  category: 'Painkiller' | 'Antibiotic' | 'Chronic Care' | 'Syrup' | 'First-Aid' | 'Vitamins';
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  totalQuantity: number;
  remainingQuantity: number;
  unit: 'tablets' | 'capsules' | 'ml' | 'sachets';
  lowStockThreshold: number;
  assignedPatientId?: string;
  location: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Ointment' | 'Drops';
}

export interface MedicationSchedule {
  id: string;
  patientId: string;
  medicineId: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeLabel: string;
  instructions: string; // e.g. '1 tablet after breakfast'
  takenToday: boolean;
  lastTakenTime?: string;
}

interface InventoryContextType {
  householdName: string;
  setHouseholdName: (name: string) => void;
  patients: Patient[];
  medicines: Medicine[];
  schedules: MedicationSchedule[];
  addPatient: (patient: Omit<Patient, 'id'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Medicine;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  assignMedicine: (medicineId: string, patientId: string) => void;
  markDoseTaken: (scheduleId: string) => void;
  markDoseSkipped: (scheduleId: string) => void;
  updateStock: (medicineId: string, change: number) => void;
  getPatientById: (id: string) => Patient | undefined;
  getMedicinesForPatient: (patientId: string) => Medicine[];
  getSchedulesForPatient: (patientId: string) => MedicationSchedule[];
}

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Baba (Dad)',
    relation: 'Father',
    age: 62,
    gender: 'Male',
    role: 'member',
    avatarColor: '#8b5cf6',
    chronicConditions: ['Hypertension', 'High Cholesterol'],
    allergies: ['Penicillin'],
  },
  {
    id: 'p2',
    name: 'Ammi (Mom)',
    relation: 'Mother',
    age: 58,
    gender: 'Female',
    role: 'member',
    avatarColor: '#ec4899',
    chronicConditions: ['Type 2 Diabetes', 'Gastritis'],
    allergies: ['Sulfa Drugs'],
  },
  {
    id: 'p3',
    name: 'Akash (You)',
    relation: 'Self',
    age: 27,
    gender: 'Male',
    role: 'admin',
    avatarColor: '#10b981',
    chronicConditions: ['Seasonal Allergies'],
    allergies: [],
  },
  {
    id: 'p4',
    name: 'Baby Ali',
    relation: 'Child',
    age: 4,
    gender: 'Male',
    role: 'member',
    avatarColor: '#f59e0b',
    chronicConditions: ['Pediatric Asthma'],
    allergies: ['Ibuprofen (NSAIDs)'],
  },
];

const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'm1',
    name: 'Lipitor 20mg',
    generic: 'Atorvastatin',
    dosage: '20mg',
    category: 'Chronic Care',
    batchNumber: 'LPT-9842',
    expiryDate: '2027-04-15',
    totalQuantity: 30,
    remainingQuantity: 18,
    unit: 'tablets',
    lowStockThreshold: 5,
    assignedPatientId: 'p1',
    location: 'Main Cabinet',
    form: 'Tablet',
  },
  {
    id: 'm2',
    name: 'Glucophage 500mg',
    generic: 'Metformin HCl',
    dosage: '500mg',
    category: 'Chronic Care',
    batchNumber: 'GLU-2184',
    expiryDate: '2026-11-20',
    totalQuantity: 60,
    remainingQuantity: 8, // Low stock!
    unit: 'tablets',
    lowStockThreshold: 10,
    assignedPatientId: 'p2',
    location: 'Kitchen Drawer',
    form: 'Tablet',
  },
  {
    id: 'm3',
    name: 'Nexum 40mg',
    generic: 'Esomeprazole',
    dosage: '40mg',
    category: 'Chronic Care',
    batchNumber: 'NXM-4491',
    expiryDate: '2026-10-05', // Expiring soon!
    totalQuantity: 28,
    remainingQuantity: 14,
    unit: 'capsules',
    lowStockThreshold: 7,
    assignedPatientId: 'p2',
    location: 'Kitchen Drawer',
    form: 'Capsule',
  },
  {
    id: 'm4',
    name: 'Brufen 400mg',
    generic: 'Ibuprofen',
    dosage: '400mg',
    category: 'Painkiller',
    batchNumber: 'BRF-8812',
    expiryDate: '2027-08-30',
    totalQuantity: 20,
    remainingQuantity: 16,
    unit: 'tablets',
    lowStockThreshold: 5,
    assignedPatientId: 'p3',
    location: 'Main Cabinet',
    form: 'Tablet',
  },
  {
    id: 'm5',
    name: 'Panadol Extra',
    generic: 'Paracetamol & Caffeine',
    dosage: '500mg/65mg',
    category: 'Painkiller',
    batchNumber: 'PND-1049',
    expiryDate: '2026-12-10',
    totalQuantity: 40,
    remainingQuantity: 32,
    unit: 'tablets',
    lowStockThreshold: 8,
    assignedPatientId: 'p3',
    location: 'First-Aid Kit',
    form: 'Tablet',
  },
  {
    id: 'm6',
    name: 'Ventolin Pediatric Syrup',
    generic: 'Salbutamol',
    dosage: '2mg/5ml',
    category: 'Syrup',
    batchNumber: 'VNT-3029',
    expiryDate: '2027-01-18',
    totalQuantity: 120,
    remainingQuantity: 95,
    unit: 'ml',
    lowStockThreshold: 30,
    assignedPatientId: 'p4',
    location: 'Fridge Door',
    form: 'Syrup',
  },
  {
    id: 'm7',
    name: 'Augmentin 625mg',
    generic: 'Amoxicillin + Clavulanate',
    dosage: '625mg',
    category: 'Antibiotic',
    batchNumber: 'AUG-7721',
    expiryDate: '2026-09-28', // Expiring very soon!
    totalQuantity: 14,
    remainingQuantity: 4,
    unit: 'tablets',
    lowStockThreshold: 6,
    assignedPatientId: undefined, // Unassigned emergency stock
    location: 'Main Cabinet',
    form: 'Tablet',
  },
];

const INITIAL_SCHEDULES: MedicationSchedule[] = [
  {
    id: 's1',
    patientId: 'p1',
    medicineId: 'm1',
    timeOfDay: 'Morning',
    timeLabel: '08:00 AM',
    instructions: '1 tablet after breakfast',
    takenToday: true,
    lastTakenTime: '08:15 AM',
  },
  {
    id: 's2',
    patientId: 'p2',
    medicineId: 'm2',
    timeOfDay: 'Morning',
    timeLabel: '08:30 AM',
    instructions: '1 tablet with meal',
    takenToday: true,
    lastTakenTime: '08:45 AM',
  },
  {
    id: 's3',
    patientId: 'p2',
    medicineId: 'm3',
    timeOfDay: 'Evening',
    timeLabel: '07:30 PM',
    instructions: '1 capsule before dinner',
    takenToday: false,
  },
  {
    id: 's4',
    patientId: 'p4',
    medicineId: 'm6',
    timeOfDay: 'Night',
    timeLabel: '09:00 PM',
    instructions: '5ml syrup before sleep',
    takenToday: false,
  },
];

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [householdName, setHouseholdName] = useState('Bhutto Family Household');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(INITIAL_SCHEDULES);

  const addPatient = (newPatientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...newPatientData,
      id: `p_${Date.now()}`,
    };
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    // Clear assignments
    setMedicines((prev) =>
      prev.map((m) => (m.assignedPatientId === id ? { ...m, assignedPatientId: undefined } : m))
    );
    setSchedules((prev) => prev.filter((s) => s.patientId !== id));
  };

  const addMedicine = (newMedData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...newMedData,
      id: `m_${Date.now()}`,
    };
    setMedicines((prev) => [newMed, ...prev]);
    return newMed;
  };

  const updateMedicine = (updated: Medicine) => {
    setMedicines((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setSchedules((prev) => prev.filter((s) => s.medicineId !== id));
  };

  const assignMedicine = (medicineId: string, patientId: string) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, assignedPatientId: patientId } : m))
    );
  };

  const markDoseTaken = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          // Decrement stock for the medicine
          updateStock(s.medicineId, -1);
          return {
            ...s,
            takenToday: true,
            lastTakenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return s;
      })
    );
  };

  const markDoseSkipped = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, takenToday: false } : s))
    );
  };

  const updateStock = (medicineId: string, change: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === medicineId) {
          const newQty = Math.max(0, m.remainingQuantity + change);
          return { ...m, remainingQuantity: newQty };
        }
        return m;
      })
    );
  };

  const getPatientById = (id: string) => patients.find((p) => p.id === id);

  const getMedicinesForPatient = (patientId: string) =>
    medicines.filter((m) => m.assignedPatientId === patientId);

  const getSchedulesForPatient = (patientId: string) =>
    schedules.filter((s) => s.patientId === patientId);

  return (
    <InventoryContext.Provider
      value={{
        householdName,
        setHouseholdName,
        patients,
        medicines,
        schedules,
        addPatient,
        updatePatient,
        deletePatient,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        assignMedicine,
        markDoseTaken,
        markDoseSkipped,
        updateStock,
        getPatientById,
        getMedicinesForPatient,
        getSchedulesForPatient,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
