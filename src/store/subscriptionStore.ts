import { create } from "zustand";
import { BillingCycle } from "@/types/subscription";

interface SubscriptionState {
  // UI state
  selectedCycle: BillingCycle;
  activeTab: string;
  
  // Actions
  setSelectedCycle: (cycle: BillingCycle) => void;
  setActiveTab: (tab: string) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  // Initial state
  selectedCycle: BillingCycle.MONTHLY,
  activeTab: "overview",
  
  // Actions
  setSelectedCycle: (cycle) => set({ selectedCycle: cycle }),
  setActiveTab: (tab) => set({ activeTab: tab }),
})); 