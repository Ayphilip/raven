import React, { useState } from 'react'
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { avatars } from './avatars';
import formatTimestamp from './timeStamping';
import RetweetView from './RetweetView';
import MediaViewer from './MediaViewer';
import { useTweets } from '../context/tweetContext';
import { motion } from "motion/react"
import { Tooltip } from 'react-tooltip';
import { renderContentWithMentions } from './CapsuleInstance';
import { Mention, MentionsInput } from 'react-mentions';

function TweetView({ tweets }) {
    const { users, userList, addUser, modifyUser } = useUsers();
    const { userDetails, initiateLoginUser, userlogoutService, loading, useBookmark } = useLoginService();
    const { likeTweet, retweetTweet, addTweet } = useTweets();

    const [content, setContent] = useState('')
    const [visibility, setVisible] = useState(0)
    const [media, setMedia] = useState([])

    const [id, setId] = useState('')

    const justClick = () => {
        alert('Clicked')
    }

    const handleFileChange = async (event) => {

        const files = event.target.files;
        if (!files.length) return;

        const fileArray = Array.from(files);

        // Upload files and get URLs
        const uploadedFiles = await Promise.all(fileArray.map(uploadMedia));

        // Store uploaded URLs in state
        setMedia((prevUrls) => [...prevUrls, ...uploadedFiles]);
    };

    const saveRetweet = (tweetId) => {
        retweetTweet(tweetId, userDetails?.username)
    }



    return (<>
        {tweets.map(tweet =>

            <div class="bg-white shadow-sm text-sm font-medium border1 dark:bg-dark1">


                <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                    {users.filter(use => use.username === tweet.userId).map(use => <>
                        <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                        <div class="flex-1">
                            <a href={"/timeline/" + use.id}> <h4 class="text-black dark:text-white"> {use.name} </h4> </a>
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

                <a href={'/tweet/' + tweet.tweetId}>

                    <div class="sm:px-4 p-2.5 pt-0">
                        <p class="font-normal">{renderContentWithMentions(tweet.content, users, userDetails ? userDetails.username : '')}</p>
                    </div>


                    {Array.isArray(tweet.media) && tweet.media.length > 0 && (
                        tweet.media.length > 1 ? (
                            <div className="relative uk-visible-toggle sm:px-4" tabIndex="-1" uk-slideshow="animation: push; ratio: 4:3">
                                <ul className="uk-slideshow-items overflow-hidden rounded-xl" uk-lightbox="animation: fade">
                                    {tweet.media.map((med, index) => (
                                        <li key={index} className="w-full">
                                            <a className="inline" href={med} data-caption={tweet.content}>
                                                <MediaViewer fileUrl={med} />
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <a className="nav-prev left-6" href="#" uk-slideshow-item="previous">
                                    <ion-icon name="chevron-back" className="text-2xl"></ion-icon>
                                </a>
                                <a className="nav-next right-6" href="#" uk-slideshow-item="next">
                                    <ion-icon name="chevron-forward" className="text-2xl"></ion-icon>
                                </a>
                            </div>
                        ) : (
                            <a href="#preview_modal" data-caption={tweet.content} style={{ maxHeight: '20vh' }}>
                                <div className="relative w-full lg:h-96 h-full sm:px-4">
                                    <MediaViewer fileUrl={tweet.media[0]} />
                                </div>
                            </a>
                        )
                    )}
                </a>


                {tweet.parent !== 'original' && <RetweetView id={tweet.parent} />}


                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">


                    <div class="flex items-center gap-3" uk-toggle="target: #create-status">
                        <button type="button" class="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> </button>
                        <motion.span
                            key={tweet.comments.length} // Key ensures animation triggers on change
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            style={{ display: "inline-block", marginLeft: 5 }}
                        >
                            {tweet.comments.length}
                        </motion.span>

                    </div>



                    <div class="flex items-center gap-3">
                        <button type="button" class={tweet?.retweets?.includes(userDetails && userDetails?.username) ? "button-icon text-green-500 bg-slate-200/70 dark:bg-slate-700" : "button-icon bg-slate-200/70 dark:bg-slate-700"}> <ion-icon name="repeat-outline" class="text-lg"></ion-icon> </button>
                        <div class="p-2 bg-white rounded-lg shadow-lg text-black font-medium border border-slate-100 w-60 dark:bg-slate-700"
                            uk-drop="offset:10;pos: bottom-left; reveal-left;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left ; mode:click">

                            <form>
                                <label>

                                    {tweet.retweets.includes(userDetails && userDetails?.username) ?
                                        <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <ion-icon name="cancel-outline" class='text-lg'></ion-icon>
                                                <div class="text-sm"> Undo Repost </div>
                                            </div>
                                        </div> : <div onClick={() => saveRetweet(tweet.tweetId)} class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <ion-icon name="repeat-outline" class='text-lg'></ion-icon>
                                                <div class="text-sm">  Repost </div>
                                            </div>
                                        </div>}
                                </label>
                                <label uk-toggle="target: #create-status" onClick={() => setId(tweet.tweetId)}>
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
                            key={tweet.retweets.length} // Key ensures animation triggers on change
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            style={{ display: "inline-block", marginLeft: 5 }}
                        >
                            {tweet.retweets.length}
                        </motion.span>





                    </div>


                    <div>
                        <div class="flex items-center gap-2.5">
                            <button onClick={() => likeTweet(tweet.tweetId, userDetails?.username)} type="button" class={tweet.likes.includes(userDetails && userDetails.username) ? "button-icon text-red-500 bg-dark-100 dark:bg-slate-700" : "button-icon text-secondary-500 bg-dark-100 dark:bg-slate-700"}> <ion-icon class="text-lg" name="heart"></ion-icon> </button>
                            <motion.a
                                key={tweet.likes.length} // Key ensures animation triggers on change
                                initial={{ y: 5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -5, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                style={{ display: "inline-block", marginLeft: 5 }}
                            >
                                {tweet.likes.length}
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

                    {tweet.comments.map(comms =>
                        users.filter(use => use.username === comms.userId).map(use =>

                            <div class="flex items-start gap-3 relative">
                                <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-6 h-6 mt-1 rounded-full" /> </a>
                                <div class="flex-1">
                                    <a href={"/timeline/" + use.id} class="text-black font-medium inline-block dark:text-white"> {use.name} </a>
                                    <p class="mt-0.5">{comms.comment}</p>
                                </div>
                            </div>
                        )
                    )}

                    {/* <button type="button" class="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 mt-2">
                        <ion-icon name="chevron-down-outline" class="ml-auto duration-200 group-aria-expanded:rotate-180"></ion-icon>
                        More Comment
                    </button> */}

                </div>


                {/* <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">

                    <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-6 h-6 rounded-full" />

                    <div class="flex-1 relative overflow-hidden h-10">
                        <textarea placeholder="Add Comment...." rows="1" class="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"></textarea>

                        <div class="!top-2 pr-2" uk-drop="pos: bottom-right; mode: click">
                            <div class="flex items-center gap-2" uk-scrollspy="target: > svg; cls: uk-animation-slide-right-small; delay: 100 ;repeat: true">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-sky-600">
                                    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-pink-600">
                                    <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                                </svg>
                            </div>
                        </div>


                    </div>


                    <button type="submit" class="text-sm rounded-full py-1.5 px-3.5 bg-secondery"> Replay</button>
                </div> */}

            </div>
        )}

        <div class="hidden lg:p-20 z-[1] uk- open" id="create-status" uk-modal="">

            <div class="uk-modal-dialog tt relative overflow-auto mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark2">

                <div class="space-y-5 mt-3 p-2">
                    <MentionsInput
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder='Add comment!'
                        className="w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-small !text-sm dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800"
                        style={{ padding: "10px", width: "100%" }}
                    >
                        <Mention
                            trigger="@"
                            data={userList}
                            displayTransform={(id, display) => `${display}`}
                            renderSuggestion={(suggestion) => (
                                <span style={{ padding: "2px", cursor: "pointer" }} className='w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-small !text-xl dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800'>
                                    {suggestion.display}
                                </span>
                            )}
                        />
                    </MentionsInput>
                </div>



                {id && <RetweetView id={id} />}

                <div class="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">
                    <label htmlFor="file-upload" className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900 cursor-pointer">
                        <ion-icon name="image" className="text-base"></ion-icon>
                        Image
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                    <button type="button" class="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100 dark:bg-teal-950 dark:border-teal-900">
                        <ion-icon name="videocam" class="text-base"></ion-icon>
                        Video
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
                        {/* <label htmlFor="file-upload" className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900 cursor-pointer">
                                <ion-icon name="image" className="text-base"></ion-icon>
                                Image
                                
                            </label> */}
                        <button type="" onClick={()=>console.log('Here we are')} class="button bg-blue-500 text-white py-2 px-12 text-[14px]"> Create
                        </button>
                    </div>
                </div>

            </div>

        </div>


    </>
    )
}

export default TweetView