import React, { useEffect, useState } from 'react'
import Logo from '../asset/images/logo.png'
import Vids from '../assets/img/hackfu/GreenModernTechnologyCyberSafetyVideo.mp4';
import { useLoginService } from '../services/authenticationService';
import { useNavigate } from 'react-router-dom';
import { avatars } from './avatars';


// import { useConnect } from 'wagmi'
// import capsule from './CapsuleInstance'
// import { CapsuleModal } from '@usecapsule/react-sdk'
// import "@usecapsule/react-sdk/styles.css";

function Headers() {



    const { userDetails, initiateLoginUser, userlogoutService, loading } = useLoginService();
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate()

    const logoutUser = () => {
        userlogoutService()
        // logout()
    }


    useEffect(() => {
      
    
      return () => {
        
      }
    }, [])
    


    return (
        userDetails && 
        <></>
        

    )
}

export default Headers