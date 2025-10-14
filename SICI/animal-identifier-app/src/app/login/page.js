'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import styles from '../page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); // Redirect on success
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome Back</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={styles.input} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={styles.input} />
          <button type="submit" className={styles.button}>Log In</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.toggleText}>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      </main>
    </div>
  );
}