'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import styles from '../page.module.css';
import Header from '../components/Header';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect on success
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };
  
  return (
    <>
    <Header />
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome Back</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={styles.input} />

          <div className={styles.passwordContainer}>
              <input 
                type={showPassword ? 'text' : 'password'} /* 3. Toggle type based on state */
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                className={styles.input} 
              /><button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={styles.passwordToggle}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          <button type="submit" className={styles.button}>Log In</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.toggleText}>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      </main>
    </div>
    </>
  );
}