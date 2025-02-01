import React, { useState } from 'react'
import Logo from '../assets/img/logo.png'
import { usePrivy } from '@privy-io/react-auth';
import Vids from '../assets/img/hackfu/GreenModernTechnologyCyberSafetyVideo.mp4';

// import { useConnect } from 'wagmi'
// import capsule from './CapsuleInstance'
// import { CapsuleModal } from '@usecapsule/react-sdk'
// import "@usecapsule/react-sdk/styles.css";

function Headers() {



    const { login, logout, authenticated, user } = usePrivy();
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div>



            {/* <div className='headerssssss'>
                <div></div>
                <div class="navbarssssss">
                    <div class="logo"></div>
                    <div class="links">
                        <a href="#">Home</a>
                        <a href="#">How to Play</a>
                        <a href="#">About Us</a>
                        <a href="#">About Mammathon</a>
                    </div>
                    {authenticated ? <span class="connect-walletssssss">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 015.656 5.656l-1.414 1.414a4 4 0 01-5.656 0m-2.828-7.828a4 4 0 00-5.656 5.656l1.414 1.414a4 4 0 005.656 0" />
                        </svg>

                        <span>{user?.wallet?.address?.slice(0, 10)}</span>
                        <br />
                        {user?.email}
                    </span> :
                        <span onClick={login} class="connect-walletssssss">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 015.656 5.656l-1.414 1.414a4 4 0 01-5.656 0m-2.828-7.828a4 4 0 00-5.656 5.656l1.414 1.414a4 4 0 005.656 0" />
                            </svg>
                            Connect Wallet
                        </span>}
                </div> */}

            {/* <CapsuleModal
                capsule={capsule}
                isOpen={isOpen}
                onClose={() => setIsModalOpen(false)}
                logo={"https://raw.githubusercontent.com/Ayphilip/appPics/refs/heads/main/logo.png"}
                theme={{ "foregroundColor": "#f9f9ff", "backgroundColor": "#176961", "accentColor": "#f9f9ff", "font": "Roboto", "borderRadius": "xl" }}
                oAuthMethods={[]}
                disablePhoneLogin
                authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
                externalWallets={["METAMASK", "PHANTOM", "WALLETCONNECT", "COINBASE", "ZERION"]}
                recoverySecretStepEnabled
                onRampTestMode={true}
                /> */}



            <div class="">
                {/* <video class="fix-homessssss" autoPlay loop muted>
                    <source src={Vids} type="video/mp4" />

                </video> */}
                
            </div>

        </div>

    )
}

export default Headers