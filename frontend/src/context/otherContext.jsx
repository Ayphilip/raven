import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

const OtherContext = createContext();

export const OtherProvider = ({ children }) => {
    const [token, setToken] = useState([]);
    const [nft, setNft] = useState([])
    const [ptoken, setptoken] = useState('RTT')
    const [tokenBal, setTokenBal] = useState(0)
    const [notification, setNotifivcations] = useState([])
    const [loadingOthers, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null)


    useEffect(() => {
        fetchOthers();
    }, []);

    const fetchOthers = async () => {
        setLoading(true);
        try {
            const storedTkn = Cookies.get("ptoken");
            const storedUser = Cookies.get("userDetails");

            if (storedUser) {
                const data = JSON.parse(storedUser);
                const response = await axios.get(`/api/tokens/balance/${data?.username}/${storedTkn ? storedTkn : ptoken}`);
                var number = response.data;
                const responseNot = await axios.get(`/api/notifications/${data?.username}`)
                const notificationData = responseNot.data
                // console.log(notificationData)
                setNotifivcations(notificationData.notifications)
                if (storedTkn) setptoken(storedTkn);
                setTokenBal(number.balance);
            }

            // Fetch token and NFT data concurrently
            const [responseToken, responseNft] = await Promise.all([
                axios.get("/api/tokens"),
                axios.get("/api/nfts")
            ]);

            setToken(responseToken.data);
            setNft(responseNft.data);
        } catch (error) {
            console.error("Error fetching Others:", error.response ?? error.message);
        } finally {
            setLoading(false);
        }
    };

    const makeTransfer = async (data) => {
        setLoading(true);
        try {
            const froms = data.from ? data.from : '0x5EC9131EDF77163093116c98Ccbc2e74DaAc2A8A';
            const tos = data.to ? data.to : '0x5EC9131EDF77163093116c98Ccbc2e74DaAc2A8A';
            const transData = {
                from: froms,
                to: tos,
                amount: data.amount,
                symbol: data.symbol
            }
            const repon = await axios.post("/api/tokens/transfer", transData);
            const { success } = repon.data
            fetchOthers()

            // console.log(allOthers)
            // setOther(allOthers);
            return success
        } catch (error) {
            console.error("Error fetching Others:", error);
        } finally {
            setLoading(false);
        }
    };

    const mintToken = async (data) => {
        try {
            // console.log(data)
            const response = await axios.post("/api/tokens/mint", {
                address: data.userId,
                amount: data.amount,
                symbol: data.symbol
            })
            fetchOthers();
        } catch (error) {
            console.error("Error creating Other:", error);
        }
    };

    const mintNft = async (data) => {
        try {
            console.log(data)
            const response = await axios.post("/api/nfts/mint", {
                collectionName: data.collect,
                owner: data.userId,
                metadata: data.metadata
            })
            fetchOthers();
        } catch (error) {
            console.error("Error creating Nft:", error);
        }
    };

    const createNotification = async (message, type, userId) => {
        try {
            // fetchOthers();
            //type 0 = tweet information
            //type 1 = message information

            const response = await axios.post("/api/notifications/send", { message, type, userId })

        } catch (error) {
            console.error("Error liking Other:", error);
        }
    };

    const markNotification = async (userId) => {
        try {
            await axios.patch("/api/notifications/read", { userId })
            fetchOthers()


        } catch (error) {
            console.error("Error reOthering:", error);
        }
    };

    const makeSearch = async(word) => {
        try {
            const result = await axios.post(`/api/search?query=${word}`)
            console.log(result.data)
            setSearchResult(result.data)
        } catch (error) {
            console.error("Error conducting search:", error);
        }
    }

    return (
        <OtherContext.Provider value={{ token, nft, ptoken, tokenBal, loadingOthers, notification, makeTransfer, 
        mintToken, fetchOthers, createNotification, markNotification, mintNft, makeSearch, searchResult }}>
            {children}
        </OtherContext.Provider>
    );
};

export const useOthers = () => {
    return useContext(OtherContext);
};
