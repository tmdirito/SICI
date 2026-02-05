'use client';

import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from '../page.module.css';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  // State to reflect background processing (prevents client crash by maintaining loading state)
  const [isProcessing, setIsProcessing] = useState(false); 
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState([]);
  const { currentUser } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  
  // State to track the last ID seen to know when a *new* result arrives
  const [lastAnimalId, setLastAnimalId] = useState(null); 
  // State to hold the temporary upload message for better UX
  const [uploadMessage, setUploadMessage] = useState("Upload a picture to begin.");

  // --- 1. Firestore Listener (Reads History in Real-Time) ---
  useEffect(() => {
    // --- CRITICAL GUARD CLAUSE (Fixes Authentication Race Condition) ---
    if (!currentUser) return; 

    const userId = currentUser.uid;
    // FIX: Changed 'history' to 'animals' to match HistoryPage.js and security rules
    const animalsCollection = collection(firestore, 'users', userId, 'animals'); 
    
    // Order by the automatically generated timestamp field on the Cloud Function save
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnimals(animalsData);

      // --- CRITICAL FIX: STOP LOADING WHEN NEW DATA IS CONFIRMED ---
      if (isProcessing && animalsData.length > 0 && animalsData[0].id !== lastAnimalId) {
        setIsProcessing(false); // New data arrived! Stop loading.
        setLastAnimalId(animalsData[0].id); // Update tracker
        setUploadMessage("Analysis complete. Result added to history.");
      } else if (animalsData.length > 0 && lastAnimalId === null) {
          // Initialize lastAnimalId if history already exists on load
          setLastAnimalId(animalsData[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, isProcessing, lastAnimalId]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const previewURL = URL.createObjectURL(selectedFile);
      setImagePreview(previewURL);
      setError('');
      setUploadMessage(`Selected: ${selectedFile.name}. Ready to identify.`);
    }
  };
  
  // --- 2. Form Submission (Starts the Upload/AI Process) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    setIsProcessing(true); // START PROCESSING UI
    setError('');
    setUploadMessage("Uploading file and starting AI analysis...");

    try {
      const userId = currentUser.uid;
      const fileExtension = file.name.split('.').pop();
      // Ensure the path is correct for Storage rules (userUploads is the bucket path)
      const filePath = `userUploads/${userId}/${Date.now()}.${fileExtension}`; 
      const storageRef = ref(storage, filePath);
      
      // 1. Upload file to Firebase Storage (Wait for this critical step)
      await uploadBytes(storageRef, file);
      
      // 2. DO NOT wait for the Cloud Function response. Rely on the listener.
      setUploadMessage("AI analysis running in the background. This may take a moment...");
      
    } catch (err) {
      console.error('File upload failed:', err);
      // Reset processing state only on confirmed local failure (e.g., storage upload fails)
      setError('File upload failed. Check the emulator status and network connection.');
      setIsProcessing(false); 
      setUploadMessage("Upload failed.");
    } 
    // State cleanup is now handled by the useEffect on successful save, preventing flicker
  };


  // --- 3. Render Logic ---
  return (
    <div>
      <h2 className={styles.title}>Identify a New Animal/Plant</h2>
      <p className={styles.description}>{uploadMessage}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="file-upload" className={styles.button} style={{opacity: isProcessing ? 0.5 : 1}}>
          {file ? `Selected: ${file.name}` : 'Choose File'}
        </label>
        <input 
          id="file-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isProcessing}
          style={{ display: 'none' }} 
        />

        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Selected preview" 
            style={{ width: '300px', height: 'auto', border: '1px solid #ccc', margin: '10px auto'}} 
          />
        )}
        
        <button 
          type="submit" 
          className={styles.button} 
          disabled={isProcessing || !file}
        >
          {isProcessing ? 'ANALYZING...' : 'Identify Animal/Plant'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      
      <hr style={{margin: '2rem 0', border: 'none', borderTop: `1px solid var(--card-border)`}} />

      <h2>Your Identified Species</h2>
      {animals.length === 0 && <p>No species identified yet.</p>}
      {animals.map((animal) => (
        <div key={animal.id} className={styles.resultCard}>
          <h3>{animal.commonName}</h3>
          <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
          <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
          <p style={{marginTop: '8px', color: 'var(--secondary-text)'}}>{animal.description}</p>
          <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'gray'}}>
            <em>Identified on: {animal.createdAt ? animal.createdAt.toDate().toLocaleString() : 'Date not available'}</em>
          </p>
        </div>
      ))}
    </div>
  );
}