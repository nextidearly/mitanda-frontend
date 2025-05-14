import Link from 'next/link';
import { Participant, TandaSummary } from '@/types';
import { bigIntToNumber, bigIntToString, formatDate } from '@/utils';

export default function ParticipantsTable({
    participants,
    userAddress,
    payoutOrder,
    tandaSummary,
}: {
    participants: Participant[];
    userAddress?: string;
    payoutOrder?: bigint[];
    tandaSummary?: TandaSummary;
}) {
    const getParticipantStatus = (participant: Participant) => {
        if (!participant.isActive) return 'Removed';
        if (participant.hasPaid && participant.paidUntilCycle > (tandaSummary?.currentCycle || BigInt(0))) {
            return 'In Good Standing';
        }
        if (participant.hasPaid) return 'Paid';
        return 'Pending Payment';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Participants ({bigIntToString(tandaSummary?.participantsCount)})</h2>
                {payoutOrder && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                        Payout Order Assigned
                    </span>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Until</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {participants.map((participant, index) => (
                            <tr key={index} className={participant.addr === userAddress ? 'bg-blue-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            <Link
                                                href={`${process.env.NEXT_PUBLIC_EXPLORER}/address/${participant.addr}`}
                                                target='_blank'
                                            >
                                                {participant.addr.slice(0, 6)}...{participant.addr.slice(-4)}
                                            </Link>
                                        </div>
                                        {participant.addr === userAddress && (
                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                You
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getParticipantStatus(participant) === 'In Good Standing' ? 'bg-green-100 text-green-800' :
                                        getParticipantStatus(participant) === 'Paid' ? 'bg-blue-100 text-blue-800' :
                                            getParticipantStatus(participant) === 'Removed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {getParticipantStatus(participant)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Cycle {bigIntToString(participant.paidUntilCycle)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {payoutOrder ? `#${bigIntToNumber(participant.payoutOrder) + 1}` : '--'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(participant.joinTimestamp)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}