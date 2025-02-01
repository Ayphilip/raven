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

function App() {
  const [count, setCount] = useState(0)


  return (

    <BrowserRouter>
      <body className=''>
        

        <Routes>

          <Route path='/welcome' Component={Mapscreen} />
          <Route path='/newgame' Component={New} />
          <Route path='/game'>
            <Route path=':id' Component={GameInterface} />
          </Route>
          <Route path='/' Component={Home} />
        </Routes>
        
      </body>
    </BrowserRouter>

  )
}

export default App
