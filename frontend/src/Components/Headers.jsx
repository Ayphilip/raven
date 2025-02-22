import React, { useEffect, useState } from 'react'
import Logo from '../asset/images/logo.png'
import { usePrivy } from '@privy-io/react-auth';
import Vids from '../assets/img/hackfu/GreenModernTechnologyCyberSafetyVideo.mp4';
import { useLoginService } from '../services/authenticationService';
import { useNavigate } from 'react-router-dom';
import { avatars } from './avatars';


// import { useConnect } from 'wagmi'
// import capsule from './CapsuleInstance'
// import { CapsuleModal } from '@usecapsule/react-sdk'
// import "@usecapsule/react-sdk/styles.css";

function Headers() {



    const { ready, login, logout, authenticated, user } = usePrivy();
    const { userDetails, initiateLoginUser, userlogoutService, loading } = useLoginService();
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate()
    if(ready && !authenticated || !userDetails){
        navigate('/login')
    }

    const logoutUser = () => {
        userlogoutService()
        logout()
    }


    useEffect(() => {
      
    
      return () => {
        
      }
    }, [ready])
    


    return (
        userDetails && <div>
            <header class="fixed">

                <div class="flex items-center w-full xl:px-6 px-2 max-lg:gap-10">

                    <div class="">


                        <div class="flex items-center gap-1">


                            <button uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"
                                class="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group">
                                <ion-icon name="menu-outline" class="text-2xl group-aria-expanded:hidden"></ion-icon>
                                <ion-icon name="close-outline" class="hidden text-2xl group-aria-expanded:block"></ion-icon>
                            </button>

                        </div>

                    </div>
                    

                </div>

            </header>
        </div>

    )
}

export default Headers