import Link from 'next/link';
import { useContractRead } from 'wagmi';
import TandaManagerABI from '@/config/abis/TandaManagerABI.json';
import { contract_address } from '@/config';
import { CurrentStatus, GeneralInfo, StateConfig, TandaState } from '@/types';

export default function TandaCard({ tandaId }: { tandaId: bigint }) {
  const { data: tandaData, isLoading, isError }: any = useContractRead({
    address: contract_address.tanda_manager,
    abi: TandaManagerABI,
    functionName: 'getTandaData',
    args: [tandaId],
    chainId: 8453
  });

  const [
    generalInfo = {
      contributionAmount: BigInt(0),
      payoutInterval: BigInt(0),
      participantCount: BigInt(0),
      gracePeriod: BigInt(0),
      creator: '',
      tandaAddress: ''
    } as GeneralInfo,
    currentStatus = {
      state: TandaState.OPEN,
      currentCycle: BigInt(0),
      totalFunds: BigInt(0),
      nextPayoutTimestamp: BigInt(0),
      isActive: false,
      isOpen: true,
      isCompleted: false,
      participantListLength: BigInt(0)
    } as CurrentStatus
  ] = tandaData || [];

  const formatUSDC = (value: bigint) => (Number(value) / 1e6).toFixed(0);
  const secondsToDays = (seconds: bigint) => (Number(seconds) / 86400).toFixed(0);
  const formatDate = (timestamp: bigint) => {
    if (timestamp === BigInt(0)) return 'Not started';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const stateConfig: StateConfig = {
    [TandaState.OPEN]: { color: 'bg-blue-100 text-blue-800', label: 'Open' },
    [TandaState.ACTIVE]: { color: 'bg-green-100 text-green-800', label: 'Active' },
    [TandaState.COMPLETED]: { color: 'bg-purple-100 text-purple-800', label: 'Completed' }
  };

  if (isLoading) return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-pulse border border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/6"></div>
      </div>
      <div className="mt-6 h-10 bg-gray-200 rounded-md"></div>
    </div>
  );

  if (isError) return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-red-100">
      <div className="text-red-500 font-medium mb-2">Error loading tanda</div>
      <p className="text-sm text-gray-600 mb-4">Failed to load details for Tanda #{tandaId.toString()}</p>
      <button className="w-full text-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Tanda #{Number(tandaId.toString()) + 1}
            <Link
              href={`${process.env.NEXT_PUBLIC_EXPLORER}/address/${generalInfo.tandaAddress}`}
              target='_blank'
              className='bg-gray-100 px-2 ml-1 text-sm rounded-full font-normal hover:underline hover:text-blue-700 cursor-pointer text-gray-500'
            >
              {generalInfo.tandaAddress.slice(0, 6)}...{generalInfo.tandaAddress.slice(-4)}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">
            Created by
            <Link
              href={`${process.env.NEXT_PUBLIC_EXPLORER}/address/${generalInfo.creator}`}
              target='_blank'
              className='bg-gray-100 px-2 ml-1 text-sm rounded-full font-normal hover:underline hover:text-blue-700 cursor-pointer text-gray-500'
            >
              {generalInfo.creator.slice(0, 6)}...{generalInfo.creator.slice(-4)}
            </Link>
          </p>
        </div>
        <span className={`${stateConfig[currentStatus.state as TandaState].color} text-xs font-medium px-3 py-1 rounded-full`}>
          {stateConfig[currentStatus.state as TandaState].label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Contribution:</span>
            <span className="font-medium">{formatUSDC(generalInfo.contributionAmount)} USDC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Interval:</span>
            <span className="font-medium">{secondsToDays(generalInfo.payoutInterval)} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Grace Period:</span>
            <span className="font-medium">{secondsToDays(generalInfo.gracePeriod)} days</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Cycle:</span>
            <span className="font-medium">{currentStatus.currentCycle.toString()}/{generalInfo.participantCount.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Next Payout:</span>
            <span className="font-medium">{formatDate(currentStatus.nextPayoutTimestamp)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Funds:</span>
            <span className="font-medium">{formatUSDC(currentStatus.totalFunds)} USDC</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-500">Participant:</span>
        <span className="font-medium">{currentStatus.participantListLength.toString()}/{generalInfo.participantCount.toString()}</span>
      </div>

      <div className="mt-auto">
        <Link
          href={`/tandas/${generalInfo.tandaAddress}`}
          className={`block w-full text-center ${currentStatus.state == 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : currentStatus.state == 1 ? 'bg-green-200 hover:bg-green-300 text-green-700' : 'bg-purple-200 hover:bg-purple-300 text-purple-700'}  font-medium py-2 px-4 rounded-md transition-colors duration-200`}
        >
          {currentStatus.isOpen ? 'Join Tanda' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}