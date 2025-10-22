export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  kycStatus: KycStatus;
}

export interface Card {
  last4: string;
  status: 'ACTIVE' | 'INACTIVE';
  vtsTokenState: 'FRESH' | 'EXPIRED';
}

export type MissionType = 'MCC' | 'MERCHANT_ID' | 'GEO';

export interface MissionRule {
  mcc?: string[];
  merchantIds?: string[];
  minAmount?: number;
  geo?: { lat: number; lng: number; radiusKm: number };
  window?: { startIso: string; endIso: string };
}

export interface MissionReward {
  currency: 'USDC';
  amountFixed?: number;
  amountPct?: number;
  cap?: number;
}

export interface Mission {
  id: string;
  title: string;
  summary: string;
  type: MissionType;
  rule: MissionRule;
  reward: MissionReward;
  city?: string;
  expiresAt?: string;
  partnerBadge?: string;
}

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REWARDED';

export interface ProgressSummary {
  missionId: string;
  status: ProgressStatus;
  percent: number;
}

export interface RewardEntry {
  id: string;
  missionId?: string;
  type: 'CREDIT' | 'DEBIT' | 'REVERSAL';
  amount: string;
  currency: 'USDC';
  createdAt: string;
  memo?: string;
  txRef?: string;
}

export interface Vault {
  balance: string;
  currency: 'USDC';
  apyPct: number;
  lastUpdated: string;
}
