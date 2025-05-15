'use client'

import { useContractRead } from 'wagmi';
import TandaCard from '@/components/ui/TandaCard';

import TandaManagerABI from '@/config/abis/TandaManagerABI.json'
import { contract_address } from '@/config';

export default function ActiveTandas() {
  const { data: tandaIds } = useContractRead({
    address: contract_address.tanda_manager,
    abi: TandaManagerABI,
    functionName: 'getActiveTandaIds',
    chainId: 8453
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(tandaIds as bigint[] || []).map((tandaId) => (
        <TandaCard key={tandaId.toString()} tandaId={tandaId} />
      ))}
    </div>
  );
}