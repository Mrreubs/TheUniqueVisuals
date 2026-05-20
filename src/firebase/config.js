import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUsSIFWYQcLboOQ8jubWt0S8MUgebBOnM",
  authDomain: "theuniquevisuals-49635.firebaseapp.com",
  projectId: "theuniquevisuals-49635",
  storageBucket: "theuniquevisuals-49635.firebasestorage.app",
  messagingSenderId: "123810596212",
  appId: "1:123810596212:web:b7fd0658b19f172d2bd821",
  measurementId: "G-GKNYBS9SRF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence)
  .catch((error) => console.error("Firebase persistence error:", error));
