import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

const OtherContext = createContext();

export const OtherProvider = ({ children }) => {
    const [token, setToken] = useState([]);
    const [nft, setNft] = useState([])
    const [ptoken, setptoken] = useState('RTT')
    const [tokenBal, setTokenBal] = useState(0)
    const [loadingOthers, setLoading] = useState(false);


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
                console.log(number)
                if(storedTkn) setptoken(storedTkn);
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
            const tos = data.to ? data.to : '0x5EC9131EDF77163093116c98Ccbc2e74DaAc2A8A';
            const transData = {
                from: data.from,
                to: tos,
                amount: data.amount,
                symbol: data.symbol
            }
            const repon = await axios.post("/api/tokens/transfer", transData);
            const {success} = repon.data
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
            console.log(data)
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

    const likeOther = async (OtherId, userId) => {
        try {
            // fetchOthers();
            setOthers(prevOthers =>
                prevOthers.map(Other =>
                    Other.OtherId === OtherId
                        ? {
                            ...Other,
                            likes: Other.likes.includes(userId)
                                ? Other.likes.filter(id => id !== userId) // Unlike
                                : [...Other.likes, userId] // Like
                        }
                        : Other
                )
            );
            const response = await axios.post("/api/Others/like", { OtherId, userId })

        } catch (error) {
            console.error("Error liking Other:", error);
        }
    };

    const reOtherOther = async (OtherId, userId) => {
        try {
            const response = await axios.post("/api/Others/reOther", { OtherId, userId })

            setOthers(prevOthers =>
                prevOthers.map(Other =>
                    Other.OtherId === OtherId
                        ? {
                            ...Other,
                            reOthers: Other.reOthers.includes(userId)
                                ? Other.reOthers.filter(id => id !== userId) // Unlike
                                : [...Other.reOthers, userId] // Like
                        }
                        : Other
                )
            );
        } catch (error) {
            console.error("Error reOthering:", error);
        }
    };

    return (
        <OtherContext.Provider value={{ token, nft, ptoken, tokenBal, loadingOthers, makeTransfer, mintToken, fetchOthers, reOtherOther }}>
            {children}
        </OtherContext.Provider>
    );
};

export const useOthers = () => {
    return useContext(OtherContext);
};
