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


function Sidbar() {
    const { ready, login, logout, authenticated, user } = usePrivy();
    const { userDetails, initiateLoginUser, userlogoutService, loading } = useLoginService();

    const navigate = useNavigate();

    if (ready && !authenticated || !userDetails) {
        navigate('/login')
    }
    return (
        <div>
            <div id="site__sidebar" class="fixed top-0 left-0 z-[99] pt-[--m-top] overflow-hidden transition-transform xl:duration-500 max-xl:w-full max-xl:-translate-x-full">


                <div class="p-2 max-xl:bg-white shadow-sm 2xl:w-72 sm:w-64 w-[80%] h-[calc(100vh-64px)] relative z-30 max-lg:border-r dark:max-xl:!bg-slate-700 dark:border-slate-700">

                    <div class="pr-4" data-simplebar>

                        <nav id="side">

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
                                    <a href="video.html">
                                        <img src={fly3} alt="messages" class="w-6" />
                                        <span> video </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="event.html">
                                        <img src={fly4} alt="messages" class="w-6" />
                                        <span> event </span>
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
                                    <a href="market.html">
                                        <img src={fly7} alt="market" class="w-7 -ml-1" />
                                        <span> market </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="blog.html">
                                        <img src={fly8} alt="blog" class="w-6" />
                                        <span> blog </span>
                                    </a>
                                </li>
                                
                                <li class="" id="show__more">
                                    <a href={"/timeline/" + userDetails.username}>

                                        <div class="p-4 py-5 flex items-center gap-4">
                                            <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />
                                            <div class="flex-1">
                                                <h4 class="text-sm font-small text-black">{userDetails.name}</h4>
                                                <div class="text-sm mt-1 text-blue-600 font-light dark:text-white/70">{userDetails.username.slice(0, 6)}...
                                                {userDetails.username.slice(-4)}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>


                            </ul>



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