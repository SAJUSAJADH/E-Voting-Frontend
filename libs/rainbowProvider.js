'use client'

import React from 'react'
import {
  RainbowKitProvider,
  lightTheme,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
)

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
})

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
}

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const Providers = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: '#81fbe9',
          accentColorForeground: '#000000',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'none',
          connectButtonBackground: '#FFEFFD',
        })}
        chains={chains}
        appInfo={demoAppInfo}
        modalSize='wide'
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default Providers
