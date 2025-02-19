import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import formatTimestamp from './timeStamping';
import { useLoginService } from '../services/authenticationService';
import MediaViewer from './MediaViewer';
import { avatars } from './avatars';

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

        if(id) getTweet();


        return () => {

        }
    }, [id])

    return (
        tweet && 
        <div style={{width: type === 'full' ? '100%' : '80%', justifySelf: 'flex-end'}} class="bg-white shadow-sm text-sm font-medium border1 dark:bg-dark1">


            {userDetails && <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                {users.filter(use => use.username === tweet.userId).map(use => <>
                    <a href={"/timeline/"+use.username}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                    <div class="flex-1">
                        <a href={"/timeline/"+use.username}> <h4 class="text-black dark:text-white"> {userDetails.username === tweet.userId ? 'You' : use.name} </h4> </a>
                        <div class="text-xs text-gray-500 dark:text-white/80">{formatTimestamp(tweet.createdAt)}</div>
                    </div>
                </>)}

                
            </div>}

            <a href={'/tweet/'+tweet.tweetId}>

            <div class="sm:px-4 p-2.5 pt-0">
                <p class="font-normal"> {tweet.content} </p>
            </div>
            </a>


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

        </div>
    )
}

export default RetweetView