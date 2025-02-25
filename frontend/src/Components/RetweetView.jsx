import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import formatTimestamp from './timeStamping';
import { useLoginService } from '../services/authenticationService';
import MediaViewer from './MediaViewer';
import { avatars } from './avatars';
import { renderContentWithMentions } from './CapsuleInstance';

function RetweetView({ id, type }) {
    const { tweets, likeTweet, retweetTweet, fetchTweet, addTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();
    const { userDetails, initiateLoginUser, userlogoutService, loading } = useLoginService();
    const [tweet, setTweet] = useState(null)


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

            <a href={'/tweet/' + tweet.tweetId}>

                <div class="sm:px-4 p-2.5 pt-0">
                    <p class="font-normal">{renderContentWithMentions(tweet.content, users, userDetails ? userDetails.username : '')}</p>
                </div>
            </a>


            {tweet.media.length === 3 && <div class="grid sm:grid-cols-3 gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">
                {tweet.media.map((med, index) => (
                    <span key={index} className="w-full">
                        <a className="inline" href="#preview_modal" data-caption={tweet.content} style={{ maxHeight: '20vh' }}>
                            <MediaViewer fileUrl={med} />
                        </a>
                    </span>
                ))}
            </div>}

            {(tweet.media.length === 2 || tweet.media.length === 4) && <div class="grid sm:grid-cols-2 gap-3" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">
                {tweet.media.map((med, index) => (
                    <span key={index} className="w-full">
                        <a className="inline" href="#preview_modal" data-caption={tweet.content} style={{ maxHeight: '20vh' }}>
                            <MediaViewer fileUrl={med} />
                        </a>
                    </span>
                ))}
            </div>}

            {tweet.media.length === 1 &&
                <div class="grid sm:grid-cols-1 gap-1" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">
                    {tweet.media.map((med, index) => (
                        <span key={index} className="w-full">
                            <a className="inline" href="#preview_modal" data-caption={tweet.content} style={{ maxHeight: '20vh' }}>
                                <MediaViewer fileUrl={med} />
                            </a>
                        </span>
                    ))}
                </div>
            }

        </div>
    )
}

export default RetweetView