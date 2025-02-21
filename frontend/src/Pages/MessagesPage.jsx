import React, { useEffect, useState } from 'react'
import Sidbar from '../Components/Sidbar'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { usePrivy } from '@privy-io/react-auth';
import { useLoginService } from '../services/authenticationService';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useChats } from '../context/chatContext';
import { avatars } from '../Components/avatars';
import ChatUI from '../Components/ChatUI';
import CryptoJS from 'crypto-js';
import formatTimestamp from '../Components/timeStamping';



const socket = io("http://localhost:4000");

function MessagesPage() {

    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();
    const { chats, allChats, fetchMessages } = useChats();



    // const fileInputRef = useRef(null);

    const { ready, login, logout, authenticated, user } = usePrivy();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const [messages, setMessages] = useState([]);


    const [selectedUser, setSelectedUser] = useState('')

    useEffect(() => {
        // console.log(selectedUser)
        fetchMessages(selectedUser)
    }, [selectedUser]);


    if (ready && !authenticated || !authenticate) {
        // console.log(user)
        navigate('/login')
    }


    useEffect(() => {

        console.log(allChats)

        socket.on("newMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });


        return () => {
            socket.off("newMessage");
        }

    }, [])
    return (
        <div id='wrapper'>
            <Sidbar />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">

                <div class="relative overflow-hidden border -m-2.5 dark:border-slate-700">

                    <div class="flex bg-white dark:bg-dark2">


                        <div class="md:w-[360px] relative border-r dark:border-slate-700">

                            <div id="side-chat" class="top-0 left-0 max-md:fixed max-md:w-5/6 max-md:h-screen bg-white z-50 max-md:shadow max-md:-translate-x-full dark:bg-dark2">


                                <div class="p-4 border-b dark:border-slate-700">

                                    <div class="flex mt-2 items-center justify-between">

                                        <h2 class="text-2xl font-bold text-black ml-1 dark:text-white"> Chats </h2>


                                        <div class="flex items-center gap-2.5">


                                            <button class="group">
                                                <ion-icon name="settings-outline" class="text-2xl flex group-aria-expanded:rotate-180"></ion-icon>
                                            </button>
                                            <div class="md:w-[270px] w-full" uk-dropdown="pos: bottom-left; offset:10; animation: uk-animation-slide-bottom-small">
                                                <nav>
                                                    <a href="#"> <ion-icon class="text-2xl shrink-0 -ml-1" name="checkmark-outline"></ion-icon> Mark all as read </a>
                                                    <a href="#"> <ion-icon class="text-2xl shrink-0 -ml-1" name="notifications-outline"></ion-icon> notifications setting </a>
                                                    <a href="#"> <ion-icon class="text-xl shrink-0 -ml-1" name="volume-mute-outline"></ion-icon> Mute notifications </a>
                                                </nav>
                                            </div>

                                            <button class="">
                                                <ion-icon name="checkmark-circle-outline" class="text-2xl flex"></ion-icon>
                                            </button>


                                            <button type="button" class="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
                                                <ion-icon name="chevron-down-outline"></ion-icon>
                                            </button>

                                        </div>

                                    </div>


                                    <div class="relative mt-4">
                                        <div class="absolute left-3 bottom-1/2 translate-y-1/2 flex"><ion-icon name="search" class="text-xl"></ion-icon></div>
                                        <input type="text" placeholder="Search" class="w-full !pl-10 !py-2 !rounded-lg" />
                                    </div>

                                </div>



                                <div class="space-y-2 p-2 overflow-y-auto md:h-[calc(100vh-204px)] h-[calc(100vh-130px)]">

                                    {allChats.map(chat => {
                                        const parts = chat.id?.split("_") || [];
                                        const otherId = parts.find((part) => part !== userDetails?.username)
                                        return users.filter(use => use.username === otherId).map(use => <a onClick={() => setSelectedUser(use.username)} key={chat.id} class="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery" >
                                            <div class="relative w-14 h-14 shrink-0">
                                                <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="object-cover w-full h-full rounded-full" />

                                                <div class="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-2 mb-1.5">
                                                    <div class="mr-auto text-sm text-black dark:text-white font-medium">{use.name}</div>
                                                    {chat.messages.length >0 && <div class="text-xs font-light text-gray-500 dark:text-white/70">{formatTimestamp(chat.messages[chat.messages.length - 1].timestamp)}</div>}
                                                </div>
                                                {chat?.messages.length > 0 && <div class="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">

                                                    {CryptoJS.AES.decrypt(chat.messages[chat.messages.length - 1].message, "ravenTestToken").toString(CryptoJS.enc.Utf8)}
                                                </div>}
                                            </div>
                                        </a>)
                                    }
                                    )}

                                    {!allChats.length && <div>You need to link up</div>}


                                </div>

                            </div>


                            <div id="side-chat" class="bg-slate-100/40 backdrop-blur w-full h-full dark:bg-slate-800/40 z-40 fixed inset-0 max-md:-translate-x-full md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full"></div>

                        </div>


                        {selectedUser && <ChatUI chats={chats} userDetails={userDetails} userInfo={selectedUser} />}

                    </div>

                </div>

            </main >
        </div >
    )
}

export default MessagesPage