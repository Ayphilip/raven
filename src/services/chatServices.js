import { db, collection, addDoc, doc, getDoc, query, orderBy, onSnapshot } from "../Components/firebaseConfig";

// SEND Message
export const sendMessage = async (chatId, senderId, receiverId, content) => {
  const messageRef = collection(db, "chats", chatId, "messages");
  await addDoc(messageRef, { senderId, receiverId, content, createdAt: new Date() });
};

// GET Chat Messages
export const getChatMessages = (chatId, callback) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};
