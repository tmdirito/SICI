// src/app/expert-feedback/page.js
'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../lib/firebase';
import Header from '../components/Header';
import styles from '../page.module.css';

export default function ExpertFeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setStatus('submitting');
    
    // Check if user is logged in (you might also want to fetch their user doc to verify they are an expert)
    const currentUser = auth.currentUser;
    if (!currentUser) {
        setStatus('error');
        alert("You must be logged in to submit feedback.");
        return;
    }

    try {
      // Add feedback to a new Firestore collection called "expert_feedback"
      await addDoc(collection(db, 'expert_feedback'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        message: feedback,
        status: 'pending', // You can use this to track if you've resolved their feedback
        submittedAt: serverTimestamp()
      });
      
      setStatus('success');
      setFeedback(''); // clear the form
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus('error');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>Expert Feedback</h1>
          <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Notice an inaccuracy? Submit your corrections or research feedback here.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what needs to be corrected or updated..."
              required
              className={styles.input}
              style={{ minHeight: '150px', resize: 'vertical' }} // Make it look like a text area
            />
            
            <button 
                type="submit" 
                className={styles.button} 
                disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
            </button>
            
            {status === 'success' && (
                <p style={{ color: 'green', marginTop: '1rem' }}>Thank you! Your feedback has been submitted successfully.</p>
            )}
            {status === 'error' && (
                <p className={styles.error}>There was an error submitting your feedback. Please try again.</p>
            )}
          </form>
        </main>
      </div>
    </>
  );
}