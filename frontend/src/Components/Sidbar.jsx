import React, { useState } from 'react'
import { avatars } from './avatars'
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
import { useOthers } from '../context/otherContext';
import Cookies from 'js-cookie'
import { useChats } from '../context/chatContext';
import { useAddress } from '@chopinframework/react';


function Sidbar({ ps }) {
    const { address, isLoading, isLoginError, logout, revalidate } = useAddress();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();
    const { tokenBal, token, ptoken, notification } = useOthers();
    const [tkn, setTkn] = useState(ptoken)

    const { chats, allChats, fetchMessages } = useChats();

    const navigate = useNavigate();

    const logoutUser = () => {
        userlogoutService()
        logout()
    }

    return (
        authenticate && <>
            <header class="sticky z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200 dark:bg-dark2 dark:border-slate-800 block md:hidden">

                <div class="flex items-center w-full xl:px-6 px-2 max-lg:gap-10">

                    <div class="2xl:w-[--w-side] lg:w-[--w-side-sm]">


                        <div class="flex items-center gap-1" style={{ display: 'flex', width: '95vw', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


                            <button uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"
                                class="py-5 flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group">
                                <ion-icon name="menu-outline" class="text-2xl group-aria-expanded:hidden"></ion-icon>
                                <ion-icon name="close-outline" class="hidden text-2xl group-aria-expanded:block"></ion-icon>
                            </button>
                            <a href={"/timeline/" + userDetails?.username}>
                                <div class="p-4 py-5 flex items-center gap-4">
                                    <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />

                                </div>
                            </a>

                        </div>

                    </div>


                </div>

            </header>
            <div>
                <div id="site__sidebar"
                style={{maxWidth: '400px'}}
                    class="fixed top-0 left-0 z-[100] transition-transform xl:duration-500 max-xl:w-[400px] max-xl:-translate-x-full">
                

                <img src={Logo} style={{ width: '20%' }} />

                <div class="max-xl:bg-white shadow-sm 2xl:w-72 sm:w-64 w-[80%] h-screen sticky z-30 max-lg:border-r dark:max-xl:!bg-slate-700 dark:border-slate-700">

                    <div class="pr-4">

                        <nav id="side"
                            style={{ position: 'sticky', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >

                            <ul>
                                <li class={ps == 1 && "active"}>
                                    <a href="/" className='text-xl'>
                                        {/* <img src={fly1} alt="feeds" class="w-6" /> */}
                                        <ion-icon name="home-outline"></ion-icon>
                                        <span> Feed </span>
                                    </a>
                                </li>
                                <li class={ps == 2 && "active"}>
                                    <a href="/chat" className='text-xl'>
                                        <ion-icon name="mail-outline"></ion-icon>
                                        <span> messages </span>
                                        {allChats && allChats?.filter(chat =>
                                            chat.messages.some(message => message.receiverId === userDetails?.username && message.status === 'sent')
                                        ).length > 0 && <span style={{ background: '#3396FF' }} className='p-1 rounded-full border border-white dark:border-slate-800'>{allChats.filter(chat =>
                                            chat.messages.some(message => message.receiverId === userDetails?.username && message.status === 'sent')
                                        ).length}</span>}
                                    </a>
                                </li>
                                <li class={ps == 3 && "active"}>
                                    <a href="/notifications" className='text-xl'>
                                        <ion-icon name="notifications-outline"></ion-icon>
                                        <span> Notification </span>
                                        {notification.filter(chat => !chat.isRead).length > 0 && (
                                            <span style={{ background: '#3396FF' }} className='p-1 rounded-full border border-white dark:border-slate-800'>
                                                {notification.filter(chat => !chat.isRead).length}
                                            </span>
                                        )}
                                    </a>
                                </li>
                                <li class={ps == 4 && "active"}>
                                    <a href="/premium" className='text-xl'>
                                        <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                                        <span> Premium </span>
                                    </a>
                                </li>
                                <li class={ps == 5 && "active"}>
                                    <a href="/bookmarks" className='text-xl'>
                                        <ion-icon name="bookmark-outline"></ion-icon>
                                        <span> Bookmarks </span>
                                    </a>
                                </li>
                                <li class={ps == 6 && "active"}>
                                    <a href="/ravenhunt" className='text-xl'>
                                        <ion-icon name="flame-outline"></ion-icon>
                                        <span> Treasure Hunt </span>
                                    </a>
                                </li>
                                {/* <li class={ps == 7 && "active"}>
                                        <a href="/swap" className='text-xl'>
                                            <ion-icon name="swap-vertical-outline"></ion-icon>
                                            <span> Raven Swap </span>
                                        </a>
                                    </li> */}

                                <li>
                                    <a onClick={logoutUser} className='text-xl'>
                                        <ion-icon name="exit-outline"></ion-icon>
                                        <span> Logout </span>
                                    </a>
                                </li>




                            </ul>
                            {/* <div class="p-1 py-2 flex items-center gap-4" style={{cursor: 'pointer'}} onClick={
                                () => {
                                    if(localStorage.theme === 'dark'){
                                        localStorage.theme = 'light'
                                        window.location.reload()
                                    }else{
                                        localStorage.theme = 'dark'
                                        window.location.reload()
                                    }
                                }
                            }>
                                {localStorage.theme === 'dark'
                                    ?
                                    <span class="mdi mdi-weather-sunny"></span>
                                    :
                                    <span class="mdi mdi-weather-night"></span>
                                }
                                Switch Theme
                            </div> */}


                            <select value={tkn} onChange={(e) => {
                                setTkn(e.target.value)
                                Cookies.set("ptoken", e.target.value);
                                window.location.reload()
                            }} class="p-1 py-2 flex items-center gap-4">
                                
                                {token.map(tkn =>
                                    <option value={tkn.id}>{tkn.name}({tkn.symbol})</option>
                                )}
                            </select>

                            {/* <div className="relative w-64">
                                {token.filter(tkn => tkn.id === ptoken).map(selectedToken =>
                                    <button className="w-full flex items-center justify-between p-3 bg-gray-200 rounded-lg">
                                        <img src={selectedToken?.image} alt={selectedToken.name} className="w-6 h-6 mr-2" />
                                        {selectedToken.name} ({selectedToken.symbol})
                                    </button>
                                )}

                                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg">
                                    {token.map((tkn) => (
                                        <div
                                            key={tkn.id}
                                            onChange={() => {
                                                setTkn(tkn.id)
                                                Cookies.set("ptoken", tkn.id);
                                                window.location.reload()
                                            }}
                                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <img src={token?.image} alt={token.name} className="w-6 h-6 mr-2" />
                                            {token.name} ({token.symbol})
                                        </div>
                                    ))}
                                </div>
                            </div> */}



                            {userDetails && <a href={"/timeline/" + userDetails.username}>

                                <div class="p-1 py-2 flex items-center gap-4">
                                    <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-15 h-10 rounded-full shadow" />
                                    <div class="flex-1">
                                        <h6 class="text-sm font-small text-black">{userDetails.name} {userDetails?.verified && <ion-icon name="shield-checkmark-outline" class="text-blue-500 font-medium text-xl"></ion-icon>}</h6>
                                        <div class="text-sm mt-1 text-blue-600 font-light dark:text-white/70">{userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)}</div>
                                        <div class="text-sm mt-1 text-blue-600 font-light dark:text-white/70">{tokenBal} {ptoken}</div>
                                    </div>
                                </div>
                            </a>}



                        </nav>



                    </div>

                </div>
                <div id="site__sidebar__overly"
                    class="absolute top-0 left-0 w-screen h-screen lg:hidden xl:hidden backdrop-blur-sm"
                    uk-toggle="target: #site__sidebar ; cls :!-translate-x-0">
                </div>

            </div>
        </div >
        </>
    )
}

export default Sidbar