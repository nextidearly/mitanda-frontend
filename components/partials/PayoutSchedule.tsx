import Link from 'next/link';
import { formatUSDC, bigIntToNumber, formatDate } from '@/utils';
import { Participant, TandaSummary } from '@/types';

export default function PayoutSchedule({
    payoutOrder,
    tandaSummary,
    participants,
    contributionAmount,
}: {
    payoutOrder?: bigint[];
    tandaSummary?: TandaSummary;
    participants?: Participant[];
    contributionAmount?: bigint;
}) {
    if (!payoutOrder || tandaSummary?.state !== 1) return null;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payout Schedule</h2>
            <div className="space-y-2">
                {payoutOrder.map((participantIndex, cycleIndex) => (
                    <div
                        key={cycleIndex}
                        className={`p-4 rounded-lg border ${cycleIndex + 1 < bigIntToNumber(tandaSummary.currentCycle) ? 'bg-gray-50 border-gray-200' :
                            cycleIndex + 1 === bigIntToNumber(tandaSummary.currentCycle) ? 'bg-blue-50 border-blue-200' :
                                'bg-white border-gray-200'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-800">
                                    Cycle {cycleIndex + 1}{' '}
                                    {cycleIndex + 1 < bigIntToNumber(tandaSummary.currentCycle) && (
                                        <span className="text-green-600 text-sm">(Completed)</span>
                                    )}
                                    {cycleIndex + 1 === bigIntToNumber(tandaSummary.currentCycle) && (
                                        <span className="text-blue-600 text-sm">(Current)</span>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Payout: {contributionAmount && participants ?
                                        formatUSDC(contributionAmount * BigInt(participants.length)) :
                                        '--'} USDC
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-800">
                                    <Link
                                        href={participants ? ` ${process.env.NEXT_PUBLIC_EXPLORER}/address/${participants[bigIntToNumber(participantIndex)]?.addr}` : '#'}
                                        target='_blank'
                                    >
                                        {participants ? `${participants[bigIntToNumber(participantIndex)]?.addr.slice(0, 6)}...${participants[bigIntToNumber(participantIndex)]?.addr.slice(-4)}` : '-'}
                                    </Link>
                                </p>
                                <p className="text-sm text-gray-500">
                                    {tandaSummary.nextPayoutTimestamp && (cycleIndex + 1) === bigIntToNumber(tandaSummary.currentCycle) ?
                                        `Due: ${formatDate(tandaSummary.nextPayoutTimestamp)}` :
                                        (cycleIndex + 1) < bigIntToNumber(tandaSummary.currentCycle) ? 'Paid out' : 'Upcoming'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}