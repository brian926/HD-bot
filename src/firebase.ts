import { initializeApp } from "firebase/app";
import { addDoc, getFirestore, collection } from "firebase/firestore/lite"
import dotenv from "dotenv"
dotenv.config()

const { API_KEY } = process.env

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "helpdesk-2ab43.firebaseapp.com",
  projectId: "helpdesk-2ab43",
  storageBucket: "helpdesk-2ab43.appspot.com",
  messagingSenderId: "242558926662",
  appId: "1:242558926662:web:79a2487833260ea0906f47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export async function createTicket(threadId: string, text: string) {
    try {
        await addDoc(collection(db, 'ticket'), {
            threadId,
            text,
            openedAt: Date()
        })
    }catch(err) {
        console.error("Error adding document: ", err)
    }
}