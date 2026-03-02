// src/app/signup/page.js
'use client';

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import { createFirestoreUser } from '../lib/firestore-service';
import styles from '../page.module.css';
import Header from '../components/Header';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExpert, setIsExpert] = useState(false); // NEW: State for expert role
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
      
      // 2. Create corresponding Firestore Document (passing isExpert)
      const user = userCredential.user;
      await createFirestoreUser(user, isExpert); // NEW: passing the role flag
      
      router.push('/'); // Redirect on success
    } catch (err) {
      // Enhance error messages for better user feedback
      let errorMessage = "Failed to create an account.";
      if (err.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters long.";
      } else if (err.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Try logging in.";
      } else if (err.message) {
          errorMessage = err.message; // Catch generic firebase auth errors
      }
      setError(errorMessage);
    }
  };
  
  return (
    <>
    <Header/>
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Create an Account</h1>
        <form onSubmit={handleSignUp} className={styles.form}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className={styles.input} 
          />
          <div className={styles.passwordContainer}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                className={styles.input} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={styles.passwordToggle}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {/* NEW: Expert Checkbox */}
            <div className={styles.checkboxContainer} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <input 
                type="checkbox" 
                id="expertCheck"
                checked={isExpert}
                onChange={(e) => setIsExpert(e.target.checked)}
              />
              <label htmlFor="expertCheck">Sign up as an Expert / Researcher</label>
            </div>

          <button type="submit" className={styles.button}>Sign Up</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.toggleText}>Already have an account? <Link href="/login">Log In</Link></p>
      </main>
    </div>
    </>
  );
}