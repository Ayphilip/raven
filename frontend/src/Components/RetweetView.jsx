import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import formatTimestamp from './timeStamping';
import { useLoginService } from '../services/authenticationService';
import MediaViewer from './MediaViewer';
import { avatars } from './avatars';
import { renderContentWithMentions } from './CapsuleInstance';
import { FileViewTweet } from './Modal';

function RetweetView({ id, type }) {
    const { tweets, likeTweet, retweetTweet, fetchTweet, addTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();
    const { userDetails, initiateLoginUser, userlogoutService, loading } = useLoginService();
    const [tweet, setTweet] = useState(null)

    const [itemViewId, setItemViewId] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const getTweet = async () => {
            // console.log(id)
            try {
                const fetchedTweet = await fetchTweet(id); // Wait for the promise to resolve
                // console.log(fetchedTweet)
                setTweet(fetchedTweet); // Store the resolved tweet
            } catch (error) {
                console.error('Error fetching tweet:', error);
            }
        };

        if (id) getTweet();


        return () => {

        }
    }, [id])

    return (
        tweet &&
        <div style={{ width: type === 'full' ? '100%' : '80%', justifySelf: 'flex-end' }} class="bg-white shadow-sm text-sm font-medium border1 dark:bg-dark1">


            {userDetails && <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                {users.filter(use => use.username === tweet.userId).map(use => <>
                    <a href={"/timeline/" + use.username}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                    <div class="flex-1">
                        <a href={"/timeline/" + use.username}> <h4 class="text-black dark:text-white"> {use.name} </h4> </a>
                        <div class="text-xs text-gray-500 dark:text-white/80">{formatTimestamp(tweet.createdAt)}</div>
                    </div>
                </>)}


            </div>}

            <div style={{ cursor: 'pointer' }}>
                <a href={'/tweet/' + tweet.id}>

                    <div class="sm:px-4 p-2.5 pt-0">
                        <p class="font-normal">{renderContentWithMentions(tweet.content, users, userDetails ? userDetails : '')}</p>
                    </div>
                </a>
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

            <FileViewTweet isOpen={itemViewId !== null} tweetId={itemViewId} onClose={() => setItemViewId(null)} />

        </div>
    )
}

export default RetweetView