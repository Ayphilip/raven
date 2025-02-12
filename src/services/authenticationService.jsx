import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { checkUser } from "./userServices";
import { usePrivy } from "@privy-io/react-auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userDetails, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const { ready, logout, user } = usePrivy();

    useEffect(() => {
        const storedUser = Cookies.get("userDetails");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const genId = async () => {
        return crypto.randomUUID();
    };

    async function initiateLoginUser(user) {
        setLoading(true);
        const initId = await genId();
        // console.log("Generated ID:", initId);

        var name = getRandomCryptoUsername();


        const response = await checkUser(initId, user.id, "privy", user.wallet.address, name, "", "", "");
        if (response) {
            login(response);
        } else {
            alert('Error')
        }

        setLoading(false);
    }

    const login = (userData) => {
        setUser(userData);
        setAuthenticated(true);
        Cookies.set("userDetails", JSON.stringify(userData), { expires: 7 });
    };

    const userlogoutService = async () => {
        console.log('Here')
        setAuthenticated(false);
        logout
        Cookies.remove("userDetails");
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
        <AuthContext.Provider value={{ initiateLoginUser, userlogoutService, userDetails, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useLoginService = () => {
    return useContext(AuthContext);
};
