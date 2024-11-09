// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDutdhDyMC9e2B981JV6lv_xwywwrUqd2w",
  authDomain: "nu-vision-696f6.firebaseapp.com",
  projectId: "nu-vision-696f6",
  storageBucket: "nu-vision-696f6.appspot.com",
  messagingSenderId: "103100144099",
  appId: "1:103100144099:web:beeb3bac450a7ebc88e8d6",
  measurementId: "G-CJDYR0EY5P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
