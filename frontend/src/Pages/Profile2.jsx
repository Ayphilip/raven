import React, { useEffect, useState } from 'react'
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
    const [ openEdit, setOpenEdit ] = useState(false)

    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [loadingSavingEdit, setLoadingSavingEdit] = useState(false)

    const openEditModal = () => {
        setName(userInfo.name)
        setBio(userInfo.bio)
        setOpenEdit(true)
    }

    const closeEditModal = () => {
        setName('')
        setBio('')
        setOpenEdit(false)
    }

    const saveEditModal = async (e) => {
        e.preventDefault()
        setLoadingSavingEdit(true)
        const dats = {
            name: name,
            bio: bio
        }
        const resp = await modifyUser(userDetails?.username, dats)

        // window.location.reload()
        // setUserData(resp)

        setLoadingSavingEdit(false)
        closeEditModal()
        window.location.reload()

        
    }


    




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
                document.title = `${fetchedTweet.name}(${fetchedTweet.username}) / Raven`
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
    }, [params.id, stat, loading, users])

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

                                                {userInfo.userId === userDetails.userId ? <button class="button bg-black dark:bg-secondery dark:bg-dark2 flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1" onClick={openEditModal}>
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

                                                if (!filteredUsers.length > 0) {
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

                                            <li> <a href="#"> Timeline  </a> </li>
                                            {/* <li> <a href="#"> Popular </a> </li>
                                            <li> <a href="#"> My pages </a> </li>
                                            <li> <a href="#"> My pages </a> </li>
                                            <li> <a href="#"> My pages </a> </li> */}

                                        </ul>


                                    </nav>

                                </div>




                                <div id="page-tabs" class="uk-switcher mt-10">



                                    <div class="gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

                                        {!tweets.filter(tweet => tweet.userId === userInfo.username || (tweet.retweets.includes(userInfo.username))).length && <div>No Post or Tweet</div>}


                                        {tweets.filter(tweet => tweet.userId === userInfo.username || (tweet.retweets.includes(userInfo.username))).map(tweet =>
                                            <TweetView tweets={tweets.filter(tweet => (tweet.userId === userInfo.username) || (tweet.retweets.includes(userInfo.username)))} />
                                        )}

                                    </div>



                                    <div class="gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

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



            {openEdit && <div className=" uk-modal lg:p-20 z-[1] uk-open">
                <div class="uk-modal-dialog tt relative overflow-auto mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark1">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignContent: 'end',
                        alignItems: 'end',
                        alignSelf: 'end'
                    }}
                    >
                        {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"> */}
                        <div className="p-10 rounded-2xl shadow-2xl w-full max-w-6xl">
                            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Edit Profile</h2>
                            <form onSubmit={saveEditModal} className="grid grid-cols-2 gap-6">
                                <input type="text" value={name} name="Name" placeholder="Name" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={(e) => setName(e.target.value)} required />
                                <textarea name="Bio" value={bio} placeholder="Bio" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={(e) => setBio(e.target.value)} required />

                                <div className="col-span-2 flex justify-between mt-8">
                                    <button type="button" onClick={closeEditModal} className="px-8 py-3 bg-gray-400 rounded-lg text-lg">Cancel</button>
                                    {loadingSavingEdit ?
                                        <button type="button" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg">Executing...</button>
                                        : <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg">Confirm</button>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>}



        </div >
    </div>
    )
}

export default Profile2