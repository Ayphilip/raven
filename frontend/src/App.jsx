import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Welcome from './Pages/Welcome'
import Login from './Pages/Login'
import Vids from './asset/images/load.mp4'
import TweetPage from './Pages/TweetPage'
import Profile2 from './Pages/Profile2'
import Premium from './Pages/Premium'
import MessagesPage from './Pages/MessagesPage'
import Logo from './asset/images/logo.png'
import NotificationPage from './Pages/NotificationPage'
import Hunt from './Pages/Hunt'
import { useAddress } from '@chopinframework/react'
import { useLoginService } from './services/authenticationService'
import PremiumPage from './Pages/PremiumPage'
import QuestDetails from './Pages/QuestDetails'
import BookmarkPage from './Pages/Bookmark'
import SearchPage from './Pages/SearchPage'
import Swap from './Pages/Swap'

function App() {
  const { address, isLoading, isLoginError, login, logout, revalidate } = useAddress();
  const { loading, userDetails, userlogoutService } = useLoginService()





  if (loading) {
    return <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.0)", // Transparent background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999, // Ensures it's above everything
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Stack image & loader vertically
          alignItems: "center",
          justifyContent: "center",
          gap: "15px", // Spacing between image and loader
        }}
      >
        {/* Centered Image */}
        <img
          src={Logo}
          alt="Loading"
          style={{
            width: "150px", // Adjust size as needed
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)", // Soft glow effect
          }}
        />

        {/* Loader (Spinner) */}
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #3396FF",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>

      {/* CSS Animation for Loader */}
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  }

  if (isLoginError) {
    return <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.0)", // Transparent background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999, // Ensures it's above everything
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Stack image & loader vertically
          alignItems: "center",
          justifyContent: "center",
          gap: "15px", // Spacing between image and loader
        }}
      >
        {/* Centered Image */}
        <img
          src={Logo}
          alt="Loading"
          style={{
            width: "150px", // Adjust size as needed
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)", // Soft glow effect
          }}
        />
      </div>

      {/* CSS Animation for Loader */}
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  }


  // const navigate = useNavigate()

  const isAuthenticated = !loading && userDetails;


  return (
    


      <BrowserRouter>




        <Routes>

          {/* <Route path='/chat' Component={MessagesPage} />
        <Route path='/premium' Component={Premium} />
        <Route path='/ravenhunt' Component={Hunt} />
        <Route path='/notifications' Component={NotificationPage}/>
        <Route path='/welcome' Component={Mapscreen} />
        <Route path='/newgame' Component={New} />
        <Route path='/game'>
        <Route path=':id' Component={GameInterface} />
        </Route>
        <Route path='/tweet'>
        <Route path=':id' Component={TweetPage} />
        </Route>
        <Route path='/timeline'>
          <Route path=':id' Component={Profile2} />
          </Route>
          <Route path='/login' Component={Login} />
          <Route path='/' Component={Welcome} /> */}

          {isAuthenticated ? (
            <>
              <Route path="/bookmarks" Component={BookmarkPage} />
              <Route path="/search" Component={SearchPage} />
              <Route path="/chat" Component={MessagesPage} />
              <Route path="/premium" Component={Premium} />
              <Route path="/swap" Component={Swap} />
              <Route path="/premiumpage" Component={PremiumPage} />
              <Route path="/ravenhunt" Component={Hunt} />
              <Route path="/ravenhunt/quest/:id" Component={QuestDetails} />
              <Route path="/notifications" Component={NotificationPage} />
              <Route path="/tweet/:id" Component={TweetPage} />
              <Route path="/timeline/:id" Component={Profile2} />
              <Route path="/" Component={Welcome} />
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (

            <>
              <Route path="/login" Component={Login} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}


          {/* <Route path='/login' Component={Signin}/> */}
        </Routes>


      </BrowserRouter>
    

  )
}

export default App
