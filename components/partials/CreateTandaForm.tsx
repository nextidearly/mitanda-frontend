import { useCallback } from 'react';
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction';
import { useForm } from 'react-hook-form';
import TandaManagerABI from '@/config/abis/TandaManagerABI.json';

type FormValues = {
  contributionAmount: number;
  payoutInterval: number;
  participantCount: number;
  gracePeriod: number;
};

export default function CreateTandaForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: {
      contributionAmount: 10,
      payoutInterval: 1,
      participantCount: 2,
      gracePeriod: 1,
    },
  });

  const formValues = watch();

  const calls = useCallback(() => {
    return [
      {
        abi: TandaManagerABI,
        address: process.env.NEXT_PUBLIC_TANDA_MANAGER!,
        functionName: 'createTanda',
        args: [
          BigInt((formValues.contributionAmount * 1e6).toFixed(0)),
          BigInt((formValues.payoutInterval * 86400).toFixed(0)),
          formValues.participantCount,
          BigInt((formValues.gracePeriod * 86400).toFixed(0)),
        ],
      },
    ];
  }, [formValues]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Create New Tanda</h3>
      <form onSubmit={handleSubmit(() => { })} className="space-y-4">
        <div>
          <div className="flex items-center gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Contribution Amount (USDC)
            </label>
            <div className="group relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              min: {
                value: 10,
                message: 'Minimum contribution is 10 USDC',
              },
            })}
            className="mt-1 block w-full rounded-md focus-visible:border-blue-500 focus-visible:ring-blue-500 p-2 border border-gray-100"
          />
          {errors.contributionAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.contributionAmount.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Payout Interval (days)
              </label>
              <div className="group relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute hidden group-hover:flex -left-32 -top-2 -translate-y-full w-64 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  Time between each contribution/payout (1-30 days)
                </span>
              </div>
            </div>
            <input
              type="number"
              {...register('payoutInterval', {
                required: 'Payout interval is required',
                min: {
                  value: 0,
                  message: 'Minimum interval is 1 day',
                },
                max: {
                  value: 30,
                  message: 'Maximum interval is 30 days',
                },
              })}
              className="mt-1 block w-full rounded-md focus-visible:border-blue-500 focus-visible:ring-blue-500 p-2 border border-gray-100"
            />
            {errors.payoutInterval && (
              <p className="text-red-500 text-sm mt-1">{errors.payoutInterval.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Participants Count
              </label>
              <div className="group relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute hidden group-hover:flex -left-32 -top-2 -translate-y-full w-64 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  Total number of participants in the tanda (2-50)
                </span>
              </div>
            </div>
            <input
              type="number"
              {...register('participantCount', {
                required: 'Participant count is required',
                min: {
                  value: 2,
                  message: 'Minimum 2 participants',
                },
                max: {
                  value: 50,
                  message: 'Maximum 50 participants',
                },
              })}
              className="mt-1 block w-full rounded-md focus-visible:border-blue-500 focus-visible:ring-blue-500 p-2 border border-gray-100"
            />
            {errors.participantCount && (
              <p className="text-red-500 text-sm mt-1">{errors.participantCount.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Grace Period (days)
            </label>
            <div className="group relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute hidden group-hover:flex -left-32 -top-2 -translate-y-full w-64 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                Extra time to make payment before penalty (1-7 days)
              </span>
            </div>
          </div>
          <input
            type="number"
            {...register('gracePeriod', {
              required: 'Grace period is required',
              min: {
                value: 1,
                message: 'Minimum grace period is 1 day',
              },
              max: {
                value: 7,
                message: 'Maximum grace period is 7 days',
              },
            })}
            className="mt-1 block w-full rounded-md focus-visible:border-blue-500 focus-visible:ring-blue-500 p-2 border border-gray-100"
          />
          {errors.gracePeriod && (
            <p className="text-red-500 text-sm mt-1">{errors.gracePeriod.message}</p>
          )}
        </div>

        <Transaction calls={calls as any} chainId={84532} >
          <TransactionButton text="Create Tanda" className='bg-blue-700 rounded-md hover:bg-blue-600 duration-100' />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      </form>
    </div>
  );
}