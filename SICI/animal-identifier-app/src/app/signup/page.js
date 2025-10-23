'use client';

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import styles from '../page.module.css';
import Header from '../components/Header';
export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect on success
    } catch (err) {
      setError("Failed to create an account. Password should be at least 6 characters.");
    }
  };
  
  return (
    <>
    <Header/>
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Create an Account</h1>
        <form onSubmit={handleSignUp} className={styles.form}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={styles.input} />
          <div className={styles.passwordContainer}>
              <input 
                type={showPassword ? 'text' : 'password'} /* 3. Toggle type based on state */
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                className={styles.input} 
              />
              {/* 4. Add the toggle button */}
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={styles.passwordToggle}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
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