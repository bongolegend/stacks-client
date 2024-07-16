import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth' 
import 'firebase/auth'
import { getAccessToken, saveAccessToken } from "../services/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGZ6FFlCO1owQljmo-GbKFTBuNmi9FsjQ",
  authDomain: "stacks-8f7cf.firebaseapp.com",
  projectId: "stacks-8f7cf",
  storageBucket: "stacks-8f7cf.appspot.com",
  messagingSenderId: "844894271901",
  appId: "1:844894271901:web:727825b0acb8f000b69774",
  measurementId: "G-MRKNLE8C91"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

//gmail
export const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(FIREBASE_AUTH, provider) 

export const firebaseSignOut =  () => signOut(FIREBASE_AUTH)

export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(FIREBASE_AUTH, provider);
      console.log('User signed in:', result.user);
      alert("signed in with Google")
      return (result)
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert("Failed to sign in with google")
    }
  };

export const isFirstLogin = (creationTime: string, lastSignInTime: string): boolean => {
  const createdAtDate = new Date(creationTime);
  const lastLoggedInDate = new Date(lastSignInTime);

  // Calculate the difference in seconds
  const timeDifference = Math.abs((createdAtDate.getTime() - lastLoggedInDate.getTime()) / 1000);

  // Allow a margin of error of 5 seconds
  return timeDifference <= 5;
}

// PROBABLY DEPRICATED
export const getValidIdToken = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (!user) {
    throw new Error("No user is signed in");
  }

  // check if token is expired,refresh if expired
  let idToken = await getAccessToken();
  const [, payloadBase64] = idToken.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const now = Date.now() / 1000; // Current time in seconds
  if(payload.exp < now){
    console.log("idToken expired, refreshing token")
    idToken = await user.getIdToken(true);
    await saveAccessToken(idToken);
  }

  return idToken;
}

export const getAuthHeader = async () => {
  const accessToken = await getAccessToken()
  console.log('accessToken:', accessToken);
  const authHead = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }}
  return authHead
}




  