import React, { useState } from 'react'
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

export default function CommentModal({ isOpen, onClose, type, item }) {
    const { userList, users } = useUsers()
    const { addTweet } = useTweets()
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();
    const [content, setContent] = useState('')
    const [visibility, setVisible] = useState(0)
    const [media, setMedia] = useState([])

    const handleFileChange = async (event) => {

        const files = event.target.files;
        if (!files.length) return;

        const fileArray = Array.from(files);

        // Upload files and get URLs
        const uploadedFiles = await Promise.all(fileArray.map(uploadMedia));

        // Store uploaded URLs in state
        setMedia((prevUrls) => [...prevUrls, ...uploadedFiles]);
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
            parent: item.tweetId,
            visibility: visibility,
            mentions: mentionedUserIds,
            type: type
        }
        // console.log(data)

        addTweet(data);
        setVisible(1)
        setContent('')
        setMedia([])
        onClose()

    }

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
                        style={{
                            padding: "12px",
                            width: "100%",
                            // backgroundColor: "#000",
                            color: "#fff",
                            fontSize: "14px",
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
                <div className='p-3'>

                    {item && type == 2 && <RetweetView id={item.tweetId} />}
                </div>
                {/* <DisplayFile fileId={2} /> */}

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

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
                    <div class="flex items-center gap-2 p-5">
                        <button type="submit" disabled={!content && !media.length ? true : false} onClick={saveTweet} class="button bg-blue-500 text-white py-2 px-12 text-[14px]"> reply</button>
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
        startDate: "",
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

                            <input type="date" name="startDate" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} placeholder='Start Date' required />
                            <input type="date" name="endDate" className="w-full p-4 border border-gray-300 rounded-lg" onChange={handleChange} required />
                            <div className="col-span-2 flex justify-between mt-8">
                                <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-400 rounded-lg text-lg">Cancel</button>
                                {loadingSavingQuest ? 
                                <button type="button" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg">Executing...</button>
                                : <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg" disabled={tokenBal < 100 ? true : false}>Submit for 100 RTT</button>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};