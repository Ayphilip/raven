import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs,  setDoc, addDoc, collection, Timestamp, updateDoc, arrayUnion, arrayRemove, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAZRK6A-vYIR8FurMptBIIi5ZAh0qfx1bk",
    authDomain: "hive-b1480.firebaseapp.com",
    projectId: "hive-b1480",
    storageBucket: "hive-b1480.firebasestorage.app",
    messagingSenderId: "995817908165",
    appId: "1:995817908165:web:6248180db7161c7830cdac",
    measurementId: "G-YZ3VKR5NSS"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app)

export { db, doc, getDoc, ref, uploadBytes, getDownloadURL, Timestamp, setDoc, getDocs, addDoc, storage, collection, updateDoc, arrayUnion, where, arrayRemove, query, orderBy, onSnapshot };
