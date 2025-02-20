import { usePrivy } from '@privy-io/react-auth';
import React, { useEffect } from 'react'
import Img from '../asset/images/Welcome1.png';
import Img2 from '../asset/images/Welcome.jpg';
import Logo from '../asset/images/logo.png';
import { checkUser } from '../services/userServices';

import { useNavigate } from 'react-router-dom';
import { useLoginService } from '../services/authenticationService';
// import { Oracle } from 'chopinframework';

// import { oracle } from '@chopinframework/react';

function Login() {
    const { ready, login, logout, authenticated, user } = usePrivy();
    const { userDetails, initiateLoginUser, userlogoutService, loading } = useLoginService();



    const navigate = useNavigate()

    if (ready && authenticated) {
        const response = initiateLoginUser(user);
        // console.log(response)
    }
    if (ready && authenticated && userDetails) {
        navigate('/')
    }
    useEffect(() => {

        return () => {

        }
    }, [ready])

    return (
        <div class="sm:flex">

            <div class="relative lg:w-[580px] md:w-96 w-full p-10 min-h-screen bg-white shadow-xl flex items-center pt-10 dark:bg-slate-900 z-10">

                <div class="w-full lg:max-w-sm mx-auto space-y-10" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

                    <a href="#"> <img src="assets/images/logo.png" class="w-28 absolute top-10 left-10 dark:hidden" alt="" /></a>
                    <a href="#"> <img src="assets/images/logo-light.png" class="w-28 absolute top-10 left-10 hidden dark:!block" alt="" /></a>

                    <div class="hidden">
                        <img class="w-12" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=600" alt="Socialite html template" />
                    </div>

                    <div>
                        <h2 class="text-2xl font-semibold mb-1.5"> Sign in to your account </h2>
                    </div>



                    <form method="#" action="#" class="space-y-7 text-sm text-black font-medium dark:text-white" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true">




                        <div class="text-center flex items-center gap-6">
                            <hr class="flex-1 border-slate-200 dark:border-slate-800" />
                            Authentication by Privy.io
                            <hr class="flex-1 border-slate-200 dark:border-slate-800" />
                        </div>

                        <div class="flex gap-2" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 400 ;repeat: true">
                            <a onClick={authenticated ? logout : login} class="button flex-1 flex items-center gap-2 bg-primary text-white text-lg"> <ion-icon name="log-in-outline"></ion-icon> Get Started  </a>
                        </div>

                    </form>


                </div>

            </div>


            <div class="flex-1 relative bg-primary max-md:hidden">


                <div class="relative w-full h-full" tabindex="-1" uk-slideshow="animation: slide; autoplay: true">

                    <ul class="uk-slideshow-items w-full h-full">
                        <li class="w-full">
                            <img src={Img} alt="" class="w-full h-full object-cover uk-animation-kenburns uk-animation-reverse uk-transform-origin-center-left" />
                            <div class="absolute bottom-0 w-full uk-tr ansition-slide-bottom-small z-10">
                                <div class="max-w-xl w-full mx-auto pb-32 px-5 z-30 relative" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true" >
                                    <img class="w-12" src={Logo} alt="Socialite html template" />
                                    <h4 class="!text-white text-2xl font-semibold mt-7" uk-slideshow-parallax="y: 600,0,0">  Celestia Mammothon </h4>
                                    <p class="!text-white text-lg mt-7 leading-8" uk-slideshow-parallax="y: 800,0,0;"></p>
                                </div>
                            </div>
                            <div class="w-full h-96 bg-gradient-to-t from-black absolute bottom-0 left-0"></div>
                        </li>
                        <li class="w-full">
                            <img src={Img2} alt="" class="w-full h-full object-cover uk-animation-kenburns uk-animation-reverse uk-transform-origin-center-left" />
                            <div class="absolute bottom-0 w-full uk-tr ansition-slide-bottom-small z-10">
                                <div class="max-w-xl w-full mx-auto pb-32 px-5 z-30 relative" uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true" >
                                    <img class="w-12" src={Logo} alt="Socialite html template" />
                                    <h4 class="!text-white text-2xl font-semibold mt-7" uk-slideshow-parallax="y: 800,0,0">  Web3 Social Upgrade </h4>
                                    <p class="!text-white text-lg mt-7 leading-8" uk-slideshow-parallax="y: 800,0,0;"> The hive, X clone application.</p>
                                </div>
                            </div>
                            <div class="w-full h-96 bg-gradient-to-t from-black absolute bottom-0 left-0"></div>
                        </li>
                    </ul>

                    <div class="flex justify-center">
                        <ul class="inline-flex flex-wrap justify-center  absolute bottom-8 gap-1.5 uk-dotnav uk-slideshow-nav"> </ul>
                    </div>


                </div>


            </div>

        </div>
    )
}

export default Login