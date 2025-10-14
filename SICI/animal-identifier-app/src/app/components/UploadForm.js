'use client';

import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import styles from '../page.module.css';
import { useAuth } from '../../context/AuthContext';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return; // Don't run if no user is logged in

    const userId = currentUser.uid; // Use the REAL user's ID
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnimals(animalsData);
    });

    return () => unsubscribe();
  }, [currentUser]); // Re-run this effect when the user changes

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    setIsLoading(true);
    setError('');
    
    try {
      const userId = currentUser.uid; // Use the REAL user's ID
      const filePath = `userUploads/${userId}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
    } catch (err) {
      setError('File upload failed.');
    } finally {
      setIsLoading(false);
      setFile(null);
      e.target.reset(); // Visually clear the file input
    }
  };

  return (
    <div>
      <h2 className={styles.title}>Identify a New Animal</h2>
      <p className={styles.description}>Upload a picture to begin.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="file-upload" className={styles.button}>
          {file ? `Selected: ${file.name}` : 'Choose File'}
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        
        <button type="submit" className={styles.button} disabled={isLoading || !file}>
          {isLoading ? 'Downloading...' : 'Identify Animal'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      
      <hr style={{margin: '2rem 0', border: 'none', borderTop: `1px solid var(--card-border)`}} />

      <h2>Your Identified Animals</h2>
      {animals.length === 0 && <p>No animals identified yet.</p>}
      {animals.map((animal) => (
        <div key={animal.id} className={styles.resultCard}>
          <h3>{animal.commonName}</h3>
          <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
          <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
          <p style={{marginTop: '8px', color: 'var(--secondary-text)'}}>{animal.description}</p>
        </div>
      ))}
    </div>
  );
}