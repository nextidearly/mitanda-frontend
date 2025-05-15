import { CountdownResult } from '@/types';
import { formatUnits } from 'viem';

export const bigIntToNumber = (value?: bigint): number => {
    return value ? Number(value.toString()) : 0;
};

export const bigIntToString = (value?: bigint): string => {
    return value ? value.toString() : '0';
};

export const formatUSDC = (amount?: bigint) => {
    return amount ? formatUnits(amount, 6) : '0';
};

export const formatDate = (timestamp?: bigint) => {
    return timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : '--';
};

export const secondsToDays = (seconds?: bigint) => {
    return seconds ? Number(seconds) / (60 * 60 * 24) : 0;
};

export function getCountdown(timestamp: bigint): CountdownResult {
    const now = Math.floor(Date.now() / 1000);
    const future = Number(timestamp);
    const diff = future - now;

    if (diff <= 0) {
        return {
            timeString: "Now",
            status: diff < -86400 ? 'past-due' : 'due' // past-due if more than 1 day late
        };
    }

    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    const seconds = Math.floor(diff % 60);

    return {
        timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        status: 'pending'
    };
}