import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMsSA6GsuW7urLPCJIizkQdBuRbNKLDsM",
  authDomain: "rumwood-e7250.firebaseapp.com",
  projectId: "rumwood-e7250",
  storageBucket: "rumwood-e7250.appspot.com",
  messagingSenderId: "517516027068",
  appId: "1:517516027068:web:9a64e4a622efbdca1b1cb9",
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app);

export const db = getFirestore(app);
