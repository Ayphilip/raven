import React, { useEffect, useRef, useState } from 'react'
import Sidbar from '../Components/Sidbar'
import { useNavigate } from 'react-router-dom';
import { useLoginService } from '../services/authenticationService';
import { avatars, view } from '../Components/avatars';
import { uploadMedia } from '../services/uploadServices';
import { createTweet } from '../services/tweetServices';
import axios from 'axios';
import DisplayFile from '../Components/DisplayFile';
import MediaViewer from '../Components/MediaViewer';
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import formatTimestamp from '../Components/timeStamping';
import RetweetView from '../Components/RetweetView';
import TweetView from '../Components/TweetView';
import { Mention, MentionsInput } from 'react-mentions';
import Sid2bar from '../Components/Sid2bar';
import { useAddress } from '@chopinframework/react';
import Headers from '../Components/Headers';

function Welcome() {

    const { tweets, likeTweet, retweetTweet, addTweet } = useTweets();
    const { users, userList, addUser, modifyUser } = useUsers();
    const [preview, setPreview] = useState(null);





    const fileInputRef = useRef(null);
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const { address, isLoading, isLoginError, logout, revalidate } = useAddress();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();



    const [content, setContent] = useState('')
    const [visibility, setVisible] = useState(0)
    const [media, setMedia] = useState([])
    const [loadingFileUpload, setLoadingFileUpload] = useState(false)


    const navigate = useNavigate();

    const handleFileSelection = () => {
        alert('Here')
        if (fileInputRef.current) {
            alert('Here')
            fileInputRef.current.click();
        }
    };

    const justClick = () => {
        alert('Clicked')
    }

    // Function to handle file selection and upload
    const handleFileChange = async (event) => {
        setLoadingFileUpload(true)

        const files = event.target.files;
        if (!files.length) return;

        const fileArray = Array.from(files);

        // Upload files and get URLs
        const uploadedFiles = await Promise.all(fileArray.map(uploadMedia));

        // Store uploaded URLs in state
        setMedia((prevUrls) => [...prevUrls, ...uploadedFiles]);
        setLoadingFileUpload(false)
    };

    // const handleFileChanges = async (event) => {
    //     const files = event.target.files;
    //     if (!files.length) return;

    //     const fileArray = Array.from(files);

    //     // Function to upload file and get file ID
    //     const uploadFile = async (file) => {
    //         try {
    //             const formData = new FormData();
    //             formData.append("file", file);

    //             const response = await axios.post("http://localhost:22045/api/fileUpload", formData, {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //             });

    //             return response.data.fileId; // Return file ID
    //         } catch (error) {
    //             console.error("Upload failed:", error);
    //             return null;
    //         }
    //     };

    //     // Upload files and store file IDs
    //     const uploadedFileIds = await Promise.all(fileArray.map(uploadFile));

    //     // Remove null values (failed uploads) and update state
    //     setMedia((prevIds) => [...prevIds, ...uploadedFileIds.filter(Boolean)]);
    // };

    const extractMentions = (text) => {
        const mentionedUsers = [];
        userList?.forEach((user) => {
            if (text.includes(user.display)) {
                mentionedUsers.push(user.id);
            }
        });
        return mentionedUsers;
    };

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




    const saveTweet = () => {
        // alert('About Saving')
        const mentionedUserIds = extractMentions(content);
        const data = {
            userId: userDetails.username,
            content: content,
            media: media,
            parent: 'original',
            preview: preview,
            visibility: visibility,
            mentions: mentionedUserIds,
            type: 0
        }
        // console.log(data)

        addTweet(data);
        setVisible(1)
        setContent('')
        setPreview(null)
        setMedia([])

    }


    useEffect(() => {
        document.title = 'Home / Raven'

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

        <div id="wrapper">


            <Sidbar ps={1} />


            <main id="site__main" class="2xl:ml-[--w-side] z-[100]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">


                <div class="lg:flex 2xl:gap-16 gap-12 max-w-[1065px] mx-auto" id="js-oversized">

                    <div class="mx-auto">


                        <div class="mx-auto flex-1">


                            <div class="bg-white shadow-sm md:p-4 p-2 h-[100vh] space-y-4 text-sm font-medium border1 dark:bg-dark1">

                                <div class="space-y-5 mt-3 p-2">
                                    <div>

                                        <MentionsInput
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="What is happening?!"
                                            className='bg-white dark:bg-dark1'
                                            style={{
                                                padding: "12px",
                                                width: "100%",
                                                fontSize: "22px",
                                                outline: "none",
                                                minHeight: "40px",
                                                resize: "none",
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
                                                    maxHeight: "150px",  // ✅ Set max height for scrolling
                                                    overflowY: "auto",   // ✅ Enable scrolling
                                                    width: "250px",      // ✅ Adjust width to fit content
                                                }}
                                            />
                                        </MentionsInput>
                                    </div>


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






                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {media.map(meds =>
                                        <div style={{ width: 10 + 'vw', padding: 10, borderRadius: 30 }}>
                                            <MediaViewer fileUrl={meds} />
                                        </div>
                                    )}
                                </div>
                                {/* <DisplayFile fileId={2} /> */}

                                <div class="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">

                                    <label htmlFor="file-upload" className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900 cursor-pointer">
                                        <ion-icon name="image" className="text-base"></ion-icon>

                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    <label class="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100 dark:bg-teal-950 dark:border-teal-900 cursor-pointer">
                                        <ion-icon name="videocam" class="text-base"></ion-icon>

                                        <input

                                            type="file"
                                            multiple
                                            accept="video/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>




                                </div>

                                <div class="p-5 flex justify-between items-center">
                                    <div style={{ flexDirection: 'row', display: 'flex' }}>
                                        <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />
                                        <button class="inline-flex items-center py-1 px-2.5 gap-1 font-medium text-sm rounded-full bg-slate-50 border-2 border-slate-100 group aria-expanded:bg-slate-100 aria-expanded: dark:text-white dark:bg-slate-700 dark:border-slate-600" type="button">
                                            {view[visibility]}
                                            <ion-icon name="chevron-down-outline" class="text-base duration-500 group-aria-expanded:rotate-180"></ion-icon>
                                        </button>

                                        <div class="p-2 bg-white rounded-lg shadow-lg text-black font-medium border border-slate-100 w-60 dark:bg-slate-700"
                                            uk-drop="offset:10;pos: bottom-left; reveal-left;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left ; mode:click">

                                            <form>
                                                <label onClick={() => setVisible(0)}>
                                                    <input type="radio" name="radio-status" id="monthly1" class="peer appearance-none hidden" checked={visibility === 0} />
                                                    <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                        <div class="text-sm">  Everyone </div>
                                                        <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                                    </div>
                                                </label>
                                                <label onClick={() => setVisible(1)}>
                                                    <input type="radio" name="radio-status" id="monthly1" class="peer appearance-none hidden" checked={visibility === 1} />
                                                    <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                        <div class="text-sm"> Friends </div>
                                                        <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                                    </div>
                                                </label>
                                                <label onClick={() => setVisible(2)}>
                                                    <input type="radio" name="radio-status" id="monthly" class="peer appearance-none hidden" checked={visibility === 2} />
                                                    <div class=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                        <div class="text-sm"> Only me </div>
                                                        <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up"></ion-icon>
                                                    </div>
                                                </label>
                                            </form>

                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button type="submit" disabled={loadingFileUpload || (!content && !media.length) ? true : false} onClick={saveTweet} class="button bg-blue-500 text-white py-2 px-12 text-[14px]"> {loadingFileUpload ? '...uploading' : 'Post'}</button>
                                    </div>
                                </div>

                            </div>





                            {tweets.length && <TweetView tweets={tweets.filter(tweet => tweet.type !== 1)} />}

                            {!tweets.length && <div>No Post or Tweet</div>}

                            {/* <div class="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/40 animate-pulse border1 dark:bg-dark2">

                                    <div class="flex gap-3">
                                        <div class="w-9 h-9 rounded-full bg-slate-300/20"></div>
                                        <div class="flex-1 space-y-3">
                                            <div class="w-40 h-5 rounded-md bg-slate-300/20"></div>
                                            <div class="w-24 h-4 rounded-md bg-slate-300/20"></div>
                                        </div>
                                        <div class="w-6 h-6 rounded-full bg-slate-300/20"></div>
                                    </div>

                                    <div class="w-full h-52 rounded-lg bg-slate-300/10 my-3"> </div>

                                    <div class="flex gap-3">

                                        <div class="w-16 h-5 rounded-md bg-slate-300/20"></div>

                                        <div class="w-14 h-5 rounded-md bg-slate-300/20"></div>

                                        <div class="w-6 h-6 rounded-full bg-slate-300/20 ml-auto"></div>
                                        <div class="w-6 h-6 rounded-full bg-slate-300/20  "></div>
                                    </div>

                                </div> */}


                        </div>

                    </div>


                    <Sid2bar ps={1} />

                </div>

            </main >

        </div >












    )
}

export default Welcome