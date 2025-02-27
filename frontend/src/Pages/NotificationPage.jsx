import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useChats } from '../context/chatContext';
import { useLoginService } from '../services/authenticationService';
import Sid2bar from '../Components/Sid2bar';
import Sidbar from '../Components/Sidbar';
import { useOthers } from '../context/otherContext';
import RetweetView from '../Components/RetweetView';

function NotificationPage() {
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();
    const { chats, allChats, fetchMessages } = useChats();
    const { notification, markNotification } = useOthers()



    // const fileInputRef = useRef(null);

    
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

    const sortMessagesByLatest = (chatArray) => {
        return chatArray.sort((a, b) => {
            // Get the latest message timestamp from each chat object
            const latestMessageA = a.messages[a.messages.length - 1]?.timestamp.seconds || 0;
            const latestMessageB = b.messages[b.messages.length - 1]?.timestamp.seconds || 0;

            // Sort in descending order (latest first)
            return latestMessageB - latestMessageA;
        });
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            // console.log(notification);
            markNotification(userDetails?.username);
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, []);
    return (
        <div id='wrapper'>
            <Sidbar ps={3}/>

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                <div class="flex max-lg:flex-col 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

                    <div class="flex-1">


                        <div class="page-heading">

                            <h1 class="page-title"> Notifications </h1>

                            <nav class="nav__underline">

                                <ul class="group w-full justify-between" uk-switcher="connect: #ttabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                    <li> <a href="#">  All   </a> </li>
                                    <li> <a href="#"> Verified </a> </li>
                                    <li> <a href="#"> Mentions </a> </li>

                                </ul>

                            </nav>

                        </div>




                        <div id="ttabs" class="uk-switcher">

                            <div>
                                {!notification.length && <div class="flex items-center justify-between text-black dark:text-white py-3 mt-10">
                                    <h3 class="text-xl font-semibold">  </h3>
                                </div>}
                                {notification && notification?.map(nots =>
                                    nots.type == 0 && <RetweetView id={nots.message} type={'full'} />
                                )}
                            </div>

                            <div>

                                {notification &&
                                    notification
                                        .filter(nots => nots.type === 0)
                                        .map(nots =>
                                            tweets.some(tweet =>
                                                tweet.tweetId === nots.message &&
                                                users.some(user => user.username === tweet.userId && user.verified)
                                            ) && <RetweetView key={nots.message} id={nots.message} type="full" />
                                        )
                                }
                            </div>
                            <div>

                                {notification &&
                                    notification
                                        .filter(nots => nots.type === 0)
                                        .map(nots =>
                                            tweets.some(tweet =>
                                                tweet.tweetId === nots.message &&
                                                tweet.content.includes(userDetails?.username)
                                            ) && <RetweetView key={nots.message} id={nots.message} type="full" />
                                        )
                                }
                            </div>

                        </div>
                    </div>
                    <Sid2bar />

                </div>

            </main>
        </div>
    )
}

export default NotificationPage