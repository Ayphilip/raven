import React, { useEffect, useState } from 'react'
import Headers from '../Components/Headers'
import Sidebar from '../Components/Sidebar'
import Sidbar from '../Components/Sidbar'
// import avatars from '../Components/avatars'
import { useLoginService } from '../services/authenticationService'
import { getAllUsers } from '../services/userServices'
import { useNavigate, useParams } from 'react-router-dom'
import { avatars } from '../Components/avatars'
import Img from '../asset/images/Welcome.jpg';
import { useTweets } from '../context/tweetContext'
import { useUsers } from '../context/userContext'
import formatTimestamp from '../Components/timeStamping'
import MediaViewer from '../Components/MediaViewer'
import TweetView from '../Components/TweetView'
import Sid2bar from '../Components/Sid2bar'
import { useChats } from '../context/chatContext'

function Profile2() {
    const { userDetails, initiateLoginUser, userlogoutService } = useLoginService();

    const { tweets, likeTweet, retweetTweet, addTweet } = useTweets();
    const { users, addUser, modifyUser, addFollow, removeFollow, fetchUser, addNotifier, loading } = useUsers();

    const { allChats, initializeChat } = useChats();

    const [userInfo, setUserInfo] = useState(null)
    const [stat, setStat] = useState(false)

    const params = useParams();

    // const [users, setUsers] = useState(null)

    const navigate = useNavigate()

    const saveFollow = (userId, user2Id) => {

        var hive = addFollow(userId, user2Id)
        if (hive) {
            setStat(true)
        } else {
            setStat(false)
        }
    }

    const exitFollow = (userId, user2Id) => {

        var hive = removeFollow(userId, user2Id)
        if (hive) {
            setStat(true)
        } else {
            setStat(false)
        }
    }

    useEffect(() => {
        

        const getTweet = async () => {
            // console.log(params.id)
            try {
                const fetchedTweet = await fetchUser(params.id); // Wait for the promise to resolve
                // console.log(fetchedTweet)
                setUserInfo(fetchedTweet); // Store the resolved tweet
                document.title=`${fetchedTweet.name}(${fetchedTweet.username}) / Raven`
            } catch (error) {
                console.error('Error fetching:', error);
            }
            setStat(false)
        };

        if (params.id) getTweet();

        // let allUsers = getAllUsers()
        // setUsers(allUsers)


        return () => {

        }
    }, [params.id, stat, loading])

    return (userInfo && <div>
        <div>
            <div id='wrapper'>



                <Sidbar />


                <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                    <div class="flex max-lg:flex-col 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

                        <div class="">

                            <div class="w-[680px] mx-auto">

                                <div class="page-heading">
                                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                        <button onClick={() => navigate(-1)}><ion-icon name="arrow-back-outline" class="text-xl"></ion-icon></button>
                                        <div className='p-3'>
                                            <h1 class="page-title"> {userInfo.name} </h1>
                                            <span>{tweets.filter(tweet => tweet.userId === userInfo.username).length} posts</span>
                                        </div>
                                    </div>

                                    {/* <img src={Img} style={{width: '100%', maxHeight: '30vh'}}/> */}


                                    <div class="relative overflow-hidden w-full lg:h-72 h-48">
                                        <img src={Img} alt="" class="h-full w-full object-cover inset-0" />

                                        <div class="w-full bottom-0 absolute left-0 bg-gradient-to-t from-black/60 pt-20 z-10"></div>

                                        {/* <div class="absolute bottom-0 right-0 m-4 z-20">
                                            <div class="flex items-center gap-3">
                                                <button class="button bg-white/20 text-white flex items-center gap-2 backdrop-blur-small">Crop</button>
                                                <button class="button bg-black/10 text-white flex items-center gap-2 backdrop-blur-small">Edit</button>
                                            </div>
                                        </div> */}

                                    </div>
                                    <div class="p-3">

                                        <div class="flex flex-col justify-start md:items-start lg:-mt-60 -mt-20" style={{ flexDirection: 'row', display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>

                                            <div class="relative lg:h-30 lg:w-30 w-28 h-28 mb-4 z-10" >
                                                <div class="relative overflow-hidden rounded-full md:border-[6px] border-gray-100 shrink-0 dark:border-slate-900 shadow">
                                                    <img src={userInfo?.profilePicture ? avatars[parseInt(userInfo.profilePicture)] : avatars[0]} alt="" class="h-full w-full object-cover inset-0" />
                                                </div>
                                                {/* <button type="button" class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white shadow p-1.5 rounded-full sm:flex hidden"> <ion-icon name="camera" class="text-2xl md hydrated" role="img" aria-label="camera"></ion-icon></button> */}

                                            </div>
                                            <div style={{ flexDirection: 'row', display: 'flex', rowGap: '10px', columnGap: '10px' }}>

                                                {userDetails?.username === userInfo.username && (userDetails?.verified ?
                                                    <button onClick={() => navigate('/premiumpage')} class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                        <ion-icon name="flame-outline" class='text-xl'></ion-icon>
                                                    </button> :
                                                    <button onClick={() => navigate('/premium')} class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                        <ion-icon name="flame-outline" class='text-xl'></ion-icon>
                                                    </button>)
                                                }

                                                {userDetails?.username !== userInfo.username && userInfo.followers.includes(userDetails?.username) &&
                                                    (userInfo?.notificationList?.includes(userDetails?.username) ?
                                                    <button onClick={() => addNotifier(userInfo.username, userDetails?.username,)} class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                        <ion-icon name="notifications" class='text-xl'></ion-icon>
                                                    </button>
                                                    :
                                                    <button onClick={() => addNotifier(userInfo.username, userDetails?.username,)} class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                        <ion-icon name="notifications-outline" class='text-xl'></ion-icon>
                                                    </button>)
                                                }

                                                {userDetails?.username !== userInfo.username && userInfo.followers.includes(userDetails?.username) && (userDetails?.verified || userInfo.following.includes(userDetails?.username)) &&
                                                    <button onClick={() => initializeChat(userDetails?.username, userInfo.username)} class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                        <ion-icon name="mail-outline" class='text-xl'></ion-icon>
                                                    </button>
                                                }

                                                {userInfo.userId === userDetails.userId ? <button class="button bg-black dark:bg-secondery dark:bg-dark2 flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
                                                    <ion-icon name="add-circle" class="text-xl"></ion-icon>
                                                    <span class="text-sm"> edit profile  </span>
                                                </button> : userInfo.followers.some(fol => fol === userDetails.username) ? <button class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2">
                                                    <span class="text-sm"> Following  </span>
                                                </button> : <button onClick={() => saveFollow(userInfo.username, userDetails?.username)} class="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
                                                    <ion-icon name="add-circle" class="text-xl"></ion-icon>
                                                    <span class="text-sm"> Follow  </span>
                                                </button>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className='xl:space-y-6 space-y-3'>
                                        <h1 className='text-xl '><strong>{userInfo.name} {userInfo?.verified && <ion-icon name="shield-checkmark-outline" class="text-blue-500 font-medium text-xl"></ion-icon>}</strong></h1>
                                        <span className='text-sm '>{userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)}</span>
                                        <p>{!userInfo.bio && <button class="button bg-black flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">Add bio</button>}{userInfo.bio}</p>
                                        <p><h6>{userInfo.followers.length} Followers | {userInfo.following.length} Following</h6></p>
                                        <p>
                                            Followed by {(() => {
                                                const filteredUsers = users.filter(user =>
                                                    userDetails.following.includes(user.id) && userInfo.followers.includes(user.id)
                                                );

                                                if(!filteredUsers.length > 0){
                                                    return 'No one you follow'
                                                }

                                                const firstFour = filteredUsers.slice(0, 4).map(user => user.name);
                                                const remainingCount = filteredUsers.length - 4;

                                                return remainingCount > 0
                                                    ? `${firstFour.join(", ")} and ${remainingCount} others`
                                                    : firstFour.join(", ");
                                            })()}
                                        </p>
                                    </div>

                                    <nav class="nav__underline">

                                        <ul class="group" uk-switcher="connect: #page-tabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                            <li> <a href="#"> Suggestions  </a> </li>
                                            <li> <a href="#"> Popular </a> </li>
                                            <li> <a href="#"> My pages </a> </li>
                                            <li> <a href="#"> My pages </a> </li>
                                            <li> <a href="#"> My pages </a> </li>

                                        </ul>


                                    </nav>

                                </div>




                                <div id="page-tabs" class="uk-switcher mt-10">



                                    <div class="gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

                                        {!tweets.filter(tweet => tweet.userId === userInfo.username || (tweet.retweets.includes(userInfo.username))).length && <div>No Post or Tweet</div>}


                                        {tweets.filter(tweet => tweet.userId === userInfo.username || (tweet.retweets.includes(userInfo.username))).map(tweet =>
                                            <TweetView tweets={tweets.filter(tweet => (tweet.userId === userInfo.username) || (tweet.retweets.includes(userInfo.username)))} />
                                        )}


                                        <div class="flex justify-center my-6 lg:col-span-3 col-span-2">
                                            <button type="button" class="bg-white py-2 px-5 rounded-full shadow-md font-semibold text-sm dark:bg-dark2">Load more...</button>
                                        </div>

                                    </div>



                                    <div class="gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">





                                        <div class="flex justify-center my-6 sm:col-span-2">
                                            <button type="button" class="bg-white py-2 px-5 rounded-full shadow-md font-semibold text-sm dark:bg-dark2">Load more...</button>
                                        </div>

                                    </div>




                                    <div class="grid sm:grid-cols-3 grid-cols-2 gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-1.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> Jesse Steeve </h4>
                                                <p class="card-text"> 125k Following1 </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-2.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> John Michael </h4>
                                                <p class="card-text"> 260k Following </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-3.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> Monroe Parker </h4>
                                                <p class="card-text"> 125k Following </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-4.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> Martin Gray </h4>
                                                <p class="card-text"> 320k Following </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-5.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> James Lewis </h4>
                                                <p class="card-text"> 192k Following </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-1.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> Jesse Steeve </h4>
                                                <p class="card-text"> 125k Following1 </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-1.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> Jesse Steeve </h4>
                                                <p class="card-text"> 125k Following1 </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-3.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> Monroe Parker </h4>
                                                <p class="card-text"> 125k Following </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="card">
                                            <div class="card-media sm:h-24 h-16">
                                                <img src="assets/images/group/group-cover-2.jpg" alt="" />
                                                <div class="card-overly"></div>
                                            </div>
                                            <div class="card-body relative z-10">
                                                <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-10 rounded-full sm:mb-2 mb-1 shadow -mt-8 relative border-2 border-white" />
                                                <h4 class="card-title"> John Michael </h4>
                                                <p class="card-text"> 260k Following </p>

                                                <div class="flex gap-2">
                                                    <button type="button" class="button bg-primary text-white flex-1">Join</button>
                                                    <button type="button" class="button bg-secondery !w-auto">View</button>
                                                </div>

                                            </div>
                                        </div>


                                        <div class="flex justify-center my-6 lg:col-span-3 col-span-2">
                                            <button type="button" class="bg-white py-2 px-5 rounded-full shadow-md font-semibold text-sm dark:bg-dark2">Load more...</button>
                                        </div>


                                    </div>

                                </div>

                            </div>


                        </div>


                        <Sid2bar />

                    </div>

                </main>

            </div>



            <div>
                <button type="button" class="sm:m-10 m-5 px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-700 text-white shadow fixed bottom-0 right-0 group flex items-center gap-2">

                    <svg class="w-6 h-6 group-aria-expanded:hidden duration-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
                    </svg>

                    <div class="text-base font-semibold max-sm:hidden"> Chat </div>

                    <svg class="w-6 h-6 -mr-1 hidden group-aria-expanded:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>

                </button>
                <div class="bg-white rounded-xl drop-shadow-xl  sm:w-80 w-screen border-t dark:bg-dark3 dark:border-slate-600" id="chat__box"
                    uk-drop="offset:10;pos: bottom-right; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-right; mode: click">

                    <div class="relative">
                        <div class="p-5">
                            <h1 class="text-lg font-bold text-black"> Chats </h1>
                        </div>


                        <div class="bg-white p-3 absolute w-full top-11 border-b flex gap-2 hidden dark:border-slate-600 dark:bg-slate-700 z-10"
                            uk-scrollspy="cls:uk-animation-slide-bottom-small ; repeat: true; duration:0" id="search__chat">

                            <div class="relative w-full">
                                <input type="text" class="w-full rounded-3xl dark:!bg-white/10" placeholder="Search" />

                                <button type="button" class="absolute  right-0  rounded-full shrink-0 px-2 -translate-y-1/2 top-1/2"
                                    uk-toggle="target: #search__chat ; cls: hidden">

                                    <ion-icon name="close-outline" class="text-xl flex"></ion-icon>
                                </button>
                            </div>

                        </div>


                        <div class="absolute top-0 -right-1 m-5 flex gap-2 text-xl">
                            <button uk-toggle="target: #search__chat ; cls: hidden">
                                <ion-icon name="search-outline"></ion-icon>
                            </button>
                            <button uk-toggle="target: #chat__box ; cls: uk-open">
                                <ion-icon name="close-outline"></ion-icon>
                            </button>
                        </div>


                        <div class="page-heading bg-slat e-50 ">

                            <nav class="nav__underline -mt-7 px-5">

                                <ul class="group" uk-switcher="connect: #chat__tabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                    <li> <a href="#" class="inline-block py-[18px] border-b-2 border-transparent aria-expanded:text-black aria-expanded:border-black aria-expanded:dark:text-white aria-expanded:dark:border-white"> Friends  </a> </li>
                                    <li> <a href="#"> Groups </a> </li>

                                </ul>

                            </nav>

                        </div>


                        <div class="grid grid-cols-2 px-3 py-2 bg-slate-50  -mt-12 relative z-10 text-sm border-b  hidden" uk-switcher="connect: #chat__tabs; toggle: * > button ; animation: uk-animation-slide-right uk-animation-slide-top">
                            <button class="bg-white shadow rounded-md py-1.5"> Friends </button>
                            <button> Groups </button>
                        </div>


                        <div class="uk-switcher overflow-hidden rounded-xl -mt-8" id="chat__tabs">


                            <div class="space-y -m t-5 p-3 text-sm font-medium h-[280px] overflow-y-auto">

                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-7 rounded-full" />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-7 rounded-full" />
                                        <div> James Lewis </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-6.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-7 rounded-full" />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-7 rounded-full" />
                                        <div> James Lewis </div>
                                    </div>
                                </a>

                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-6.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>


                            </div>


                            <div class="space-y -m t-5 p-3 text-sm font-medium h-[280px] overflow-y-auto">

                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-7 rounded-full" />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-7 rounded-full" />
                                        <div> James Lewis </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-6.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-1.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-7 rounded-full" />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-7 rounded-full" />
                                        <div> James Lewis </div>
                                    </div>
                                </a>

                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href="#" class="block">
                                    <div class="flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10">
                                        <img src="assets/images/avatars/avatar-6.jpg" alt="" class="w-7 rounded-full" />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>


                            </div>

                        </div>


                    </div>

                    <div class="w-3.5 h-3.5 absolute -bottom-2 right-5 bg-white rotate-45 dark:bg-dark3"></div>
                </div>
            </div>


            <div class="hidden lg:p-20 uk- open" id="create-status" uk-modal="">

                <div class="uk-modal-dialog tt relative overflow-hidden mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark2">

                    <div class="text-center py-4 border-b mb-0 dark:border-slate-700">
                        <h2 class="text-sm font-medium text-black"> Create Status </h2>


                        <button type="button" class="button-icon absolute top-0 right-0 m-2.5 uk-modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>

                    <div class="space-y-5 mt-3 p-2">
                        <textarea class="w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800" name="" id="" rows="6" placeholder="What do you have in mind?"></textarea>
                    </div>

                    <div class="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">
                        <button type="button" class="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900">
                            <ion-icon name="image" class="text-base"></ion-icon>
                            Image
                        </button>
                        <button type="button" class="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100 dark:bg-teal-950 dark:border-teal-900">
                            <ion-icon name="videocam" class="text-base"></ion-icon>
                            Video
                        </button>
                        <button type="button" class="flex items-center gap-1.5 bg-orange-50 text-orange-600 rounded-full py-1 px-2 border-2 border-orange-100 dark:bg-yellow-950 dark:border-yellow-900">
                            <ion-icon name="happy" class="text-base"></ion-icon>
                            Feeling
                        </button>
                        <button type="button" class="flex items-center gap-1.5 bg-red-50 text-red-600 rounded-full py-1 px-2 border-2 border-rose-100 dark:bg-rose-950 dark:border-rose-900">
                            <ion-icon name="location" class="text-base"></ion-icon>
                            Check in
                        </button>
                        <button type="button" class="grid place-items-center w-8 h-8 text-xl rounded-full bg-secondery">
                            <ion-icon name="ellipsis-horizontal"></ion-icon>
                        </button>
                    </div>

                    <div class="p-5 flex justify-between items-center">
                        <div>
                            <button class="inline-flex items-center py-1 px-2.5 gap-1 font-medium text-sm rounded-full bg-slate-50 border-2 border-slate-100 group aria-expanded:bg-slate-100 aria-expanded: dark:text-white dark:bg-slate-700 dark:border-slate-600" type="button">
                                Everyone
                                <ion-icon name="chevron-down-outline" class="text-base duration-500 group-aria-expanded:rotate-180"></ion-icon>
                            </button>

                            <div class="p-2 bg-white rounded-lg shadow-lg text-black font-medium border border-slate-100 w-60 dark:bg-slate-700"
                                uk-drop="offset:10;pos: bottom-left; reveal-left;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left ; mode:click">

                                <form>
                                    <label>
                                        <input type="radio" name="radio-status" id="monthly1" class="peer appearance-none hidden" checked />
                                        <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div class="text-sm">  Everyone </div>
                                            <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                        </div>
                                    </label>
                                    <label>
                                        <input type="radio" name="radio-status" id="monthly1" class="peer appearance-none hidden" />
                                        <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div class="text-sm"> Friends </div>
                                            <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                        </div>
                                    </label>
                                    <label>
                                        <input type="radio" name="radio-status" id="monthly" class="peer appearance-none hidden" />
                                        <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div class="text-sm"> Only me </div>
                                            <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                        </div>
                                    </label>
                                </form>

                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" class="button bg-blue-500 text-white py-2 px-12 text-[14px]"> Create</button>
                        </div>
                    </div>

                </div>

            </div>
        </div >
    </div>
    )
}

export default Profile2