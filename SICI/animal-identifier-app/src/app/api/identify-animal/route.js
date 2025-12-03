'use client';

import { useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import { createFirestoreUser } from '../../lib/firestore-service';
import styles from '../page.module.css';
import loginStyles from './login.module.css';
import Header from '../components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // --- 1. HANDLE EMAIL/PASSWORD LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure user profile exists in Firestore
      await createFirestoreUser(userCredential.user);
      
      router.push('/dashboard'); 
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to log in. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          errorMessage = "Invalid email or password.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // --- 2. HANDLE GOOGLE LOGIN (OAuth) ---
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create Firestore user document for the Google user
      await createFirestoreUser(user);
      
      router.push('/dashboard'); 
    } catch (err) {
      console.error("Google sign-in failed:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    <Header />
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome Back</h1>
        
        {/* New Google Sign-In Button */}
        <button 
          onClick={handleGoogleLogin} 
          className={loginStyles.googleBtn}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </button>

        {/* Divider */}
        <p className={loginStyles.divider}>OR</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className={styles.input} 
            disabled={loading}
          />

          <div className={styles.passwordContainer}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                className={styles.input} 
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={styles.passwordToggle}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.toggleText}>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      </main>
    </div>
    </>
  );
}