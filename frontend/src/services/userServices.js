import axios from "axios";
import { avatars } from "../Components/avatars";
import { db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, arrayRemove, arrayUnion } from "../Components/firebaseConfig";



// CREATE User
export const checkUser = async (userId, privyId, mode, username, name, profilePicture, cover, bio) => {
  
    const userRef = doc(db, "users", username);
    const snapshot = await getDoc(userRef);
    

    if (snapshot.exists()) {
        return snapshot.data();
    } else {
        const userData = {
            userId,
            username,
            name,
            privyId,
            mode,
            cover,
            profilePicture,
            bio,
            followers: [],
            following: [],
            bookmark: [],
            createdAt: new Date()
        };

        await setDoc(userRef, userData);
        const newSnapshot = await getDoc(userRef);
        return newSnapshot.data();
    }
};

export const getUser = async (userId) => {
    try {
      const tweetsRef = collection(db, "users"); // Reference to tweets collection
      const q = query(tweetsRef, where("username", "==", userId)); // Query for tweetId
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Return the first matching document's data
        return querySnapshot.docs[0].data();
      } else {
        return null; // No matching tweet found
      }
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  };

export const getAllUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map(doc => ({
        id: doc.id,  // Include the document ID
        ...doc.data()
    }));

    // console.log(users)

    return users;
};




// UPDATE User
export const updateUser = async (userId, data) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
};

export const addFollower = async (userId, user2Id) => {
    const userRef = doc(db, "users", userId); 
    const userRef2 = doc(db, "users", user2Id); 
  
    try {
      await updateDoc(userRef, {
        followers: arrayUnion(user2Id) // Add newItem to 'likes' array
      });
      await updateDoc(userRef2, {
        following: arrayUnion(userId) // Add newItem to 'likes' array
      });
      console.log("Item added successfully!");
      return true
    } catch (error) {
      console.error("Error updating document:", error);
      return false;
    }
  };

  export const removeFollower = async (userId, user2Id) => {
    const userRef = doc(db, "users", userId); 
    const userRef2 = doc(db, "users", user2Id); 
  
    try {
      await updateDoc(userRef, {
        followers: arrayRemove(user2Id) // Add newItem to 'likes' array
      });
      await updateDoc(userRef2, {
        following: arrayRemove(userId) // Add newItem to 'likes' array
      });
      console.log("Item added successfully!");
      return true;
    } catch (error) {
      console.error("Error updating document:", error);
      return false;
    }
  };


  export const handleBookmark = async (userId, user2Id) => {
    const userRef = doc(db, "users", userId); 
    // const userRef2 = doc(db, "users", user2Id); 

    const tweetsRef = collection(db, "tweets"); // Reference to tweets collection
    const q = query(tweetsRef, where("tweetId", "==", user2Id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Tweet not found");
      return;
    }

    const tweetDoc = querySnapshot.docs[0]; // Get the first matching document
    const tweetData = tweetDoc.data(); // Get the document data
    const tweetRef = doc(db, "tweets", tweetDoc.id); // Get the document reference

    if (tweetData?.bookmarks?.includes(userId)) {
      
      await updateDoc(userRef, {
        bookmark: arrayRemove(user2Id) 
      });
      await updateDoc(tweetRef, { bookmarks: arrayRemove(userId) });
      
    } else {
      await updateDoc(userRef, {
        bookmark: arrayUnion(user2Id)
      });
      
      await updateDoc(tweetRef, { bookmarks: arrayUnion(userId) });
      
    }
  };



// export const addUserFollower = async (tweetId, newUser) => {
//     try {
//       // Query Firestore to find the document where tweetId matches
//       const tweetsCollection = collection(db, "tweets");
//       const q = query(tweetsCollection, where("tweetId", "==", tweetId));
//       const querySnapshot = await getDocs(q);
  
//       if (!querySnapshot.empty) {
//         // Assuming tweetId is unique, get the first document
//         const tweetDoc = querySnapshot.docs[0];
//         const tweetRef = tweetDoc.ref;
  
//         // Update the 'likes' array
//         await updateDoc(tweetRef, {
//           likes: arrayUnion(newUser) // Add newUser to the likes array
//         });
  
//         console.log("User added to likes!");
//       } else {
//         console.log("No tweet found with this ID");
//       }
//     } catch (error) {
//       console.error("Error updating likes:", error);
//     }
//   };