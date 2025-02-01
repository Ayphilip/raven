import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import { PrivyProvider } from '@privy-io/react-auth'




createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PrivyProvider
      appId="cm6dgl8ba00sh10xcnswn30yq"
      config={{
        "appearance": {
          "accentColor": "#6A6FF5",
          "theme": "#222224",
          "showWalletLoginFirst": true,
          "logo": "https://raw.githubusercontent.com/Ayphilip/appPics/refs/heads/main/logo.png",
        },
        "walletChainType": "solana-only",
        "loginMethods": [
          "wallet"
        ],
        "walletConnectCloudProjectId": '621eea0c4c9d0a7d4bd7d7d355524502',
        "fundingMethodConfig": {
          "moonpay": {
            "useSandbox": true
          }
        },
        "embeddedWallets": {
          "createOnLogin": "all-users",
          "requireUserPasswordOnCreate": false,
          "showWalletUIs": true
        },
        "mfa": {
          "noPromptOnMfaRequired": false
        }
      }}
    >

      <App />
    </PrivyProvider>
  </Provider>,
)
