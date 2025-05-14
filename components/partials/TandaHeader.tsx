import Link from 'next/link';
import CountdownTimer from '@/components/ui/CountDownTimer';
import { TandaSummary } from '@/types';
import { formatDate } from '@/utils';

export default function TandaHeader({
    address,
    tandaSummary,
    isParticipant,
    isInGoodStanding,
}: {
    address: string;
    tandaSummary: TandaSummary;
    isParticipant?: boolean;
    isInGoodStanding?: boolean;
}) {
    const getStateString = (state?: number) => {
        switch (state) {
            case 0: return 'Open for Participants';
            case 1: return 'Active';
            case 2: return 'Completed';
            default: return 'Unknown';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-3">
            <div className='flex justify-between'>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Tanda
                    <Link
                        href={`${process.env.NEXT_PUBLIC_Explorer}/address/${address}`}
                        target='_blank'
                        className='bg-gray-100 px-2 ml-1 text-sm rounded-full font-normal hover:underline hover:text-blue-700 cursor-pointer text-gray-500'
                    >
                        {address.slice(0, 4)}...{address.slice(-4)}
                    </Link>
                </h1>

                <p className="text-sm bg-gray-100 h-fit px-3 py-0.5 font-medium text-gray-800">
                    <CountdownTimer timestamp={tandaSummary.nextPayoutTimestamp} />
                    <span className="text-sm text-gray-500 ml-2">
                        ({formatDate(tandaSummary.nextPayoutTimestamp)})
                    </span>
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${tandaSummary.state === 0 ? 'bg-blue-100 text-blue-800' :
                    tandaSummary.state === 1 ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                    }`}>
                    {getStateString(tandaSummary.state)}
                </span>
                {isParticipant && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isInGoodStanding ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {isInGoodStanding ? 'In Good Standing' : 'Payment Needed'}
                    </span>
                )}
            </div>
        </div>
    );
}