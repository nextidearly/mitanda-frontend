'use client'

import { AppConnectWallet } from '@/components/ui/ConnectWallet';
import Link from 'next/link';

export default function Header() {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href={'/'} className="text-2xl font-bold text-blue-600">MiTanda</Link>
                <AppConnectWallet  />
            </div>
        </nav>
    );
}