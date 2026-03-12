'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../app/lib/firebase'; // Adjust path if necessary

// Create the context
const AuthContext = createContext();

// A custom hook to make it easy to use the auth context in other components
export function useAuth() {
  return useContext(AuthContext);
}

// The provider component that wraps your app and makes auth available
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for changes in the user's login state
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);
  
  // Logout function
  const logout = () => {
    const auth = getAuth(app);
    return signOut(auth);
  }

  const value = {
    currentUser,
    logout,
  };

  // Don't render children until the auth state has been checked
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}