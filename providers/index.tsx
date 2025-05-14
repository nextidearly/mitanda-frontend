'use client';

import type { ReactNode } from 'react';
import { AppOnchainKitProvider } from './OnChainKitProvider';
import { WalletProvider } from './WalletProvider';

export function Providers(props: { children: ReactNode }) {
    return (
        <AppOnchainKitProvider
        >
            <WalletProvider>
                {props.children}
            </WalletProvider>
        </AppOnchainKitProvider>
    );
}