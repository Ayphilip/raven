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
import CommentModal, { FileViewTweet } from './Modal';


function TweetView({ tweets }) {
    const { users, userList, addUser, modifyUser } = useUsers();
    const { userDetails, initiateLoginUser, userlogoutService, loading, useBookmark } = useLoginService();
    const { likeTweet, retweetTweet, addTweet } = useTweets();

    const [content, setContent] = useState('')
    const [visibility, setVisible] = useState(0)
    const [media2, setMedia2] = useState([])

    const [id, setId] = useState(null)

    const [type, setType] = useState(0)

    const [itemViewId, setItemViewId] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setMedia2((prevUrls) => [...prevUrls, ...uploadedFiles]);
    };

    const saveRetweet = (tweetId) => {
        retweetTweet(tweetId, userDetails?.username)
    }



    return (<>
        {tweets.map(tweet =>

            <div class="bg-white shadow-sm text-sm font-medium border1 dark:bg-dark1">

                {tweet.retweets.includes(userDetails?.username) ? (
                    <span style={{ fontSize: '12px', padding: '3px', alignItems: 'center', justifyContent: 'center' }} className='p-1'>
                        <ion-icon name="return-up-back-outline"></ion-icon> You reposted
                    </span>
                ) : (
                    (() => {
                        // Find the user from `users` array who is in `tweet.retweets` and has the highest followersCount
                        const topReposter = users
                            .filter(user => tweet.retweets.includes(user.username)) // Get users who retweeted
                            .reduce((max, user) => user.followersCount > max.followersCount ? user : max, { followersCount: 0 });

                        return topReposter.username ? ( // Check if a valid user was found
                            <span style={{ fontSize: '12px', padding: '3px', alignItems: 'center', justifyContent: 'center' }} className='p-1'>
                                <ion-icon name="return-up-back-outline"></ion-icon> {topReposter.name} reposted
                            </span>
                        ) : null;
                    })()
                )}



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
                                {/* <a href="#"> <ion-icon class="text-xl shrink-0" name="bookmark-outline"></ion-icon>  Add to favorites </a>
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="notifications-off-outline"></ion-icon> Mute Notification </a>
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="flag-outline"></ion-icon>  Report this post </a>
                                <a href="#"> <ion-icon class="text-xl shrink-0" name="share-outline"></ion-icon>  Share your profile </a>
                                <hr />
                                <a href="#" class="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon class="text-xl shrink-0" name="stop-circle-outline"></ion-icon>  Unfollow </a> */}
                            </nav>
                        </div>
                    </div>
                </div>


                <div style={{ cursor: 'pointer', padding: '10px' }}>
                    <a href={'/tweet/' + tweet.id}>

                        <div class="sm:px-4 p-2.5 pt-0">
                            <p class="font-normal">{renderContentWithMentions(tweet.content, users, userDetails ? userDetails : '')}</p>
                        </div>
                    </a>

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


                </div>


                {tweet.parent !== 'original' && <RetweetView id={tweet.parent} />}


                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">


                    <div class="flex items-center gap-3"
                        onClick={() => { setType(1); setId(tweet) }}
                    // uk-toggle="target: #create-status"
                    >
                        <button type="button" class="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> </button>
                        <motion.span
                            key={tweet.comments.length}
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
                                        <div onClick={() => saveRetweet(tweet.tweetId)} class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <ion-icon name="repeat-outline" class='text-lg'></ion-icon>
                                                <div class="text-sm"> Undo Repost </div>
                                            </div>
                                        </div> : <div onClick={() => saveRetweet(tweet.tweetId)} class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <ion-icon name="repeat-outline" class='text-lg'></ion-icon>
                                                <div class="text-sm">  Repost </div>
                                            </div>
                                        </div>}
                                </label>
                                <label onClick={() => { setType(2); setId(tweet) }}>
                                    <div class="relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            <ion-icon name="create-outline"></ion-icon>
                                            <div class="text-sm"> Quote </div>
                                        </div>
                                    </div>
                                </label>
                                <label>
                                    <div class="relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            <ion-icon name="bar-chart-outline"></ion-icon>
                                            <div class="text-sm">View Quote </div>
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



            </div>
        )}


        <FileViewTweet isOpen={itemViewId !== null} tweetId={itemViewId} onClose={() => setItemViewId(null)} />
        <CommentModal isOpen={id !== null} type={type} item={id} onClose={() => setId(null)} />





    </>
    )
}

const style = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  z-index: '10000',
  align-items: center;
  justify-content: center;

  
}
.modal-container {
  background: black;
  color: white;
  width: 500px;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}
.drafts {
  color: #1d9bf0;
  cursor: pointer;
}
.tweet-section {
  display: flex;
  gap: 10px;
}
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.user-name {
  font-weight: bold;
}
.user-handle {
  color: gray;
  font-size: 14px;
}
.tweet-text {
  margin: 5px 0;
}
.replying-to {
  color: #1d9bf0;
  font-size: 14px;
}
.reply-section {
  display: flex;
  gap: 10px;
  align-items: center;
}
.reply-input {
  width: 100%;
  background: black;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icons button {
  background: none;
  border: none;
  color: #1d9bf0;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;
}
.reply-btn {
  background: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = style;
document.head.appendChild(styleSheet);

export default TweetView