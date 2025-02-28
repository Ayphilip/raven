import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { checkUser, handleBookmark } from "./userServices";
import axios from "axios";
import { useAddress } from '@chopinframework/react'
import { useUsers } from "../context/userContext";
import { avatars } from "../Components/avatars";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userDetails, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticate, setAuthenticated] = useState(false);
    // const { addUser } = useUsers();

    const { address, isLoading, isLoginError, login, logout, revalidate } = useAddress();
    // const {fetchUser} = useUsers()


    useEffect(() => {
        // console.log(isLoading)

        // console.log(storedUser)const storedTkn = Cookies.get("ptoken");

        // const initUser = async () => {
        //     if (address) {
        //         const allTweets = await axios.get(`/api/users/${address}`);
        //         setUser(allTweets.data);
        //         setAuthenticated(true);
        //     }
        // }
        // if(address) initUser()
        if (!address) {
            Cookies.remove("userDetails");
        }

        const storedUser = Cookies.get("userDetails");
        // console.log(storedUser)
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setAuthenticated(true);
        }
        // console.log('here')
        setLoading(false);
    }, []);

    function getRandomBetween() {
        return Math.random() * (avatars.length - 0) + 0;
    }

    async function initiateLoginUser(address) {
        setLoading(true);
        // const initId = await genId();
        console.log(address)
        // console.log("Generated ID:", initId);

        var name = getRandomCryptoUsername();

        // const responses = await axios.get('/_chopin/login')
        // var chopinData = responses.data;

        var rands = getRandomBetween();



        const response = await axios.post('/api/users', {
            mode: 'chopin',
            username: address,
            name: name,
            profilePicture: rands.toString(),
            cover: "",
            bio: ""
        });

        // console.log(combineResponse)
        if (response) {
            logins(response.data);
        } else {
            alert('Error')
        }

        setLoading(false);
    }

    const useBookmark = async (userId, user2Id) => {
        try {
            // First, await the API call to ensure success before updating state

            setUser(prevUser => {
                if (!prevUser) return { bookmark: [user2Id] }; // Ensure `prevUser` is defined

                const updatedUser = {
                    ...prevUser,
                    bookmark: Array.isArray(prevUser?.bookmark)
                        ? prevUser?.bookmark?.includes(user2Id)
                            ? prevUser?.bookmark?.filter(id => id !== user2Id) // Unlike
                            : [...prevUser?.bookmark, user2Id] // Like
                        : [user2Id] // Initialize if undefined
                };

                // ✅ Store updated user in cookies inside `setUser`
                Cookies.set("userDetails", JSON.stringify(updatedUser));
                // console.log(updatedUser)

                return updatedUser; // Return the updated state
            });

            await handleBookmark(userId, user2Id);
        } catch (error) {
            console.error("Error Handling Bookmark:", error);
        }
    };




    const logins = (userData) => {
        setUser(userData);
        setAuthenticated(true);
        Cookies.set("userDetails", JSON.stringify(userData), { expires: 7 });
        window.location.reload()
    };

    const userlogoutService = async () => {
        console.log('Here')
        Cookies.remove("userDetails");
        logout
        setAuthenticated(false);
        setUser(null);
    };

    function getRandomCryptoUsername() {
        const firstNames = [
            "Hodl", "Pump", "Rug", "Moon", "Satoshi", "Fomo", "Whale", "Ape", "Diamond", "Lambo",
            "Degen", "Giga", "Paper", "Rebase", "Stake", "Dump", "Flippening", "Bit", "Chain", "Block",
            "Hash", "Ledger", "Smart", "DAO", "Meta", "Yield", "Shill", "Gas", "NFT", "Alpha", "Beta",
            "Token", "Market", "Limit", "Buy", "Sell", "Swap", "Mint", "Stonks", "Futures", "Spot",
            "Shorts", "Bulls", "Bears", "Ethereum", "Solana", "Binance", "Cardano", "Doge", "Pepe",
            "Shiba", "Kucoin", "Uniswap", "Pancake", "Avalanche", "Phantom", "Celsius", "Tether",
            "Cex", "Dex", "Ledger", "Lightning", "Gasless", "zkRollup", "L2", "Airdrop", "Snapshot",
            "Liquidity", "Farming", "Genesis", "Bridge", "Anon", "Decentralized", "Permissionless",
            "Trustless", "Validator", "Node", "Slippage", "Moonshot", "Exit", "Ponzi", "Halving",
            "Capped", "Inflation", "Emission", "Vesting", "Yield", "Consensus", "Multisig", "Public",
            "Private", "Seed", "Cold", "Hot", "Wallet", "Signer", "Quorum", "Faucet", "SmartMoney",
            "Insider"
        ];

        const lastNames = [
            "McDump", "Van Dip", "DeFi", "Paperhands", "TheShiller", "Nakamoto", "NoRekt", "GasFee", "Gwei", "TokenMaxi",
            "LaserEyes", "Rektson", "BagsHeavy", "Moonberg", "Rugstein", "Lambozo", "Pumpington", "Stakington", "Mempool",
            "FeeTooHigh", "Scamzos", "Scamurai", "WalletDrainer", "Fudmaster", "ATHson", "McBlock", "Dumpington", "FaucetLord",
            "Gaslord", "Goxed", "Hashratez", "Bitlord", "Airdropstein", "Diplo", "Pumpazzo", "Dustwallet", "Rebased", "McApe",
            "Hodlstein", "Ponzinator", "Slippage", "Pancakeson", "Farmington", "Wifisecurity", "HotWallet", "ColdHands",
            "Validatorz", "Shitcoinson", "BSCtard", "Apeboi", "SniperWallet", "Multisig", "Bridgeman", "HashCash", "ScamBankman",
            "CZington", "Degenberg", "NoSlippage", "YOLOtrader", "GMbassador", "Bullishman", "Bearwick", "Altcoinstein",
            "NFTcollector", "SnapshotKing", "Dumperson", "Stonkyboi", "Forkzilla", "Yieldfarmer", "GenesisLord", "Flashloaner",
            "ExitScamson", "FakeVolume", "LockedLiquidity", "ExitPilled", "ZeroGasFee", "MEVlord", "Minerz", "OnChain",
            "TestnetDeployer", "FloorPrice", "TopSignal", "BotTrader", "WashTrading", "VCExit", "BinanceExit", "WhitelistOnly",
            "Unrekted", "NoLiquid", "SideChain", "Shardington", "Rollupstein", "Deflationary", "PonziScheme", "AirdropHunter",
            "Autocompounder", "GoxVictim", "TradingBotz", "Tokenomics", "PayGasFee"
        ];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        return `${firstName} ${lastName}`;
    }



    return (
        <AuthContext.Provider value={{ initiateLoginUser, userlogoutService, useBookmark, authenticate, userDetails, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useLoginService = () => {
    return useContext(AuthContext);
};
