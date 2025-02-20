import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
// import store from './store.js'
import { PrivyProvider } from '@privy-io/react-auth'

import '../src/assets/wets/style.css';
import '../src/assets/wets/tailwind.css';
import { AuthProvider } from './services/authenticationService.jsx'
import { TweetProvider } from './context/tweetContext.jsx'
import { UserProvider } from './context/userContext.jsx'

import '../assets/js/simplebar.js'
import '../assets/js/uikit.min.js'
// import '../assets/js/script.js';
// import store from './redux/store.js'


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PrivyProvider
        appId="cm6dgl8ba00sh10xcnswn30yq"
        config={{
          "appearance": {
            "accentColor": "#38CCCD",
            "theme": "#f9f9ff",
            "showWalletLoginFirst": false,
            "logo": "https://raw.githubusercontent.com/Ayphilip/appPics/refs/heads/main/logo.png",
            "walletChainType": "ethereum-only",
            "walletList": [
              "detected_wallets",
              "phantom",
              "solflare",
              "backpack",
              "okx_wallet"
            ]
          },
          "loginMethods": [
            "email",
            "google",
            "twitter",
            "apple",
            "wallet"
          ],
          "fundingMethodConfig": {
            "moonpay": {
              "useSandbox": true
            }
          },
          "embeddedWallets": {
            "createOnLogin": "all-users",
            "requireUserPasswordOnCreate": false,
            "showWalletUIs": true,
            "ethereum": {
              "createOnLogin": "users-without-wallets"
            },
            "solana": {
              "createOnLogin": "off"
            }
          },
          "mfa": {
            "noPromptOnMfaRequired": false
          }
        }}
      >
        <UserProvider>
          <TweetProvider>
            <App />
          </TweetProvider>
        </UserProvider>
      </PrivyProvider>
    </AuthProvider>
  </StrictMode>,
)
