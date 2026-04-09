'use client';

import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from './UploadForm.module.css'; // Make sure this CSS file contains all combined classes

export default function UploadForm() {
  // --- UI State ---
  const [activeWord, setActiveWord] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const words = ['Discover', 'Identify', 'Explore', 'Capture', 'Understand', 'Connect'];
  const colors = ['#606c38', '#bc6c25', '#84a59d', '#b08968', '#bc6c25', '#84a59d'];

  // --- Logic & Upload State ---
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [lastAnimalId, setLastAnimalId] = useState(null); 
  const [uploadMessage, setUploadMessage] = useState("Upload a picture to begin.");

  const { currentUser } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // --- Animate Title Words ---
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => (prev + 1) % words.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, [words.length]);

  // --- Firestore Listener (Reads History in Real-Time) ---
  useEffect(() => {
    if (!currentUser) return; 

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals'); 
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnimals(animalsData);

      // Stop loading when new data is confirmed
      if (isProcessing && animalsData.length > 0 && animalsData[0].id !== lastAnimalId) {
        setIsProcessing(false);
        setLastAnimalId(animalsData[0].id);
        setUploadMessage("Analysis complete. Result added to history.");
        setFile(null); // Clear file so they can upload a new one
        setImagePreview(null);
      } else if (animalsData.length > 0 && lastAnimalId === null) {
        setLastAnimalId(animalsData[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, isProcessing, lastAnimalId]);

  // --- File Handling & Immediate Upload ---
  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
    setError('');
    setUploadMessage(`Selected: ${selectedFile.name}. Uploading...`);
    
    // Close the modal so the user can see the status message and results
    closeModal();

    // Immediately start upload
    await startUpload(selectedFile);
  };

  const startUpload = async (selectedFile) => {
    if (!selectedFile || !currentUser) return;

    setIsProcessing(true);
    setError('');
    setUploadMessage("Uploading file and starting AI analysis...");

    try {
      const userId = currentUser.uid;
      const fileExtension = selectedFile.name.split('.').pop();
      const filePath = `userUploads/${userId}/${Date.now()}.${fileExtension}`; 
      const storageRef = ref(storage, filePath);
      
      // Upload to Firebase Storage
      await uploadBytes(storageRef, selectedFile);
      
      setUploadMessage("AI analysis running in the background. This may take a moment...");
      
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Check your network.");
      setIsProcessing(false);
      setUploadMessage("Upload failed.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* --- HERO SECTION --- */}
      <div className={`${styles.pageHero} ${isModalOpen ? styles.zoomed : ''}`}>
        {/* Background Images */}
        <img src="/images/slide1.jpg" className={`${styles.heroimg} ${styles.img1}`} alt="" />
        <img src="/images/slide7.jpg" className={`${styles.heroimg} ${styles.img2}`} alt="" />
        <img src="/images/slide4.jpg" className={`${styles.heroimg} ${styles.img3}`} alt="" />
        <img src="/images/slide3.jpg" className={`${styles.heroimg} ${styles.img4}`} alt="" />

        {/* Center Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {words.map((word, i) => (
              <span
                key={i}
                className={i === activeWord ? styles.active : ''}
                style={{ color: colors[i] }} 
              >
                {word}
              </span>
            ))}
          </h1>

          <p className={styles.heroSubtitle}>World Around You!</p>
          <p>Turn your photos into knowledge</p>
          <p>Instantly recognize every plant and animal you encounter.</p>

          <button 
            className={styles.heroButton} 
            onClick={openModal}
            disabled={isProcessing}
            style={{ opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? 'Analyzing...' : 'Identify'}
          </button>
          
          {/* Status Message */}
          <p className={styles.uploadStatusMessage}>{uploadMessage}</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* --- MODAL --- */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalDialog}>
              <button className={styles.closeButton} onClick={closeModal}>
                &times;
              </button>

              <div 
                className={styles.modalInner} 
                onClick={() => document.getElementById('file-upload').click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                ) : (
                  <img 
                    src="/images/drag.webp"  
                    alt="Placeholder" 
                    className={styles.previewImage} 
                  />
                )}

                <p className={styles.uploadText}>Drop or Click to Upload</p>
                <p className={styles.uploadSubText}>Browse to choose a file (jpg, png, gif)</p>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- RESULTS SECTION --- */}
      <div className={styles.resultsSection} style={{ padding: '2rem' }}>
        <hr style={{ margin: '2rem 0', border: 'none', borderTop: `1px solid var(--card-border)` }} />
        
        <h2>Your Identified Species</h2>
        {animals.length === 0 && <p>No species identified yet.</p>}
        
        <div className={styles.resultsGrid}>
          {animals.map((animal) => (
            <div key={animal.id} className={styles.resultCard}>
              <h3>{animal.commonName}</h3>
              <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
              <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
              <p style={{ marginTop: '8px', color: 'var(--secondary-text)' }}>{animal.description}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'gray' }}>
                <em>Identified on: {animal.createdAt ? animal.createdAt.toDate().toLocaleString() : 'Date not available'}</em>
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}