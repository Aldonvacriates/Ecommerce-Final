// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADfz2LmuxzOPPCWu9aKiVlbn4OgrC7QYQ",
  authDomain: "ecommerce-finale.firebaseapp.com",
  projectId: "ecommerce-finale",
  storageBucket: "ecommerce-finale.firebasestorage.app",
  messagingSenderId: "347024484350",
  appId: "1:347024484350:web:e345d815b5e0e7b11402af",
  measurementId: "G-28Q0SR08H2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);