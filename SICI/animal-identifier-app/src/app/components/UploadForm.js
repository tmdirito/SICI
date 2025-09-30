'use client'; 

import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
// We import the styles from page.module.css since we defined our button and card styles there
import styles from '../page.module.css';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const userId = 'test-user'; 
    if (!userId) return;

    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const animalsData = [];
      querySnapshot.forEach((doc) => {
        animalsData.push({ id: doc.id, ...doc.data() });
      });
      setAnimals(animalsData);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const userId = 'test-user'; 
      const filePath = `userUploads/${userId}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, file);
      console.log('File uploaded! The backend is now processing it.');

    } catch (err) {
      console.error("Upload failed:", err);
      setError('The file upload failed. Please try again.');
    } finally {
      setIsLoading(false);
      setFile(null); 
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* This is a common way to style a file input: a styled label triggers the hidden input */}
        <label htmlFor="file-upload" className={styles.button}>
          Choose File
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        
        {file && <p>Selected: {file.name}</p>}

        <button type="submit" className={styles.button} disabled={isLoading || !file}>
          {isLoading ? 'Uploading...' : 'Identify Animal'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      
      <hr style={{margin: '2rem 0', border: 'none', borderTop: `1px solid ${'var(--card-border)'}`}} />

      <h2>Your Identified Animals</h2>
      {animals.length === 0 && !isLoading && <p>No animals identified yet.</p>}
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