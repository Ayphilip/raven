import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidbar from '../Components/Sidbar';
import RetweetView from '../Components/RetweetView';
import { motion } from "motion/react"
import { avatars } from '../Components/avatars';
import formatTimestamp from '../Components/timeStamping';
import MediaViewer from '../Components/MediaViewer';
import Sid2bar from '../Components/Sid2bar';
import { LoadingView, renderContentWithMentions } from '../Components/CapsuleInstance';
import CommentModal from '../Components/Modal';

function TweetPage() {

    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();



    // const fileInputRef = useRef(null);


    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const [id, setId] = useState(null)

    const [type, setType] = useState(0)

    const params = useParams()


    // const saveRetweet = (tweetId) => {
    //     // alert('Here')
    //     retweetTweet(tweetId, userDetails?.username)
    // }

    // console.log(params)

    useEffect(() => {
        const readTweet = async () => {
            const response = await fetchTweet(params.id)
            setTweet(response)
            document.title = `${users.filter(use => use.username === response.userId).map(use => `${use.name} on Raven:`)}${response.content} / Raven`
            // console.log(response)
        }

        readTweet()

        return () => {

        }
    }, [tweets, retweetTweet])
    return (
        !tweet ? <LoadingView /> : <div>
            <div>


                {/* <Headers /> */}


                <Sidbar />


                <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">


                    <div class="lg:flex 2xl:gap-16 gap-12 max-w-[1065px] mx-auto" id="js-oversized">

                        <div class="mx-auto">

                            <div class="page-heading">
                                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                    <button onClick={() => navigate(-1)}><ion-icon name="arrow-back-outline" class="text-xl"></ion-icon></button>
                                    <div className='p-3'>
                                        <h1 class="page-title"> Post </h1>

                                    </div>
                                </div>
                            </div>





                            <div class="md:max-w-[580px] mx-auto flex-1">

                                {tweet.parent !== 'original' && <RetweetView id={tweet.parent} type={'full'} />}





                                <div class="bg-white shadow-sm text-sm font-medium border1 dark:bg-dark1">


                                    <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                                        {users.filter(use => use.username === tweet.userId).map(use => <>
                                            <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                                            <div class="flex-1">
                                                <a href={"/timeline/" + use.id}> <h4 class="text-black dark:text-white"> {userDetails && userDetails.username === tweet.userId ? userDetails.name : use.name} </h4> </a>
                                                <div class="text-xs text-gray-500 dark:text-white/80">{formatTimestamp(tweet.createdAt)}</div>
                                            </div>
                                        </>)}

                                        <div class="-mr-1">
                                            <button type="button" class="button-icon w-8 h-8"> <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon> </button>
                                            <div class="w-[245px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click">
                                                <nav>
                                                    <a href="#"> <ion-icon class="text-xl shrink-0" name="bookmark-outline"></ion-icon>  Add to favorites </a>
                                                    <a href="#"> <ion-icon class="text-xl shrink-0" name="notifications-off-outline"></ion-icon> Mute Notification </a>
                                                    <a href="#"> <ion-icon class="text-xl shrink-0" name="flag-outline"></ion-icon>  Report this post </a>
                                                    <a href="#"> <ion-icon class="text-xl shrink-0" name="share-outline"></ion-icon>  Share your profile </a>
                                                    <hr />
                                                    <a href="#" class="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon class="text-xl shrink-0" name="stop-circle-outline"></ion-icon>  Unfollow </a>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        cursor: 'pointer', padding: '10px', overflow: "hidden", whiteSpace: "normal",  // Allows text to wrap to the next line
                                        wordWrap: "break-word"
                                    }}>
                                        <div class="sm:px-4 p-2.5 pt-0">
                                            <p class="font-normal">{renderContentWithMentions(tweet.content, users, userDetails ? userDetails : '')}</p>
                                        </div>
                                    </div>

                                    {tweet.preview && (
                                        <div
                                            style={{
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                                marginTop: "10px",
                                                padding: "10px",
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center",
                                                maxWidth: "500px", // Constrains width
                                                overflow: "hidden", // Prevents content overflow
                                                whiteSpace: "nowrap", // Avoids text breaking out
                                            }}
                                        >
                                            {/* Image (Uses preview image or favicon) */}
                                            {tweet.preview.images ? (
                                                <img
                                                    src={tweet.preview.images[0]}
                                                    alt="preview"
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        borderRadius: "6px",
                                                        objectFit: "cover", // Ensures image fits
                                                        flexShrink: 0 // Prevents image from resizing
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={tweet.preview.favicon}
                                                    alt="preview"
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        borderRadius: "6px",
                                                        objectFit: "contain",
                                                        flexShrink: 0
                                                    }}
                                                />
                                            )}

                                            {/* Text Content */}
                                            <div style={{ overflow: "hidden", flex: 1 }}>
                                                <strong style={{ display: "block", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {tweet.preview.title}
                                                </strong>
                                                <p style={{ fontSize: "12px", color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {tweet.preview.description}
                                                </p>
                                                <a
                                                    href={tweet.preview.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "blue", fontSize: "12px", wordBreak: "break-all" }}
                                                >
                                                    {tweet.preview.url}
                                                </a>
                                            </div>
                                        </div>
                                    )}


                                    <div className={`grid gap-1 sm:gap-3 max-w-xl mx-auto overflow-hidden
    ${tweet.media.length === 1 ? 'grid-cols-1' : ''}
    ${tweet.media.length === 2 ? 'grid-cols-2' : ''}
    ${tweet.media.length === 3 ? 'grid-cols-2 auto-rows-[1fr]' : ''}
    ${tweet.media.length === 4 ? 'grid-cols-2 grid-rows-2' : ''}`}>

                                        {tweet.media.map((med, index) => (
                                            <span key={index} className={`relative w-full h-full overflow-hidden rounded-lg 
            ${tweet.media.length === 1 ? 'max-h-[70vh]' : 'aspect-[16/9]'}`}>

                                                <a
                                                    className="block w-full h-full"
                                                    onClick={() => setItemViewId(tweet.tweetId)}
                                                    data-caption={tweet.content}
                                                >
                                                    <MediaViewer
                                                        fileUrl={med}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </a>
                                            </span>
                                        ))}
                                    </div>






                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">


                                        <div class="flex items-center gap-3">
                                            <button type="button" onClick={() => { setType(1); setId(tweet) }} class="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> </button>

                                            <motion.span
                                                key={tweet?.comments?.length} // Key ensures animation triggers on change
                                                initial={{ y: 5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -5, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                style={{ display: "inline-block", marginLeft: 5 }}
                                            >
                                                {tweet?.comments?.length}
                                            </motion.span>

                                        </div>



                                        <div class="flex items-center gap-3">
                                            <button type="button" class={tweet?.retweets?.includes(userDetails && userDetails?.username) ? "button-icon text-green-500 bg-slate-200/70 dark:bg-slate-700" : "button-icon bg-slate-200/70 dark:bg-slate-700"}> <ion-icon name="repeat-outline" class="text-lg"></ion-icon> </button>
                                            <div class="p-2 bg-white rounded-lg shadow-lg text-black font-medium border border-slate-100 w-60 dark:bg-slate-700"
                                                uk-drop="offset:10;pos: bottom-left; reveal-left;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left ; mode:click">

                                                <form>
                                                    <label>

                                                        {tweet?.retweets?.includes(userDetails && userDetails?.username) ?
                                                            <div onClick={() => retweetTweet(tweet.tweetId, userDetails?.username)} class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                    <ion-icon name="repeat-outline" class='text-lg'></ion-icon>
                                                                    <div class="text-sm"> Undo Repost </div>
                                                                </div>
                                                            </div> : <div onClick={() => retweetTweet(tweet.tweetId, userDetails?.username)} class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                    <ion-icon name="repeat-outline" class='text-lg'></ion-icon>
                                                                    <div class="text-sm">  Repost </div>
                                                                </div>
                                                            </div>}
                                                    </label>
                                                    <label onClick={() => { setType(2); setId(tweet) }}>
                                                        <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                            <div>
                                                                <ion-icon name="write"></ion-icon>
                                                                <div class="text-sm"> Quote </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </form>

                                            </div>
                                            <motion.span
                                                key={tweet?.retweets?.length} // Key ensures animation triggers on change
                                                initial={{ y: 5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -5, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                style={{ display: "inline-block", marginLeft: 5 }}
                                            >
                                                {tweet?.retweets?.length}
                                            </motion.span>





                                        </div>


                                        <div>
                                            <div class="flex items-center gap-2.5">
                                                <button onClick={() => likeTweet(tweet.id, userDetails?.username)} type="button" class={tweet?.likes?.includes(userDetails && userDetails.username) ? "button-icon text-red-500 bg-dark-100 dark:bg-slate-700" : "button-icon text-secondary-500 bg-dark-100 dark:bg-slate-700"}> <ion-icon class="text-lg" name="heart"></ion-icon> </button>
                                                <motion.a
                                                    key={tweet?.likes?.length} // Key ensures animation triggers on change
                                                    initial={{ y: 5, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -5, opacity: 0 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    style={{ display: "inline-block", marginLeft: 5 }}
                                                >
                                                    {tweet?.likes?.length}
                                                </motion.a>
                                                {/* <a href="#">{tweet.likes.length}</a> */}
                                            </div>
                                        </div>




                                        {/* <button type="button" class="button-icon ml-auto"> <ion-icon class="text-xl" name="paper-plane-outline"></ion-icon> </button> */}
                                        <div style={{ flexDirection: 'row', display: 'flex' }}>
                                            {userDetails && userDetails?.bookmark?.includes(tweet.tweetId) ?
                                                <button type="button" onClick={() => useBookmark(userDetails?.username, tweet.tweetId)} class="button-icon text-blue-500"> <ion-icon class="text-xl" name="bookmark"></ion-icon> </button>
                                                :
                                                <button type="button" onClick={() => useBookmark(userDetails?.username, tweet.tweetId)} class="button-icon"> <ion-icon class="text-xl" name="bookmark-outline"></ion-icon> </button>
                                            }

                                            <button type="button" class="button-icon"> <ion-icon class="text-xl" name="share-outline"></ion-icon> </button>
                                        </div>
                                    </div>







                                    <div class="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">

                                        {tweets?.filter(twee => twee.parent === tweet.tweetId)?.map(comms =>
                                            users.filter(use => use.username === comms.userId).map(use =>
                                                <>
                                                    <div class="flex items-start gap-3 relative">
                                                        <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-6 h-6 mt-1 rounded-full" /> </a>
                                                        <div class="flex-1">
                                                            <a href={"/timeline/" + use.id} class="text-black font-medium inline-block dark:text-white"> {use.name} </a>

                                                            <div style={{
                                                                cursor: 'pointer', padding: '10px', overflow: "hidden", whiteSpace: "normal",  // Allows text to wrap to the next line
                                                                wordWrap: "break-word"
                                                            }}>

                                                                <p class="font-normal">{renderContentWithMentions(comms.content, users, userDetails ? userDetails : '')}</p>
                                                            </div>

                                                            {comms.preview && (
                                                                <div
                                                                    style={{
                                                                        border: "1px solid #ccc",
                                                                        borderRadius: "8px",
                                                                        marginTop: "10px",
                                                                        padding: "10px",
                                                                        display: "flex",
                                                                        gap: "10px",
                                                                        alignItems: "center",
                                                                        maxWidth: "500px", // Constrains width
                                                                        overflow: "hidden", // Prevents content overflow
                                                                        whiteSpace: "nowrap", // Avoids text breaking out
                                                                    }}
                                                                >
                                                                    {/* Image (Uses preview image or favicon) */}
                                                                    {comms.preview.images ? (
                                                                        <img
                                                                            src={comms.preview.images[0]}
                                                                            alt="preview"
                                                                            style={{
                                                                                width: "80px",
                                                                                height: "80px",
                                                                                borderRadius: "6px",
                                                                                objectFit: "cover", // Ensures image fits
                                                                                flexShrink: 0 // Prevents image from resizing
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={comms.preview.favicon}
                                                                            alt="preview"
                                                                            style={{
                                                                                width: "80px",
                                                                                height: "80px",
                                                                                borderRadius: "6px",
                                                                                objectFit: "contain",
                                                                                flexShrink: 0
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {/* Text Content */}
                                                                    <div style={{ overflow: "hidden", flex: 1 }}>
                                                                        <strong style={{ display: "block", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                            {comms.preview.title}
                                                                        </strong>
                                                                        <p style={{ fontSize: "12px", color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                            {comms.preview.description}
                                                                        </p>
                                                                        <a
                                                                            href={comms.preview.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ color: "blue", fontSize: "12px", wordBreak: "break-all" }}
                                                                        >
                                                                            {comms.preview.url}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>


                                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">


                                                        <div class="flex items-center gap-3" onClick={() => { setType(1); setId(comms) }}>
                                                            <button type="button" class="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> </button>
                                                            <motion.span
                                                                key={comms?.comments?.length} // Key ensures animation triggers on change
                                                                initial={{ y: 5, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                exit={{ y: -5, opacity: 0 }}
                                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                                style={{ display: "inline-block", marginLeft: 5 }}
                                                            >
                                                                {comms?.comments?.length}
                                                            </motion.span>

                                                        </div>



                                                        <div class="flex items-center gap-3">
                                                            <button type="button" class="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon name="repeat-outline" class="text-lg"></ion-icon> </button>
                                                            <div class="p-2 bg-white rounded-lg shadow-lg text-black font-medium border border-slate-100 w-60 dark:bg-slate-700"
                                                                uk-drop="offset:10;pos: bottom-left; reveal-left;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left ; mode:click">

                                                                <form>
                                                                    <label>

                                                                        {comms?.retweets?.includes(userDetails && userDetails?.username) ?
                                                                            <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                                                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                                    <ion-icon name="cancel-outline" class='text-lg'></ion-icon>
                                                                                    <div class="text-sm"> Undo Repost </div>
                                                                                </div>
                                                                            </div> : <div onClick={() => saveRetweet(comms.tweetId)} class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                                                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                                    <ion-icon name="repeat-outline" class='text-lg'></ion-icon>
                                                                                    <div class="text-sm">  Repost </div>
                                                                                </div>
                                                                            </div>}
                                                                    </label>
                                                                    <label uk-toggle="target: #create-status" onClick={() => { setType(2); setId(comms) }}>
                                                                        <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                                            <div>
                                                                                <ion-icon name="write"></ion-icon>
                                                                                <div class="text-sm"> Quote </div>
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </form>

                                                            </div>
                                                            <motion.span
                                                                key={comms?.retweets?.length} // Key ensures animation triggers on change
                                                                initial={{ y: 5, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                exit={{ y: -5, opacity: 0 }}
                                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                                style={{ display: "inline-block", marginLeft: 5 }}
                                                            >
                                                                {comms?.retweets?.length}
                                                            </motion.span>





                                                        </div>


                                                        <div>
                                                            <div class="flex items-center gap-2.5">
                                                                <button onClick={() => likeTweet(comms.tweetId, userDetails?.username)} type="button" class={comms?.likes?.includes(userDetails && userDetails.username) ? "button-icon text-red-500 bg-dark-100 dark:bg-slate-700" : "button-icon text-secondary-500 bg-dark-100 dark:bg-slate-700"}> <ion-icon class="text-lg" name="heart"></ion-icon> </button>
                                                                <motion.a
                                                                    key={comms?.likes?.length} // Key ensures animation triggers on change
                                                                    initial={{ y: 5, opacity: 0 }}
                                                                    animate={{ y: 0, opacity: 1 }}
                                                                    exit={{ y: -5, opacity: 0 }}
                                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                                    style={{ display: "inline-block", marginLeft: 5 }}
                                                                >
                                                                    {comms?.likes?.length}
                                                                </motion.a>
                                                                {/* <a href="#">{tweet.likes.length}</a> */}
                                                            </div>
                                                        </div>


                                                        {/* <button type="button" class="button-icon ml-auto"> <ion-icon class="text-xl" name="paper-plane-outline"></ion-icon> </button> */}
                                                        <div style={{ flexDirection: 'row', display: 'flex' }}>
                                                            {userDetails && userDetails?.bookmark?.includes(comms.tweetId) ?
                                                                <button type="button" onClick={() => useBookmark(userDetails?.username, comms.tweetId)} class="button-icon text-blue-500"> <ion-icon class="text-xl" name="bookmark"></ion-icon> </button>
                                                                :
                                                                <button type="button" onClick={() => useBookmark(userDetails?.username, comms.tweetId)} class="button-icon"> <ion-icon class="text-xl" name="bookmark-outline"></ion-icon> </button>
                                                            }

                                                            <button type="button" class="button-icon"> <ion-icon class="text-xl" name="share-outline"></ion-icon> </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        )}





                                    </div>




                                </div>


                            </div>

                        </div>


                        <Sid2bar ps={1} />

                    </div>

                </main>

            </div>

            <CommentModal isOpen={id !== null} type={type} item={id} onClose={() => setId(null)} />
        </div>
    )
}

export default TweetPage