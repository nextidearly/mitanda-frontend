import Link from 'next/link';
import { secondsToDays, formatDate } from '@/utils';
import { CycleInfo } from '@/types';

export default function CycleInfoSection({
    nextPayoutTimestamp,
    cycleInfo,
    payoutInterval,
    gracePeriod,
}: {
    nextPayoutTimestamp?: bigint;
    cycleInfo?: CycleInfo;
    payoutInterval?: bigint;
    gracePeriod?: bigint;
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cycle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Next Payout</h3>
                    <p className="text-lg font-medium text-gray-800">
                        {formatDate(nextPayoutTimestamp)}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Payout Recipient</h3>
                    <p className="text-lg font-medium text-gray-800">
                        {cycleInfo?.payoutAddress ?
                            <Link
                                href={`${process.env.NEXT_PUBLIC_EXPLORER}/address/${cycleInfo.payoutAddress}`}
                                target='_blank'
                            >
                                {cycleInfo.payoutAddress.slice(0, 6)}...{cycleInfo.payoutAddress.slice(-4)}
                            </Link> :
                            'Not assigned yet'}
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Payout Interval</h3>
                    <p className="text-lg font-medium text-gray-800">
                        {secondsToDays(payoutInterval)} days
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Grace Period</h3>
                    <p className="text-lg font-medium text-gray-800">
                        {secondsToDays(gracePeriod)} days
                    </p>
                </div>
            </div>
        </div>
    );
}