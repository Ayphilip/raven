import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { useUsers } from '../context/userContext';
import { avatars } from './avatars';
import CryptoJS from 'crypto-js';
import { useOthers } from '../context/otherContext';
import { useChats } from '../context/chatContext';
import { encryptText } from './CapsuleInstance';

const socket = io("/");
function ChatUI({ chats, userDetails, userInfo }) {

    const { users, addUser, modifyUser } = useUsers();

    const [newMessage, setNewMessage] = useState("");
    const [amount, setAmount] = useState(0)

    const { ptoken, tokenBal, makeTransfer } = useOthers()
    const { markMessages } = useChats()

    const sendMessage = () => {
        
        var mesg = encryptText(newMessage)
        socket.emit("sendMessage", {
            senderId: userDetails.username,
            receiverId: userInfo,
            message: mesg,
        });
        setNewMessage("");
    };
    const sendMessage2 = (message) => {
        var mesg = encryptText(message)
        socket.emit("sendMessage", {
            senderId: userDetails.username,
            receiverId: userInfo,
            message: mesg,
        });
        setAmount(0);
    };

    const transferFunc = () => {
        const data = {
            from: userDetails?.username,
            to: userInfo,
            amount: amount,
            symbol: ptoken
        }
        console.log(data)
        const response = makeTransfer(data)
        if (response) {
            sendMessage2(`Gifted ${amount} ${ptoken}`)
        }
    }

    useEffect(() => {

        markMessages(userDetails?.username, userInfo)

        // console.log(chats)
        // fetchchats(userDetails?.username, selectedUser)
    }, [chats]);



    return (
        <>
            <div class="flex-1">


                <div class="flex items-center justify-between gap-2 w- px-6 py-3.5 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">

                    <div class="flex items-center sm:gap-4 gap-2">


                        <button type="button" class="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
                            <ion-icon name="chevron-back-outline" class="text-2xl -ml-4"></ion-icon>
                        </button>
                        {users.filter(use => use.username === userInfo).map(use => <>

                            <div class="relative cursor-pointer max-md:hidden" uk-toggle="target: .rightt ; cls: hidden">
                                <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-8 h-8 rounded-full shadow" />

                                <div class="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>
                            </div>

                            <div class="cursor-pointer" uk-toggle="target: .rightt ; cls: hidden">
                                <div class="text-base font-bold"> {use.name}</div>
                                <div class="text-xs text-green-500 font-semibold"> {userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)}</div>
                            </div>
                        </>
                        )}

                    </div>

                    <div class="flex items-center gap-2">

                        <button type="button" class="hover:bg-slate-100 p-1.5 rounded-full" uk-toggle="target: .rightt ; cls: hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </button>
                    </div>

                </div>

                {/* {!chats.length && <div>Say Hello</div>} */}


                <div class="w-full p-5 py-10 overflow-y-auto md:h-[calc(100vh-204px)] h-[calc(100vh-195px)]">

                    {users.filter(use => use.username === userInfo).map(use => <div class="py-10 text-center text-sm lg:pt-8">

                        <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-24 h-24 rounded-full mx-auto mb-3" />
                        <div class="mt-8">
                            <div class="md:text-xl text-base font-medium text-black dark:text-white"> {use.name} </div>
                            <div class="text-gray-500 text-sm   dark:text-white/80"> {userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)} </div>
                        </div>
                        <div class="mt-3.5">
                            <a href={"/timeline/" + use.username} class="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold bg-secondery">View profile</a>
                        </div>
                    </div>)}

                    <div class="text-sm font-medium space-y-6" style={{overflow: 'hidden'}}>


                        {chats.map(chat => chat.senderId !== userDetails?.username ? <div class="flex gap-3">
                            {users.filter(use => use.username === chat.senderId).map(use =>

                                <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full shadow" />
                            )}

                            <div class="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">
                                {CryptoJS.AES.decrypt(chat.message, "ravenTestToken").toString(CryptoJS.enc.Utf8)}
                            </div>

                        </div> :
                            <div class="flex gap-2 flex-row-reverse items-end">

                                <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-5 h-5 rounded-full shadow" />
                                <div>
                                    <div class="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow">
                                        {CryptoJS.AES.decrypt(chat.message, "ravenTestToken").toString(CryptoJS.enc.Utf8)}
                                    </div>
                                    <span style={{ fontSize: '10px' }}>{chat.status}</span>
                                </div>
                            </div>
                        )}





                    </div>


                </div>


                <div class="flex items-center md:gap-4 gap-2 md:p-3 p-2 overflow-hidden">

                    <div id="message__wrap" class="flex items-center gap-2 h-full dark:text-white -mt-1.5">

                        <button type="button" class="shrink-0">
                            <ion-icon class="text-3xl flex" name="gift"></ion-icon>
                        </button>
                        <div class="dropbar pt-36 h-60 bg-gradient-to-t via-white from-white via-30% from-30% dark:from-slate-900 dark:via-900" uk-drop="stretch: x; target: #message__wrap ;animation:  slide-bottom ;animate-out: true; pos: top-left; offset:10 ; mode: click ; duration: 200">

                            <div class="sm:w-full p-3 flex justify-center gap-5" uk-scrollspy="target: > button; cls: uk-animation-slide-bottom-small; delay: 100;repeat:true">

                                <input type='number' class='!pl-10 !font-normal !bg-primary h-12 !text-sm' min={0} onChange={(e) => setAmount(e.target.value)} placeholder={'Amount of ' + ptoken} />


                                <button type="button" disabled={amount == 0 || tokenBal < amount} onClick={transferFunc} class="bg-orange-50 text-orange-600 border border-orange-100 shadow-sm p-2.5 rounded-full shrink-0 duration-100 hover:scale-[1.15] dark:bg-dark3 dark:border-0">
                                    <ion-icon class="text-3xl flex" name="gift"></ion-icon>
                                </button>


                            </div>

                        </div>

                        <button type="button" class="shrink-0">
                            <ion-icon class="text-3xl flex" name="happy-outline"></ion-icon>
                        </button>
                        <div class="dropbar p-2" uk-drop="stretch: x; target: #message__wrap ;animation: uk-animation-scale-up uk-transform-origin-bottom-left ;animate-out: true; pos: top-left ; offset:2; mode: click ; duration: 200 ">

                            <div class="sm:w-60 bg-white shadow-lg border rounded-xl  pr-0 dark:border-slate-700 dark:bg-dark3">

                                <h4 class="text-sm font-semibold p-3 pb-0">Send Imogi</h4>

                                <div class="grid grid-cols-5 overflow-y-auto max-h-44 p-3 text-center text-xl">

                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😊 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤩 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😎</div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥳 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😂 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥰 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😡 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😊 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤩 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😎</div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥳 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😂 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥰 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😡 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤔 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😊 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤩 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😎</div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥳 </div>
                                    <div class="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😂 </div>

                                </div>


                            </div>

                        </div>

                    </div>

                    <div class="relative flex-1">


                        <textarea placeholder="Write your message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows="1" class="w-full resize-none bg-secondery rounded-full px-4 p-2"></textarea>

                        <button type="submit" disabled={newMessage ? false : true} onClick={sendMessage} class="shrink-0 p-2 absolute right-0.5 top-0">
                            <ion-icon class="text-xl flex" name="send-outline"></ion-icon>
                        </button>


                    </div>

                    {/* <button type="button" class="flex h-full dark:text-white">
                        <ion-icon class="text-3xl flex -mt-3" name="heart-outline"></ion-icon>
                    </button> */}

                </div>

            </div>


            {users.filter(use => use.username === userInfo).map(use =>
                <div class="rightt w-full h-full absolute top-0 right-0 z-10 hidden transition-transform">
                    <div class="w-[360px] border-l shadow-lg h-screen bg-white absolute right-0 top-0 uk-animation-slide-right-medium delay-200 z-50 dark:bg-dark2 dark:border-slate-700">

                        <div class="w-full h-1.5 bg-gradient-to-r to-purple-500 via-red-500 from-pink-500 -mt-px"></div>

                        <div class="py-10 text-center text-sm pt-20">

                            <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-24 h-24 rounded-full mx-auto mb-3" />
                            <div class="mt-8">
                                <div class="md:text-xl text-base font-medium text-black dark:text-white"> {use.name}  </div>
                                <div class="text-gray-500 text-sm mt-1 dark:text-white/80">{userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)}</div>
                            </div>
                            <div class="mt-5">
                                <a href={"/timeline/" + use.username} class="inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-secondery">View profile</a>
                            </div>
                        </div>

                        <hr class="opacity-80 dark:border-slate-700" />

                        <ul class="text-base font-medium p-3">
                            <li>
                                <div class="flex items-center gap-5 rounded-md p-3 w-full hover:bg-secondery">
                                    <ion-icon name="notifications-off-outline" class="text-2xl"></ion-icon> Mute Notification
                                    <label class="switch cursor-pointer ml-auto"> <input type="checkbox" checked /><span class="switch-button !relative"></span></label>
                                </div>
                            </li>
                            <li> <button type="button" class="flex items-center gap-5 rounded-md p-3 w-full hover:bg-secondery"> <ion-icon name="flag-outline" class="text-2xl"></ion-icon> Report     </button></li>
                            <li> <button type="button" class="flex items-center gap-5 rounded-md p-3 w-full hover:bg-secondery"> <ion-icon name="settings-outline" class="text-2xl"></ion-icon> Ignore chats   </button> </li>
                            <li> <button type="button" class="flex items-center gap-5 rounded-md p-3 w-full hover:bg-secondery"> <ion-icon name="stop-circle-outline" class="text-2xl"></ion-icon> Block    </button> </li>
                            <li> <button type="button" class="flex items-center gap-5 rounded-md p-3 w-full hover:bg-red-50 text-red-500"> <ion-icon name="trash-outline" class="text-2xl"></ion-icon> Delete Chat   </button> </li>
                        </ul>


                        <button type="button" class="absolute top-0 right-0 m-4 p-2 bg-secondery rounded-full" uk-toggle="target: .rightt ; cls: hidden">
                            <ion-icon name="close" class="text-2xl flex"></ion-icon>
                        </button>

                    </div>


                    <div class="bg-slate-100/40 backdrop-blur absolute w-full h-full dark:bg-slate-800/40" uk-toggle="target: .rightt ; cls: hidden"></div>

                </div>
            )}
        </>
    )
}

export default ChatUI