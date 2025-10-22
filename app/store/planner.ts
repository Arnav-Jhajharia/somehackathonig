import { create } from 'zustand';

type Bundle = { title: string; summary: string; projectedReward: number; apyImpact: number };

type PlannerState = {
  destination: string;
  startDate: string;
  endDate: string;
  bundles: Bundle[];
  setField: (key: 'destination' | 'startDate' | 'endDate', value: string) => void;
  setBundles: (b: Bundle[]) => void;
};

export const usePlannerStore = create<PlannerState>((set) => ({
  destination: '',
  startDate: '',
  endDate: '',
  bundles: [],
  setField: (key, value) => set({ [key]: value } as any),
  setBundles: (bundles) => set({ bundles }),
}));


