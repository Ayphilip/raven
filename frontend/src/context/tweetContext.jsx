import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useOthers } from "./otherContext";
import { useUsers } from "./userContext";
import { getTopWords } from "../Components/CapsuleInstance";

const TweetContext = createContext();

export const TweetProvider = ({ children }) => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [topWords, setTopWords] = useState(null)
    const { createNotification } = useOthers()
    const { fetchUser } = useUsers()


    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        setLoading(true);
        try {
            const allTweets = await axios.get("/api/tweets")
            const resp = getTopWords(allTweets.data)
            
            setTopWords(resp)
            // getAllTweet();
            setTweets(allTweets.data);

        } catch (error) {
            console.error("Error fetching tweets:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchTweet = async (id) => {
        setLoading(true);
        try {
            const allTweets = await axios.get("/api/tweets/" + id)
            // console.log(allTweets)
            // setTweet(allTweets);
            return allTweets.data
        } catch (error) {
            console.error("Error fetching tweets:", error);
        } finally {
            setLoading(false);
        }
    };

    const addTweet = async (data) => {
        try {
            // console.log(data)
            const response = await axios.post("/api/tweets", {
                userId: data.userId,
                content: data.content,
                media: data.media,
                parent: data.parent,
                visibility: data.visibility,
                mentions: data.mentions,
                type: data.type
            })
            // const user = await fetchUser(data.userId);

            // mentions.forEach(element => {
            // await createNotification()
            // });

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
            const response = await axios.post("/api/tweets/like", { tweetId, userId })

        } catch (error) {
            console.error("Error liking tweet:", error);
        }
    };

    const retweetTweet = async (tweetId, userId) => {
        try {
            const response = await axios.post("/api/tweets/retweet", { tweetId, userId })

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
        <TweetContext.Provider value={{ tweets, loading, addTweet, likeTweet, fetchTweet, retweetTweet, topWords }}>
            {children}
        </TweetContext.Provider>
    );
};

export const useTweets = () => {
    return useContext(TweetContext);
};
