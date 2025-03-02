import React, { useEffect, useState } from 'react'
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { Mention, MentionsInput } from 'react-mentions';
import MediaViewer from './MediaViewer';
import { avatars, view } from './avatars';
import RetweetView from './RetweetView';
import { useTweets } from '../context/tweetContext';
import { encryptText, renderContentWithMentions } from './CapsuleInstance';
import { useOthers } from '../context/otherContext';
import { uploadMedia } from '../services/uploadServices';
import formatTimestamp from './timeStamping';
import { motion } from "motion/react"

export default function CommentModal({ isOpen, onClose, type, item }) {
    const { userList, users } = useUsers()
    const { addTweet } = useTweets()
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();
    const [content, setContent] = useState('')
    const [visibility, setVisible] = useState(0)
    const [media3, setMedia3] = useState([])
    const [preview, setPreview] = useState(null);

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const fetchPreview = async (url) => {
        try {
            console.log(url)
            const response = await fetch(`/api/search/url?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data)
            setPreview(data);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    const handleFileChangeModal = async (event) => {

        const files = event.target.files;
        if (!files.length) return;

        const fileArray = Array.from(files);



        // Upload files and get URLs
        const uploadedFiles = await Promise.all(fileArray.map(uploadMedia));

        // Store uploaded URLs in state
        setMedia3((prevUrls) => [...prevUrls, ...uploadedFiles]);
    };

    const extractMentions = (text) => {
        const mentionedUsers = [];
        userList?.forEach((user) => {
            if (text.includes(user.display)) {
                mentionedUsers.push(user.id);
            }
        });
        return mentionedUsers;
    };




    const saveTweet = () => {
        // alert('About Saving')
        const mentionedUserIds = extractMentions(content);
        const data = {
            userId: userDetails.username,
            content: content,
            media: media3,
            preview: preview,
            parent: item.tweetId,
            visibility: visibility,
            mentions: mentionedUserIds,
            type: type
        }
        // console.log(data)

        addTweet(data);
        setVisible(1)
        setPreview(null)
        setContent('')
        setMedia3([])
        onClose()

    }

    if (!isOpen) return null;

    useEffect(() => {

        const match = content.match(urlRegex);
        if (match) {
            fetchPreview(match[0]); // Fetch metadata for first detected URL
        } else {
            setPreview(null);
        }

        return () => {

        }
    }, [content])

    return (

        <div className=" uk-modal lg:p-20 z-[1] uk-open">
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

                    <span></span>

                    <span
                        onClick={onClose}
                        style={{ cursor: 'pointer' }}
                        className="p-5"
                    >
                        <ion-icon name="close-outline"></ion-icon> Exit
                    </span>
                </div>

                {item && type == 1 &&
                    <div class="p-5 flex justify-between items-center">
                        {users.filter(use => item.userId === use.username).map(use =>
                            <div style={{ flexDirection: 'row', display: 'flex' }}>
                                <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />

                                <div style={{ flexDirection: 'column', display: 'flex' }}>

                                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                                        <strong>{use.name}<span
                                            class='text-xs font-medium gap-2 gap-y-0.5 p-2 mt-2'
                                        >@{userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)}</span></strong>
                                        <p class="font-normal">{renderContentWithMentions(item.content, users, userDetails ? userDetails : '')}</p>
                                    </div>

                                    <p className='mt-5' class='text-xs font-medium gap-2 gap-y-0.5 p-2 mt-2'><span>Replying to @{userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)}</span></p>
                                </div>
                            </div>
                        )}
                        <div>
                        </div>
                    </div>
                }



                <div class="p-5 flex">

                    <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />




                    <MentionsInput
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Post a reply!"
                        className='bg-white dark:bg-dark1'
                        style={{
                            padding: "12px",
                            width: "100%",
                            fontSize: "22px",
                            outline: "none",
                            minHeight: "40px",
                            resize: "none",
                            border: "1px solid #333",
                            suggestions: {
                                list: {
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                },
                            },
                        }}
                    >
                        <Mention
                            trigger="@"
                            data={userList}
                            className='bg-white dark:bg-dark1'
                            displayTransform={(id, display) => `${display}`}
                            renderSuggestion={(suggestion, search, highlighted) => (
                                <div
                                    className='bg-white dark:bg-dark1'
                                    style={{
                                        padding: "10px",
                                        cursor: "pointer",

                                    }}
                                >
                                    {suggestion.display}
                                </div>
                            )}

                            style={{
                                borderRadius: "6px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                                maxHeight: "150px",  // ✅ Set max height for scrolling
                                overflowY: "auto",   // ✅ Enable scrolling
                                width: "250px",      // ✅ Adjust width to fit content
                            }}
                        />
                    </MentionsInput>

                    {preview && (
                        <a href={preview.url}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                marginTop: "10px",
                                padding: "10px",
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                            }}
                        >
                            {preview.images ? (
                                <img
                                    src={preview.images[0]}
                                    alt="preview"
                                    style={{ width: "100px", height: "80px", borderRadius: "6px" }}
                                />
                            ) : <img
                                src={preview.favicon}
                                alt="preview"
                                style={{ width: "100px", height: "80px", borderRadius: "6px" }}
                            />}
                            <div>
                                <strong>{preview.title}</strong>
                                <p style={{ fontSize: "14px", color: "#555" }}>{preview.description}</p>
                                <a href={preview.url} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                                    {preview.url}
                                </a>
                            </div>
                        </a>
                    )}



                    {/* <textarea class="w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800" name="" id="" onChange={(e) => setContent(e.target.value)} value={content} placeholder="What do you have in mind?"></textarea> */}



                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {media3.map(meds =>
                        <div style={{ width: 10 + 'vw', padding: 10, borderRadius: 30 }}>
                            <MediaViewer fileUrl={meds} />
                        </div>
                    )}
                </div>
                <div className='p-3'>

                    {item && type == 2 && <RetweetView id={item.tweetId} />}
                </div>

                {/* <DisplayFile fileId={2} /> */}

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <div class="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">

                        <label className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900 cursor-pointer">
                            <ion-icon name="image" className="text-base"></ion-icon>

                            <input

                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChangeModal}
                            />
                        </label>

                        <label class="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100 dark:bg-teal-950 dark:border-teal-900 cursor-pointer">
                            <ion-icon name="videocam" class="text-base"></ion-icon>

                            <input

                                type="file"
                                multiple
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileChangeModal}
                            />
                        </label>

                    </div>
                    <div class="flex items-center gap-2 p-5">
                        <button type="submit" disabled={!content && !media3.length ? true : false} onClick={saveTweet} class="button bg-blue-500 text-white py-2 px-12 text-[14px]"> reply</button>
                    </div>
                </div>






            </div>
        </div>

    );
}

export const QuestFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        questTitle: "",
        description: "",
        reward: "",
        rewardType: "",
        rewardToken: "",
        questContent: "",
        questFace: "",
        entryAmount: "",
        answer: "",
        endDate: "",
    });

    const [file, setFile] = useState(null);

    const { token, tokenBal, ptoken, makeTransfer } = useOthers()
    const { userDetails } = useLoginService()
    const [loadingSavingQuest, setLoadingState] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const makePay2 = () => {

        const data2 = {
            from: userDetails?.username,
            amount: formData.reward,
            to: '',
            symbol: ptoken
        }

        const response = makeTransfer(data2)
        return response;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingState(true)
        const data = {
            from: userDetails?.username,
            amount: 100,
            to: '',
            symbol: ptoken
        }

        const response = makeTransfer(data)

        if (response) {
            // alert('Successfull')
            if (formData.rewardType === '1') {
                const resp = makePay2()

                if (resp) {
                    let fileURL = "";

                    if (file) {
                        // fileURL = URL.createObjectURL(file); // Replace with actual upload logic (e.g., Firebase Storage)

                        fileURL = await uploadMedia(file)
                    }

                    var questAns = encryptText(formData.answer);

                    onSubmit({
                        ...formData,
                        answer: questAns,
                        questFace: fileURL,
                        participants: [],
                        questInstruction: '',
                        clues: [],
                        status: "active",
                        winner: null,
                        creator: userDetails?.username
                    });
                    onClose();
                }
            } else {
                let fileURL = "";

                if (file) {
                    // fileURL = URL.createObjectURL(file); // Replace with actual upload logic (e.g., Firebase Storage)

                    fileURL = await uploadMedia(file)
                }

                var questAns = encryptText(formData.answer);

                onSubmit({
                    ...formData,
                    answer: questAns,
                    questFace: fileURL,
                    participants: [],
                    questInstruction: '',
                    clues: [],
                    status: "active",
                    winner: null,
                    creator: userDetails?.username
                });
                onClose();
            }

        }
        setLoadingState(false)
    };

    if (!isOpen) return null;

    return (
        <div className=" uk-modal lg:p-20 z-[1] uk-open">
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
                        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Create Quest</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <input type="text" name="questTitle" placeholder="Quest Title" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={handleChange} required />
                            <textarea name="description" placeholder="Description" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={handleChange} required />
                            <textarea name="questContent" placeholder="Quest Content" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={handleChange} required />
                            <input type="text" name="answer" placeholder="Correct Answer" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={handleChange} required />
                            <input type="file" name="questFace" className="w-full p-4 border border-gray-300 rounded-lg col-span-2" onChange={handleFileChange} required />
                            <select name="rewardType" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} required>
                                <option value="">Select Reward Type</option>
                                <option value="0">Cumulative</option>
                                <option value="1">Fixed</option>
                            </select>
                            <select name="rewardToken" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} required>
                                <option value="">Select Token</option>
                                {token.map(tkn =>

                                    <option value={tkn.id}>{tkn.id}</option>
                                )}
                            </select>
                            {formData.rewardType === "1" && <input type="number" name="reward" placeholder="Reward" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} required />}
                            {formData.rewardType === "0" && <input type="number" name="entryAmount" placeholder="Entry Amount" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} required />}


                            <div>
                                <label htmlFor='endDate'>End Date</label>
                                <input type="date" name="endDate" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} required />
                            </div>
                            <div className="col-span-2 flex justify-between mt-8">
                                <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-400 rounded-lg text-lg">Cancel</button>
                                {loadingSavingQuest ?
                                    <button type="button" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg">Executing...</button>
                                    : <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg" disabled={formData.rewardType === '1' && (tokenBal < (100 + parseInt(formData.reward))) ? true : tokenBal < 100 ? true : false}>Submit for 100 RTT</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FileViewTweet = ({ tweetId, isOpen, onClose, onSubmit }) => {

    const [tweet, setTweet] = useState(null)
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const [id, setId] = useState(null)

    const [type, setType] = useState(0)

    const isVideo = (url) => {
        const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
        return videoExtensions.some((ext) => url.includes(ext));
    };

    useEffect(() => {
        const readTweet = async () => {
            // const response = await fetchTweet(tweetId)
            const newTweet = tweets.find(tweet => tweet.tweetId === tweetId);
            setTweet(newTweet)
            console.log(newTweet)
        }

        if (tweetId) readTweet()


        return () => {

        }
    }, [tweetId, tweets])

    if (!isOpen) return null;

    return userDetails && tweet && <div class="uk-modal bg-white dark:bg-dark1 max-lg:!items-start uk-open" id="preview_modal" uk-modal="">

        <div class="uk-modal-dialog tt relative mx-auto overflow-hidden rounded-lg lg:flex items-center ax-w-[86rem] w-full lg:h-[100vh]">


            <div class="lg:h-full lg:w-[calc(100vw-400px)] w-full h-100vh flex justify-center items-center relative">




                {tweet.preview && (
                    <a href={tweet.preview.url}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginTop: "10px",
                            padding: "10px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                        }}
                    >
                        {tweet.preview.images ? (
                            <img
                                src={tweet.preview.images[0]}
                                alt="preview"
                                style={{ width: "100px", height: "80px", borderRadius: "6px" }}
                            />
                        ) : <img
                            src={tweet.preview.favicon}
                            alt="preview"
                            style={{ width: "100px", height: "80px", borderRadius: "6px" }}
                        />}
                        <div>
                            <strong>{tweet.preview.title}</strong>
                            <p style={{ fontSize: "14px", color: "#555" }}>{tweet.preview.description}</p>
                            <a href={tweet.preview.url} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                                {tweet.preview.url}
                            </a>
                        </div>
                    </a>
                )}
                <div class="relative z-10 w-full h-full" >

                    <div class="relative" tabindex="-1" uk-slideshow="animation: push">

                        <ul class="uk-slideshow-items" >
                            {tweet.media.map(fileUrl =>

                                <li >
                                    {isVideo(fileUrl) ? (
                                        <video controls autoPlay className="w-full h-full object-cover absolute">
                                            <source src={fileUrl} />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img src={fileUrl} alt="Uploaded" className="w-full h-full object-cover absolute" />
                                    )}
                                </li>
                            )
                            }

                        </ul>


                        <ul class="flex justify-center my-5 uk-dotnav uk-slideshow-nav gap-2.5"></ul>


                        <a class="absolute -translate-y-1/2 bg-white rounded-full top-1/2 -left-4 grid w-9 h-9 place-items-center shadow dark:bg-dark3" href="#" uk-slideshow-item="previous"> <ion-icon name="chevron-back" class="text-2xl"></ion-icon></a>
                        <a class="absolute -right-4 -translate-y-1/2 bg-white rounded-full top-1/2 grid w-9 h-9 place-items-center shadow dark:bg-dark3" href="#" uk-slideshow-item="next"> <ion-icon name="chevron-forward" class="text-2xl"></ion-icon></a>

                    </div>

                </div>




                <button type="button" onClick={onClose} class="bg-white rounded-full p-2 absolute right-0 top-0 m-3 uk-animation-slide-right-medium z-10 dark:bg-slate-600 uk-modal-close">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

            </div>


            <div class="lg:w-[400px] w-full bg-white h-full relative  overflow-y-auto dark:bg-dark2 flex flex-col justify-between">

                <div>
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



                        <div class="sm:px-4 p-2.5 pt-0">
                            <p class="font-normal">{renderContentWithMentions(tweet.content, users, userDetails ? userDetails : '')}</p>
                        </div>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">


                            <div class="flex items-center gap-3">
                                <button type="button" class="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> </button>

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
                                        <label uk-toggle="target: #create-status" onClick={() => { setType(2); setId(tweet) }}>
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
                                    <button onClick={() => likeTweet(tweet.tweetId, userDetails?.username)} type="button" class={tweet?.likes?.includes(userDetails && userDetails.username) ? "button-icon text-red-500 bg-dark-100 dark:bg-slate-700" : "button-icon text-secondary-500 bg-dark-100 dark:bg-slate-700"}> <ion-icon class="text-lg" name="heart"></ion-icon> </button>
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


                        <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">

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


                            <button type="submit" class="text-sm rounded-full py-1.5 px-3.5 bg-secondery"> Reply</button>
                        </div>


                        <div class="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">

                            {tweets?.filter(twee => twee.parent === tweet.tweetId)?.map(comms =>
                                users.filter(use => use.username === comms.userId).map(use =>
                                    <>
                                        <div class="flex items-start gap-3 relative">
                                            <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-6 h-6 mt-1 rounded-full" /> </a>
                                            <div class="flex-1">
                                                <a href={"/timeline/" + use.id} class="text-black font-medium inline-block dark:text-white"> {use.name} </a>

                                                <p class="font-normal">{renderContentWithMentions(comms.content, users, userDetails ? userDetails : '')}</p>

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
                <div></div>

            </div>

        </div>

    </div>
}