import React, { createContext, useContext, useState, useEffect } from "react";

import {
    createTweet,
    getTweet,
    getAllTweet,
    retweet,
    likesTweets
} from "../services/tweetServices";

const TweetContext = createContext();

export const TweetProvider = ({ children }) => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        setLoading(true);
        try {
            const allTweets = await getAllTweet();
            setTweets(allTweets);
        } catch (error) {
            console.error("Error fetching tweets:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchTweet = async (id) => {
        setLoading(true);
        try {
            const allTweets = await getTweet(id);
            // console.log(allTweets)
            // setTweet(allTweets);
            return allTweets
        } catch (error) {
            console.error("Error fetching tweets:", error);
        } finally {
            setLoading(false);
        }
    };

    const addTweet = async (data) => {
        try {
            await createTweet(data);
            fetchTweets();
        } catch (error) {
            console.error("Error creating tweet:", error);
        }
    };

    const likeTweet = async (tweetId, userId) => {
        try {
            // fetchTweets();
            setTweets(prevTweets =>
                prevTweets.map(tweet =>
                    tweet.tweetId === tweetId
                        ? {
                            ...tweet,
                            likes: tweet.likes.includes(userId)
                                ? tweet.likes.filter(id => id !== userId) // Unlike
                                : [...tweet.likes, userId] // Like
                        }
                        : tweet
                )
            );
            await likesTweets(tweetId, userId);
        } catch (error) {
            console.error("Error liking tweet:", error);
        }
    };

    const retweetTweet = async (tweetId, userId) => {
        try {
            await retweet(tweetId, userId);
            setTweets(prevTweets =>
                prevTweets.map(tweet =>
                    tweet.tweetId === tweetId
                        ? {
                            ...tweet,
                            retweets: tweet.retweets.includes(userId)
                                ? tweet.retweets.filter(id => id !== userId) // Unlike
                                : [...tweet.retweets, userId] // Like
                        }
                        : tweet
                )
            );
        } catch (error) {
            console.error("Error retweeting:", error);
        }
    };

    return (
        <TweetContext.Provider value={{ tweets, loading, addTweet, likeTweet, fetchTweet, retweetTweet }}>
            {children}
        </TweetContext.Provider>
    );
};

export const useTweets = () => {
    return useContext(TweetContext);
};
