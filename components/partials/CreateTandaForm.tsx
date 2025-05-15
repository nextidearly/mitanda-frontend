import { useCallback, useState } from 'react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { useForm } from 'react-hook-form';
import TandaManagerABI from '@/config/abis/TandaManagerABI.json';

type FormValues = {
  contributionAmount: number;
  payoutInterval: number;
  participantCount: number;
  gracePeriod: number;
};

export default function CreateTandaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      contributionAmount: 10,
      payoutInterval: 1,
      participantCount: 2,
      gracePeriod: 1,
    },
  });

  const [validatedValues, setValidatedValues] = useState<FormValues | null>(null);

  const onValid = (data: FormValues) => {
    setValidatedValues(data);
  };

  const calls = useCallback(() => {
    if (!validatedValues) return [];
    return [
      {
        abi: TandaManagerABI,
        address: process.env.NEXT_PUBLIC_TANDA_MANAGER!,
        functionName: 'createTanda',
        args: [
          BigInt((validatedValues.contributionAmount * 1e6).toFixed(0)),
          BigInt((validatedValues.payoutInterval * 86400).toFixed(0)),
          validatedValues.participantCount,
          BigInt((validatedValues.gracePeriod * 86400).toFixed(0)),
        ],
      },
    ];
  }, [validatedValues]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Create New Tanda</h3>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {/* Contribution Amount Field */}
        <div>
          <div className="flex items-center gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Contribution Amount (USDC)
            </label>
            <div className="group relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="absolute hidden group-hover:flex -left-32 -top-2 -translate-y-full w-64 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                Amount each participant contributes per interval (10-∞ USDC)
              </span>
            </div>
          </div>
          <input
            type="number"
            step="0.01"
            {...register('contributionAmount', {
              required: 'Contribution amount is required',
              min: { value: 10, message: 'Minimum contribution is 10 USDC' },
            })}
            className="mt-1 block w-full rounded-md p-2 border border-gray-100"
          />
          {errors.contributionAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contributionAmount.message}
            </p>
          )}
        </div>

        {/* Payout Interval + Participant Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payout Interval (days)
            </label>
            <input
              type="number"
              {...register('payoutInterval', {
                required: 'Payout interval is required',
                min: { value: 1, message: 'Minimum interval is 1 day' },
                max: { value: 30, message: 'Maximum interval is 30 days' },
              })}
              className="mt-1 block w-full rounded-md p-2 border border-gray-100"
            />
            {errors.payoutInterval && (
              <p className="text-red-500 text-sm mt-1">
                {errors.payoutInterval.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Participants Count
            </label>
            <input
              type="number"
              {...register('participantCount', {
                required: 'Participant count is required',
                min: { value: 2, message: 'Minimum 2 participants' },
                max: { value: 50, message: 'Maximum 50 participants' },
              })}
              className="mt-1 block w-full rounded-md p-2 border border-gray-100"
            />
            {errors.participantCount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.participantCount.message}
              </p>
            )}
          </div>
        </div>

        {/* Grace Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Grace Period (days)
          </label>
          <input
            type="number"
            {...register('gracePeriod', {
              required: 'Grace period is required',
              min: { value: 1, message: 'Minimum grace period is 1 day' },
              max: { value: 7, message: 'Maximum grace period is 7 days' },
            })}
            className="mt-1 block w-full rounded-md p-2 border border-gray-100"
          />
          {errors.gracePeriod && (
            <p className="text-red-500 text-sm mt-1">
              {errors.gracePeriod.message}
            </p>
          )}
        </div>

        {/* Coinbase Transaction UI (only appears if values are validated) */}
        {validatedValues ? (
          <Transaction calls={calls as any} chainId={8453} className='w-fit'>
            <TransactionButton
              text="Submit"
              className="bg-blue-600 rounded-md hover:bg-blue-700 duration-100 py-2 px-4 font-normal"
            />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        ) : <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Prepare and Build Transaction
        </button>}

      </form>
    </div>
  );
}
