'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '../lib/firebase';
import { createFirestoreUser } from '../lib/firestore-service';
import Header from '../components/Header';
import styles from '../page.module.css'; 

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const [ecoText, setEcoText] = useState("");
  const fullText = "Where Every Species Tells a Story";

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setEcoText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to the Terms and Conditions to sign up.");
      return;
    }
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
      const user = userCredential.user;
      await createFirestoreUser(user, isExpert); 
      
      router.push('/'); // Redirect on success
    } catch (err) {
      let errorMessage = "Failed to create an account.";
      if (err.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters long.";
      } else if (err.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Try logging in.";
      } else if (err.message) {
          errorMessage = err.message; 
      }
      setError(errorMessage);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.landing}>
        
        <Image
          src="/eco-dex dark.png"
          alt="Eco-Dex Logo"
          width={75}
          height={75}
        />
        <h1 className={styles.title}> Welcome to Eco-dex! </h1>
        <h1 className={styles.titleMain}>
          <span className={styles.typewriter}>{ecoText}</span>
        </h1>
        <h2 className={styles.titleheading2}>
          Step into the wild! From the tiniest, most delicate plants to the majestic creatures that roam forests, oceans, and skies, ECO-dex brings the endless adventure of nature right to your fingertips. Explore, learn, and uncover the hidden wonders of flora and fauna from around the globe, all in one interactive, beautifully curated experience.
        </h2>

        <img 
          src="/gifs/flower.gif" 
          alt="Nature Hero" 
          className={styles.heroGif} 
        />

        <div className={styles.dialog}>
          <h2>Create Your Account</h2>
          
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

            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                id="expertCheck"
                checked={isExpert}
                onChange={(e) => setIsExpert(e.target.checked)}
              />
              <label htmlFor="expertCheck">Sign up as an Expert / Researcher</label>
            </div>

            {/* Terms and Conditions */}
            <div className={styles.termsContent}>
              <p><strong>Terms and Conditions</strong></p>
              <p>By creating an account, you agree to the following:</p>
              <p><strong>Safety and Liability:</strong> EcoDex is NOT responsible for any injury, harm, property damage, or legal violations that occur while using this app. Do not approach dangerous wildlife, trespass, or put yourself in hazardous situations.</p>
              <p><strong>Animal Welfare:</strong> Maintain a respectful distance from animals. Do not disturb nests or habitats.</p>
              <p><strong>Data Usage:</strong> Uploaded images may be processed by AI to identify species and improve our database.</p>
            </div>

            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
                required
              />
              I agree to the Terms and Conditions and wildlife safety guidelines
            </label>

            {/* Submit Button */}
            <button type="submit" className={styles.discoverBtn} disabled={!agreed}>
              Sign Up & Discover
            </button>
            
            {error && <p className={styles.error}>{error}</p>}
          </form>

          <p className={styles.toggleText}>
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </div>
      </div>
    </>
  );
}