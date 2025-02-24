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
import { ChatProvider } from './context/chatContext.jsx'
import { OtherProvider } from './context/otherContext.jsx'
import { TreasureHuntProvider } from './context/treasureHuntContext.jsx'

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
      
        <TreasureHuntProvider>
          <OtherProvider>
            <ChatProvider>
              <UserProvider>
                <TweetProvider>
                  <App />
                </TweetProvider>
              </UserProvider>
            </ChatProvider>
          </OtherProvider>
        </TreasureHuntProvider>
      
    </AuthProvider>
  </StrictMode>,
)
