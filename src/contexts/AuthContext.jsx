import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const cachedUser = localStorage.getItem('uv_user');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      localStorage.removeItem('uv_user');
      return null;
    }
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('uv_role') || null;
  });
  const [loading, setLoading] = useState(true);

  async function signUp(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName });
    
    const role = user.email.toLowerCase() === 'theuniquevisuals15@gmail.com' ? 'admin' : 'user';

    // Create user doc in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: role,
      createdAt: new Date().toISOString()
    });

    return user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user doc exists, if not create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const role = user.email.toLowerCase() === 'theuniquevisuals15@gmail.com' ? 'admin' : 'user';
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        createdAt: new Date().toISOString()
      });
    }

    return user;
  }

  function signOutUser() {
    localStorage.removeItem('uv_user');
    localStorage.removeItem('uv_role');
    setCurrentUser(null);
    setUserRole(null);
    return signOut(auth);
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

    localStorage.setItem('uv_user', JSON.stringify(updatedUserData));
    setCurrentUser(updatedUserData);
  }

  async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await deleteDoc(doc(db, 'users', user.uid));
    await deleteUser(user);

    localStorage.removeItem('uv_user');
    localStorage.removeItem('uv_role');
    setCurrentUser(null);
    setUserRole(null);
  }

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          let role = 'user';

          if (userDocSnap.exists()) {
            role = userDocSnap.data().role || 'user';
          }

          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role
          };

          localStorage.setItem('uv_user', JSON.stringify(userData));
          localStorage.setItem('uv_role', role);

          setCurrentUser(userData);
          setUserRole(role);
        } else {
          localStorage.removeItem('uv_user');
          localStorage.removeItem('uv_role');
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    signUp,
    signOut: signOutUser,
    googleSignIn,
    updateUserProfile,
    deleteAccount
  };

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
