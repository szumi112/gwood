import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDl5ma71ojL4gjXMbqwCk_R3eZgUIdnxF0",
  authDomain: "peter-d5cc5.firebaseapp.com",
  projectId: "peter-d5cc5",
  storageBucket: "peter-d5cc5.appspot.com",
  messagingSenderId: "160115901559",
  appId: "1:160115901559:web:9dfa12fe98e670a8a7b272",
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app);

export const db = getFirestore(app);
