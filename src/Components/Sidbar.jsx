import React from 'react'
import { avatars } from './avatars'
import { usePrivy } from '@privy-io/react-auth';
import { useLoginService } from '../services/authenticationService';
import { useNavigate } from 'react-router-dom';
import fly1 from '../asset/icons/home.png'
import fly2 from "../asset/icons/message.png"
import fly3 from "../asset/icons/video.png"
import fly4 from "../asset/icons/event.png"
import fly5 from "../asset/icons/page.png"
import fly6 from "../asset/icons/group.png"
import fly7 from "../asset/icons/market.png"
import fly8 from "../asset/icons/blog.png"
import fly9 from "../asset/icons/game.png"
import fly10 from "../asset/icons/switch.png"
import Logo from '../asset/images/logo.png'


function Sidbar() {
    const { ready, login, logout, authenticated, user } = usePrivy();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();

    const navigate = useNavigate();

    const logoutUser = () => {
        userlogoutService()
        logout()
    }

    if (ready && !authenticated || !authenticate) {
        navigate('/login')
    }
    return (
        authenticate && <div>
            <div id="site__sidebar" class="fixed top-0 left-0 z-[99] overflow-hidden transition-transform xl:duration-500 max-xl:w-full max-xl:-translate-x-full">
                    <img src={Logo} style={{width: '20%'}}/>


                <div class="p-2 max-xl:bg-white shadow-sm 2xl:w-72 sm:w-64 w-[80%] h-[calc(100vh-64px)] relative z-30 max-lg:border-r dark:max-xl:!bg-slate-700 dark:border-slate-700">

                    <div class="pr-4" data-simplebar>

                        <nav id="side" style={{position: 'relative', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>

                            <ul>
                                <li class="active">
                                    <a href="/">
                                        <img src={fly1} alt="feeds" class="w-6" />
                                        <span> Feed </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="messages.html">
                                        <img src={fly2} alt="messages" class="w-5" />
                                        <span> messages </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="event.html">
                                        <img src={fly4} alt="messages" class="w-6" />
                                        <span> Notification </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="video.html">
                                        <img src={fly3} alt="messages" class="w-6" />
                                        <span> Treasure Hunt </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="pages.html">
                                        <img src={fly5} alt="pages" class="w-6" />
                                        <span> Pages </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="groups.html">
                                        <img src={fly6} alt="groups" class="w-6" />
                                        <span> Groups </span>
                                    </a>
                                </li>
                                
                                <li>
                                    <a onClick={logoutUser}>
                                        <img src={fly10} alt="blog" class="w-6" />
                                        <span> Logout </span>
                                    </a>
                                </li>

                                <li class="" id="show__more">
                                </li>


                            </ul>
                            {userDetails && <a href={"/timeline/" + userDetails.username}>

                                <div class="p-1 py-2 flex items-center gap-4">
                                    <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-15 h-10 rounded-full shadow" />
                                    <div class="flex-1">
                                        <h6 class="text-sm font-small text-black">{userDetails.name}</h6>
                                        <div class="text-sm mt-1 text-blue-600 font-light dark:text-white/70">{userDetails.username.slice(0, 6)}...
                                            {userDetails.username.slice(-4)}</div>
                                    </div>
                                </div>
                            </a>}



                        </nav>



                    </div>

                </div>

                <div id="site__sidebar__overly"
                    class="absolute top-0 left-0 z-20 w-screen h-screen xl:hidden backdrop-blur-sm"
                    uk-toggle="target: #site__sidebar ; cls :!-translate-x-0">
                </div>
            </div>
        </div>
    )
}

export default Sidbar