import { formatUSDC, bigIntToString } from '@/utils';

export default function TandaStats({
    contributionAmount,
    currentCycle,
    participantsCount,
    totalFunds,
}: {
    contributionAmount?: bigint;
    currentCycle?: bigint;
    participantsCount?: bigint;
    totalFunds?: bigint;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Contribution Amount</h3>
                <p className="text-2xl font-semibold text-gray-800">
                    {formatUSDC(contributionAmount)} USDC
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Current Cycle</h3>
                <p className="text-2xl font-semibold text-gray-800">
                    {bigIntToString(currentCycle)} of {bigIntToString(participantsCount)}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Funds</h3>
                <p className="text-2xl font-semibold text-gray-800">
                    {formatUSDC(totalFunds)} USDC
                </p>
            </div>
        </div>
    );
}