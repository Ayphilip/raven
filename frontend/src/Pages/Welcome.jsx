import React, { useEffect, useRef, useState } from 'react'
import Headers from '../Components/Headers'
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

function Welcome() {

    const { tweets, likeTweet, retweetTweet, addTweet } = useTweets();
    const { users, userList, addUser, modifyUser } = useUsers();





    const fileInputRef = useRef(null);

    const { address, isLoading, isLoginError, logout, revalidate } = useAddress();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();



    const [content, setContent] = useState('')
    const [visibility, setVisible] = useState(0)
    const [media, setMedia] = useState([])


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

        const files = event.target.files;
        if (!files.length) return;

        const fileArray = Array.from(files);

        // Upload files and get URLs
        const uploadedFiles = await Promise.all(fileArray.map(uploadMedia));

        // Store uploaded URLs in state
        setMedia((prevUrls) => [...prevUrls, ...uploadedFiles]);
    };

    const handleFileChanges = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        const fileArray = Array.from(files);

        // Function to upload file and get file ID
        const uploadFile = async (file) => {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post("http://localhost:22045/api/fileUpload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                return response.data.fileId; // Return file ID
            } catch (error) {
                console.error("Upload failed:", error);
                return null;
            }
        };

        // Upload files and store file IDs
        const uploadedFileIds = await Promise.all(fileArray.map(uploadFile));

        // Remove null values (failed uploads) and update state
        setMedia((prevIds) => [...prevIds, ...uploadedFileIds.filter(Boolean)]);
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
            media: media,
            parent: 'original',
            visibility: visibility,
            mentions: mentionedUserIds,
            type: 0
        }
        // console.log(data)

        addTweet(data);
        setVisible(1)
        setContent('')
        setMedia([])

    }


    useEffect(() => {

        return () => {

        }
    }, [])

    return (
        <div>
            <div>


                {/* <Headers /> */}


                <Sidbar ps={1} />


                <main id="site__main" class="2xl:ml-[--w-side] z-[100]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">


                    <div class="lg:flex 2xl:gap-16 gap-12 max-w-[1065px] mx-auto" id="js-oversized">

                        <div class="w-[680px] mx-auto">


                            <div class="md:max-w-[580px] mx-auto flex-1">


                                <div class="bg-white shadow-sm md:p-4 p-2 space-y-4 text-sm font-medium border1 dark:bg-dark1">

                                    <div class="space-y-5 mt-3 p-2">
                                        <MentionsInput
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="What is happening?!"
                                            style={{
                                                padding: "12px",
                                                width: "100%",
                                                // backgroundColor: "#000",
                                                color: "#fff",
                                                fontSize: "22px",
                                                borderRadius: "8px",
                                                // border: "1px solid #444",
                                                outline: "none",
                                                minHeight: "40px",
                                                resize: "none",
                                            }}
                                        >
                                            <Mention
                                                trigger="@"
                                                data={userList}
                                                displayTransform={(id, display) => `${display}`}
                                                renderSuggestion={(suggestion, search, highlighted) => (
                                                    <span
                                                        style={{
                                                            padding: "8px 12px",
                                                            cursor: "pointer",
                                                            backgroundColor: highlighted ? "#1DA1F2" : "#222", // Highlighted item in blue
                                                            color: highlighted ? "#fff" : "#ccc", // White text when highlighted
                                                            borderRadius: "6px",
                                                            display: "block",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {suggestion.display}
                                                    </span>
                                                )}
                                            />
                                        </MentionsInput>
                                        {/* <textarea class="w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800" name="" id="" onChange={(e) => setContent(e.target.value)} value={content} placeholder="What do you have in mind?"></textarea> */}
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

                                        <label class="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100 dark:bg-teal-950 dark:border-teal-900 cursor-pointer">
                                            <ion-icon name="videocam" class="text-base"></ion-icon>
                                            Video
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
                                            <button type="submit" disabled={!content && !media.length ? true : false} onClick={saveTweet} class="button bg-blue-500 text-white py-2 px-12 text-[14px]"> Post</button>
                                        </div>
                                    </div>

                                </div>





                                {tweets.length && <TweetView tweets={tweets} />}

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






            <div class="hidden lg:p-20 max-lg:!items-start" id="preview_modal" uk-modal="">

                <div class="uk-modal-dialog tt relative mx-auto overflow-hidden shadow-xl rounded-lg lg:flex items-center ax-w-[86rem] w-full lg:h-[80vh]">


                    <div class="lg:h-full lg:w-[calc(100vw-400px)] w-full h-96 flex justify-center items-center relative">

                        <div class="relative z-10 w-full h-full">
                            <img src="assets/images/post/post-1.jpg" alt="" class="w-full h-full object-cover absolute" />
                        </div>


                        <button type="button" class="bg-white rounded-full p-2 absolute right-0 top-0 m-3 uk-animation-slide-right-medium z-10 dark:bg-slate-600 uk-modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>


                    <div class="lg:w-[400px] w-full bg-white h-full relative  overflow-y-auto shadow-xl dark:bg-dark2 flex flex-col justify-between">

                        <div class="p-5 pb-0">


                            <div class="flex gap-3 text-sm font-medium">
                                <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-9 h-9 rounded-full" />
                                <div class="flex-1">
                                    <h4 class="text-black font-medium dark:text-white"> Steeve </h4>
                                    <div class="text-gray-500 text-xs dark:text-white/80"> 2 hours ago</div>
                                </div>


                                <div class="-m-1">
                                    <button type="button" class="button__ico w-8 h-8"> <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon> </button>
                                    <div class="w-[253px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true">
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

                            <p class="font-normal text-sm leading-6 mt-4"> Photography is the art of capturing light with a camera.  it can be fun, challenging. It can also be a hobby, a passion. 📷 </p>

                            <div class="shadow relative -mx-5 px-5 py-3 mt-3">
                                <div class="flex items-center gap-4 text-xs font-semibold">
                                    <div class="flex items-center gap-2.5">
                                        <button type="button" class="button__ico text-red-500 bg-red-100 dark:bg-slate-700"> <ion-icon class="text-lg" name="heart"></ion-icon> </button>
                                        <a href="#">1,300</a>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <button type="button" class="button__ico bg-slate-100 dark:bg-slate-700"> <ion-icon class="text-lg" name="chatbubble-ellipses"></ion-icon> </button>
                                        <span>260</span>
                                    </div>
                                    <button type="button" class="button__ico ml-auto"> <ion-icon class="text-xl" name="share-outline"></ion-icon> </button>
                                    <button type="button" class="button__ico"> <ion-icon class="text-xl" name="bookmark-outline"></ion-icon> </button>
                                </div>
                            </div>

                        </div>

                        <div class="p-5 h-full overflow-y-auto flex-1">


                            <div class="relative text-sm font-medium space-y-5">

                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Steeve </a>
                                        <p class="mt-0.5">What a beautiful, I love it. 😍 </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Monroe </a>
                                        <p class="mt-0.5">   You captured the moment.😎 </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-7.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Alexa </a>
                                        <p class="mt-0.5"> This photo is amazing!   </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> John  </a>
                                        <p class="mt-0.5"> Wow, You are so talented 😍 </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Michael </a>
                                        <p class="mt-0.5"> I love taking photos   🌳🐶</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Monroe </a>
                                        <p class="mt-0.5">  Awesome. 😊😢 </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Jesse </a>
                                        <p class="mt-0.5"> Well done 🎨📸   </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Steeve </a>
                                        <p class="mt-0.5">What a beautiful, I love it. 😍 </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-7.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Alexa </a>
                                        <p class="mt-0.5"> This photo is amazing!   </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-4.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> John  </a>
                                        <p class="mt-0.5"> Wow, You are so talented 😍 </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-5.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Michael </a>
                                        <p class="mt-0.5"> I love taking photos   🌳🐶</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 relative">
                                    <img src="assets/images/avatars/avatar-3.jpg" alt="" class="w-6 h-6 mt-1 rounded-full" />
                                    <div class="flex-1">
                                        <a href="#" class="text-black font-medium inline-block dark:text-white"> Monroe </a>
                                        <p class="mt-0.5">  Awesome. 😊😢 </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div class="bg-white p-3 text-sm font-medium flex items-center gap-2">

                            <img src="assets/images/avatars/avatar-2.jpg" alt="" class="w-6 h-6 rounded-full" />

                            <div class="flex-1 relative overflow-hidden ">
                                <textarea placeholder="Add Comment...." rows="1" class="w-full resize-  px-4 py-2 focus:!border-transparent focus:!ring-transparent resize-y"></textarea>

                                <div class="flex items-center gap-2 absolute bottom-0.5 right-0 m-3">
                                    <ion-icon class="text-xl flex text-blue-700" name="image"></ion-icon>
                                    <ion-icon class="text-xl flex text-yellow-500" name="happy"></ion-icon>
                                </div>

                            </div>

                            <button type="submit" class="hidden text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"> Replay</button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Welcome