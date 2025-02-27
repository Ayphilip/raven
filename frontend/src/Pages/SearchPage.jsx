import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useChats } from '../context/chatContext';
import { useLoginService } from '../services/authenticationService';
import Sid2bar from '../Components/Sid2bar';
import Sidbar from '../Components/Sidbar';
import { useOthers } from '../context/otherContext';
import RetweetView from '../Components/RetweetView';
import TweetView from '../Components/TweetView';
import { LoadingView } from '../Components/CapsuleInstance';
import { avatars } from '../Components/avatars';

function SearchPage() {
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser, addFollow } = useUsers();
    const { chats, allChats, fetchMessages } = useChats();
    const { notification, markNotification, makeSearch, searchResult } = useOthers()



    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');



    // const fileInputRef = useRef(null);


    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const [messages, setMessages] = useState([]);

    const [searchWord, setSearchWord] = useState(searchQuery)

    const [selectedUser, setSelectedUser] = useState('')

    const saveFollow = (userId, user2Id) => {

        var hive = addFollow(userId, user2Id)
        if (hive) {
            setStat(true)
        } else {
            setStat(false)
        }
    }

    const executeSearch = (word) => {
        if (!word) {
            console.error("Search word is empty!");
            return;
        }
        alert(word)
        navigate(`/search?q=${word}`);
    };

    useEffect(() => {
        makeSearch(searchQuery)
        fetchMessages(selectedUser)
        document.title=`${searchQuery} - Search / Raven`
        // console.log(searchResult)
    }, [selectedUser, searchQuery]);

    const sortMessagesByLatest = (chatArray) => {
        return chatArray.sort((a, b) => {
            // Get the latest message timestamp from each chat object
            const latestMessageA = a.messages[a.messages.length - 1]?.timestamp.seconds || 0;
            const latestMessageB = b.messages[b.messages.length - 1]?.timestamp.seconds || 0;

            // Sort in descending order (latest first)
            return latestMessageB - latestMessageA;
        });
    };


    return (
        searchResult ? <div id='wrapper'>
            <Sidbar ps={10} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                <div class="flex max-lg:flex-col 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

                    <div class="flex-1">


                        <div class="page-heading">

                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                                <button onClick={() => navigate(-1)}><ion-icon name="arrow-back-outline" class="text-xl"></ion-icon></button>

                                <form onSubmit={() => executeSearch(searchWord)} class="xl:w-auto sm:w-full sm:relative rounded-xl overflow-hidden bg-secondery max-md:hidden w-screen left-0 max-sm:fixed max-sm:top-2 dark:!bg-white/5">
                                    <button type='submit'><ion-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2"></ion-icon></button>
                                    <input type="text" required value={searchWord} onChange={(e) => setSearchWord(e.target.value)} placeholder="Search Friends, videos .." class="w-full !pl-10 !font-normal !bg-transparent h-12 !text-sm" />
                                </form>


                                
                            </div>

                            <nav class="nav__underline">

                                <ul class="group w-full justify-between" uk-switcher="connect: #ttabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                    <li> <a href="#">  Top   </a> </li>
                                    <li> <a href="#"> Latest </a> </li>
                                    <li> <a href="#"> People </a> </li>
                                    <li> <a href="#"> Media </a> </li>
                                    <li> <a href="#"> List </a> </li>

                                </ul>

                            </nav>

                        </div>




                        <div id="ttabs" class="uk-switcher">

                            <div>
                                {searchResult?.users?.length > 0 && <h3><strong>Users</strong></h3>}
                                <div class=" md:gap-2 gap-3">
                                    {searchResult?.users?.length > 0 && (
                                        users.filter(use => searchResult?.users?.some(sr => sr.username === use.username)).map(use =>

                                            <div class="flex md:items-center space-x-4 p-4 rounded-md box">
                                                <div class="sm:w-20 w-14 sm:h-20 h-14 flex-shrink-0 rounded-lg relative">
                                                    <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} class="absolute w-full h-full inset-0 rounded-md object-cover shadow-sm" alt="" />
                                                </div>
                                                <div class="flex-1">
                                                    <a href={"/timeline/"+use.username} class="md:text-lg text-base font-semibold capitalize text-black dark:text-white"> {use.name}   </a>
                                                    <div class="flex space-x-2 items-center text-sm font-normal">
                                                        <p>{use.bio}</p>
                                                    </div>


                                                </div>
                                                {use.userId === userDetails.userId ? <button class="button bg-black dark:bg-secondery dark:bg-dark2 flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
                                                    <ion-icon name="add-circle" class="text-xl"></ion-icon>
                                                    <span class="text-sm"> edit profile  </span>
                                                </button> : use.followers.some(fol => fol === userDetails.username) ? <button class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                    <span class="text-sm"> Following  </span>
                                                </button> : <button onClick={() => saveFollow(use.username, userDetails?.username)} class="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
                                                    <ion-icon name="add-circle" class="text-xl"></ion-icon>
                                                    <span class="text-sm"> Follow  </span>
                                                </button>}
                                                {/* <button type="button" class="button bg-primary-soft text-primary dark:text-white gap-1 max-md:hidden"> <ion-icon name="add-circle" class="text-xl -ml-1"></ion-icon> Join</button> */}

                                            </div>
                                        ))
                                    }

                                </div>

                                <br />
                                <br />

                                {searchResult?.tweets?.length > 0 && (
                                    <TweetView
                                        tweets={tweets.filter(tweet =>
                                            searchResult.tweets.some(searchTweet => searchTweet.tweetId === tweet.tweetId)
                                        )}
                                    />
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
                    <Sid2bar ps={'search'} />

                </div>

            </main>
        </div> : <LoadingView />
    )
}

export default SearchPage