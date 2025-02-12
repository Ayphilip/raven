import React, { createContext, useContext, useState, useEffect } from "react";

import { 
    createTweet, 
    getTweet, 
    getAllTweet, 
    likeTweets, 
    retweet 
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
            await likeTweets(tweetId, userId);
            fetchTweets();
        } catch (error) {
            console.error("Error liking tweet:", error);
        }
    };

    const retweetTweet = async (tweetId, userId) => {
        try {
            await retweet(tweetId, userId);
            fetchTweets();
        } catch (error) {
            console.error("Error retweeting:", error);
        }
    };

    return (
        <TweetContext.Provider value={{ tweets, loading, addTweet, likeTweet, retweetTweet }}>
            {children}
        </TweetContext.Provider>
    );
};

export const useTweets = () => {
    return useContext(TweetContext);
};
