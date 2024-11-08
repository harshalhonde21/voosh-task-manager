import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBg-ecffrLFK-aon5FbDAYY2oVylC_nbvU",
    authDomain: "voosh-11d60.firebaseapp.com",
    projectId: "voosh-11d60",
    storageBucket: "voosh-11d60.firebasestorage.app",
    messagingSenderId: "88819152059",
    appId: "1:88819152059:web:b60fb777d890ed9ca8659e",
    measurementId: "G-WBKG8J949C"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();



export const signInSignUpWithGoogle = async () => {
  try {

    const result = await signInWithPopup(auth, googleProvider);

    const token = await result.user.getIdToken();

    return token;

  } catch (error) {
    console.error("Google Sign In Error:", error.message);
    return null;
  }
}