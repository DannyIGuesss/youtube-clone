// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHCBj4gp2Ijioexxa7z8OkDr8YfLDKhCQ",
    authDomain: "yt-clone-d6bfd.firebaseapp.com",
    projectId: "yt-clone-d6bfd",
    appId: "1:910880108359:web:c1f02d9af940f8babf6662",
    measurementId: "G-MMNK6Q2LWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth= getAuth(app);
/**
 * signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle(){
    return signInWithPopup(auth,new GoogleAuthProvider())
}

/**
 * sign the user out.
 * @returns A promise that resolves when the user is signed out.
 */

export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */

export function onAuthStateChangedHelper(callback:(user:User | null) => void) {
    return onAuthStateChanged(auth, callback);
}