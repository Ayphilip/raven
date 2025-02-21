import { db, doc, getDoc, setDoc, updateDoc, collection, arrayUnion, arrayRemove, getDocs, query, where } from "../config/firebaseConfig.js";

// Token Creation
export const createToken = async (req, res) => {
    try {
        const { name, symbol, decimals, max_supply } = req.body;
        const tokenRef = doc(db, "tokens", symbol);
        const tokenData = { name, symbol, decimals, max_supply };
        await setDoc(tokenRef, tokenData);
        return res.status(201).json({ message: "Token created successfully" });
    } catch (error) {
        console.error("Error creating token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getToken = async (req, res) => {
    try {

        const tokenRef = collection(db, "tokens");
        // const tokenData = { name, symbol, decimals, max_supply };
        const snapshot = await getDocs(tokenRef);
        let tokens = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(tokens);
    } catch (error) {
        console.error("Error creating token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Max Supply
export const getMaxSupply = async (req, res) => {
    try {
        const { symbol } = req.params;
        const tokenRef = doc(db, "tokens", symbol);
        const tokenDoc = await getDoc(tokenRef);
        if (!tokenDoc.exists()) {
            return res.status(404).json({ error: "Token not found" });
        }
        return res.status(200).json({ max_supply: tokenDoc.data().max_supply });
    } catch (error) {
        console.error("Error fetching max supply:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Total Circulating Supply
export const getTotalCirculatingSupply = async (req, res) => {
    try {
        const { symbol } = req.params;
        const balancesRef = collection(db, "balances");
        const snapshot = await getDocs(balancesRef);
        let totalSupply = 0;

        snapshot.forEach(doc => {
            const balances = doc.data().balances || [];
            const tokenBalance = balances.find(b => b.symbol === symbol);
            if (tokenBalance) {
                totalSupply += tokenBalance.balance;
            }
        });

        return res.status(200).json({ circulating_supply: totalSupply });


    } catch (error) {
        console.error("Error fetching circulating supply:", error);
        return { circulating_supply: 0 };
    }
};


export const getTotalCirculatingSupply2 = async (symbol) => {
    try {

        const balancesRef = collection(db, "balances");
        const snapshot = await getDocs(balancesRef);
        let totalSupply = 0;

        snapshot.forEach(doc => {
            const balances = doc.data().balances || [];
            const tokenBalance = balances.find(b => b.symbol === symbol);
            if (tokenBalance) {
                totalSupply += tokenBalance.balance;
            }
        });
        return ({ circulating_supply: totalSupply });
    } catch (error) {
        console.error("Error fetching circulating supply:", error);

    }
};

// Check Balance
export const getBalance = async (req, res) => {
    try {
        const { address, symbol } = req.params;
        const balanceRef = doc(db, "balances", address);
        const balanceDoc = await getDoc(balanceRef);

        if (!balanceDoc.exists()) {
            return res.status(200).json({ balance: 0 });
        }

        const balances = balanceDoc.data().balances || [];
        const tokenBalance = balances.find(b => b.symbol === symbol);

        return res.status(200).json({ balance: tokenBalance ? tokenBalance.balance : 0 });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Mint Tokens
export const mint = async (req, res) => {
    try {
        const { address, amount, symbol } = req.body;
        const tokenRef = doc(db, "tokens", symbol);
        const tokenDoc = await getDoc(tokenRef);

        if (!tokenDoc.exists()) {
            return res.status(404).json({ error: "Token not found" });
        }

        const maxSupply = tokenDoc.data().max_supply;
        const circulatingSupplyData = await getTotalCirculatingSupply2(symbol);
        const circulatingSupply = circulatingSupplyData.circulating_supply;

        if (circulatingSupply + amount > maxSupply) {
            return res.status(400).json({ error: "Minting would exceed max supply" });
        }

        const balanceRef = doc(db, "balances", address);
        const balanceSnapshot = await getDoc(balanceRef);

        if (!balanceSnapshot.exists()) {
            await setDoc(balanceRef, { balances: [{ symbol, balance: amount }] });
        } else {
            const existingBalances = balanceSnapshot.data().balances || [];
            const symbolIndex = existingBalances.findIndex(b => b.symbol === symbol);

            if (symbolIndex === -1) {
                await updateDoc(balanceRef, {
                    balances: arrayUnion({ symbol, balance: amount })
                });
            } else {
                existingBalances[symbolIndex].balance += amount;
                await updateDoc(balanceRef, { balances: existingBalances });
            }
        }

        return res.status(200).json({ message: "Tokens minted successfully" });
    } catch (error) {
        console.error("Error minting tokens:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Transfer Tokens
export const transfer = async (req, res) => {
    try {
        const { from, to, amount, symbol } = req.body;
        const senderRef = doc(db, "balances", from);
        const receiverRef = doc(db, "balances", to);

        const senderDoc = await getDoc(senderRef);
        let receiverDoc = await getDoc(receiverRef);

        if (!senderDoc.exists()) {
            return res.status(400).json({ error: "Sender does not exist" });
        }

        if (!receiverDoc.exists()) {
            console.log("Receiver does not exist, creating a new document...");
            await setDoc(receiverRef, { balances: [] }); // Create an empty document for receiver
            receiverDoc = await getDoc(receiverRef); // Re-fetch the receiver doc
        }

        let senderBalances = senderDoc.data().balances || [];
        let senderIndex = senderBalances.findIndex(b => b.symbol === symbol);

        // Convert amount to an integer
        const transferAmount = parseInt(amount, 10);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({ error: "Invalid transfer amount" });
        }

        if (senderIndex === -1 || senderBalances[senderIndex].balance < transferAmount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        senderBalances[senderIndex].balance -= transferAmount;

        let receiverBalances = receiverDoc.exists() ? receiverDoc.data().balances || [] : [];
        let receiverIndex = receiverBalances.findIndex(b => b.symbol === symbol);

        if (receiverIndex === -1) {
            receiverBalances.push({ symbol, balance: transferAmount });
        } else {
            receiverBalances[receiverIndex].balance += transferAmount;
        }

        // Update sender's and receiver's balances
        await updateDoc(senderRef, { balances: senderBalances });
        await updateDoc(receiverRef, { balances: receiverBalances });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error transferring tokens:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};