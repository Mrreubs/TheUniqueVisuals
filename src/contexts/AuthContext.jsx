import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const ADMIN_EMAILS = [
  'theuniquevisuals15@gmail.com',
  'admin1@uniquevisuals.test',
  'admin2@uniquevisuals.test',
  'admin3@uniquevisuals.test',
];

function getUserRole(email) {
  return ADMIN_EMAILS.includes(email?.toLowerCase()) ? 'admin' : 'user';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signUp(email, password, displayName) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    const role = getUserRole(email);
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role,
      createdAt: new Date().toISOString()
    });
    return user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: getUserRole(user.email),
        createdAt: new Date().toISOString()
      });
    }
    return user;
  }

  function signOut() {
    setCurrentUser(null);
    setUserRole(null);
    return firebaseSignOut(auth);
  }

  async function updateUserProfile(data) {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    if (data.displayName) {
      await updateProfile(user, { displayName: data.displayName });
      await updateDoc(doc(db, 'users', user.uid), { displayName: data.displayName });
    }

    const updatedUserData = {
      uid: user.uid,
      email: user.email,
      displayName: data.displayName || user.displayName,
      photoURL: user.photoURL,
      role: userRole
    };
    setCurrentUser(updatedUserData);
  }

  async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await deleteDoc(doc(db, 'users', user.uid));
    await deleteUser(user);
    setCurrentUser(null);
    setUserRole(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const role = userDocSnap.exists()
          ? (userDocSnap.data().role || 'user')
          : getUserRole(user.email);

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role
        };

        setCurrentUser(userData);
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, userRole, login, signUp, signOut, googleSignIn, updateUserProfile, deleteAccount };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
