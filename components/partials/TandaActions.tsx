import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction';
import { TandaSummary, CycleInfo } from '@/types';
import { formatUSDC, formatDate } from '@/utils';

export default function TandaActions({
  tandaSummary,
  cycleInfo,
  isParticipant,
  isCurrentRecipient,
  userAddress,
  contributionAmount,
  joinTandaCalls,
  makePaymentCalls,
  makePaymentCallsAllRemaining,
  triggerPayoutCalls,
  cyclesToPayRemaining,
}: {
  tandaSummary: TandaSummary;
  cycleInfo?: CycleInfo;
  isParticipant?: boolean;
  isCurrentRecipient?: boolean;
  userAddress?: string;
  contributionAmount?: bigint;
  joinTandaCalls: () => any;
  makePaymentCalls: (cyclesToPay: number) => any;
  makePaymentCallsAllRemaining: () => any;
  triggerPayoutCalls: () => any;
  cyclesToPayRemaining: () => number;
}) {
  const canTriggerPayout = tandaSummary?.state === 1;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Join Button */}
      {tandaSummary.state === 0 && !isParticipant && userAddress && (
        <Transaction calls={joinTandaCalls as any} chainId={84532} >
          <TransactionButton text="Join Tanda" className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm' />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}

      {/* Make Payment Button */}
      {tandaSummary.state === 1 && isParticipant && userAddress && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Transaction calls={() => makePaymentCalls(1) as any} chainId={84532}>
            <TransactionButton text={`Pay 1 Cycle (${formatUSDC(contributionAmount)} USDC)`} className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm' />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
          <Transaction calls={() => makePaymentCallsAllRemaining() as any} chainId={84532}>
            <TransactionButton text={`Pay All Remaining (${formatUSDC(contributionAmount as bigint * BigInt(cyclesToPayRemaining()))} USDC)`} className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm' />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </div>
      )}

      {/* Trigger Payout Button */}
      {tandaSummary.state === 1 && canTriggerPayout && isParticipant && userAddress && (
        <Transaction calls={triggerPayoutCalls as any} chainId={84532}>
          <TransactionButton
            text={isCurrentRecipient ? "Claim your payout at ${formatDate(tandaSummary.nextPayoutTimestamp)}" : `You can trigger payout for ${cycleInfo?.payoutAddress.slice(0, 6)}...${cycleInfo?.payoutAddress.slice(-4)} at ${formatDate(tandaSummary.nextPayoutTimestamp)}`}
            className={`${isCurrentRecipient ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-orange-600 hover:bg-orange-700'} text-white px-4 py-2 rounded-md text-sm`}
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}
    </div>
  );
}