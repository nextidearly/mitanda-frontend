export enum TandaState {
    OPEN = 0,
    ACTIVE = 1,
    COMPLETED = 2
}

export interface GeneralInfo {
    tandaId: bigint;
    contributionAmount: bigint;
    payoutInterval: bigint;
    participantCount: bigint;
    gracePeriod: bigint;
    creator: string;
    usdcTokenAddress: string;
    managerAddress: string;
    tandaAddress: string;
}

export interface CurrentStatus {
    state: TandaState;
    currentCycle: bigint;
    totalParticipants: bigint;
    totalFunds: bigint;
    nextPayoutTimestamp: bigint;
    startTimestamp: bigint;
    payoutOrderAssigned: boolean;
    isActive: boolean;
    isOpen: boolean;
    isCompleted: boolean;
}

export interface TandaData {
    generalInfo: GeneralInfo;
    currentStatus: CurrentStatus;
    payoutOrderInfo: bigint[];
}

export type TailwindColorClass = `bg-${string}-100 text-${string}-800`;

export type StateConfig = {
  [key in TandaState]: {
    color: TailwindColorClass;
    label: 'Open' | 'Active' | 'Completed';
  };
};

export interface Participant {
  addr: string;
  hasPaid: boolean;
  paidUntilCycle: bigint;
  isActive: boolean;
  payoutOrder: bigint;
  joinTimestamp: bigint;
}

export interface TandaSummary {
  state: number;
  currentCycle: bigint;
  participantsCount: bigint;
  totalFunds: bigint;
  nextPayoutTimestamp: bigint;
}

export interface CycleInfo {
  cycleNumber: bigint;
  payoutAddress: string;
  payoutAmount: bigint;
}

export interface TandaEvent {
  type: string;
  participant?: string;
  amount?: bigint;
  cycle?: bigint;
  timestamp: number;
  txHash?: string;
}

export interface PayoutTimeStatus {
  canTrigger: boolean;
  currentTimeStemp: bigint;
  startTimestamp: bigint;
  targetTime: bigint;
}

export interface CountdownResult {
  timeString: string;
  status: 'pending' | 'due' | 'past-due';
}