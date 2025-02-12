import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Home from './Pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GameInterface from './Pages/Game'
import New from './Pages/New'
import Welcome from './Pages/Welcome'
import Mapscreen from './Pages/Mapscreen'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Vids from './asset/images/load.mp4'
import { usePrivy } from '@privy-io/react-auth'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const {ready} = usePrivy()

  if (!ready) {
    return <div>

      <div style={{ position: 'fixed', width: 100 + '%', height: 100 + '%' }}>
      </div>

      <video style={{ width: 100 + 'vw', height: 100 + 'vh', zIndex: -1 }} autoPlay loop muted>
        <source src={Vids} type="video/mp4" />

      </video>
    </div>
  }


  return (

    <BrowserRouter>
      <body className=''>
        


        <Routes>

          <Route path='/welcome' Component={Mapscreen} />
          <Route path='/newgame' Component={New} />
          <Route path='/game'>
            <Route path=':id' Component={GameInterface} />
          </Route>
          <Route path='/timeline'>
            <Route path=':id' Component={Profile} />
          </Route>
          <Route path='/login' Component={Login} />
          <Route path='/' Component={Welcome} />


          {/* <Route path='/login' Component={Signin}/> */}
        </Routes>

      </body>
    </BrowserRouter>

  )
}

export default App
