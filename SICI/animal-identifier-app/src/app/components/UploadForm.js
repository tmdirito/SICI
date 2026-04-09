'use client';

import { useState, useEffect } from 'react';
import styles from './UploadForm.module.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header'; // <-- Add this import

// 1. ADDED BACK: Helper to fetch Firebase images for the results cards
function FirebaseImage({ path, altText, className }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path) return;
    const fetchUrl = async () => {
      try {
        const downloadUrl = await getDownloadURL(ref(storage, path));
        setUrl(downloadUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchUrl();
  }, [path]);

  if (!url) return <div className={className} style={{ backgroundColor: '#eaeaea', height: '200px' }}></div>;
  return <img src={url} alt={altText} className={className} />;
}

export default function UploadForm() {
  const [activeWord, setActiveWord] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const words = ['Discover', 'Identify', 'Explore', 'Capture', 'Understand', 'Connect'];
  const colors = ['#606c38', '#bc6c25', '#84a59d', '#b08968', '#bc6c25', '#84a59d']; 

  // Animate title words
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => (prev + 1) % words.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, [words.length]);

  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState([]);
  const { currentUser } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [lastAnimalId, setLastAnimalId] = useState(null); 
  const [uploadMessage, setUploadMessage] = useState("Upload a picture to begin.");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // --- Firestore Listener ---
  useEffect(() => {
    if (!currentUser) return; 

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals'); 
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnimals(animalsData);

      if (isProcessing && animalsData.length > 0 && animalsData[0].id !== lastAnimalId) {
        setIsProcessing(false);
        setLastAnimalId(animalsData[0].id);
        setUploadMessage("Analysis complete. Result added to history.");
      } else if (animalsData.length > 0 && lastAnimalId === null) {
        setLastAnimalId(animalsData[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, isProcessing, lastAnimalId]);

  // --- File handling ---
  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
    setError('');
    setUploadMessage(`Selected: ${selectedFile.name}. Uploading...`);
    
    // 2. ADDED BACK: Close modal immediately on selection so user sees status
    closeModal();

    // Immediately start upload
    await startUpload(selectedFile);
  };

  // --- Form submission (Firebase upload + AI) ---
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

      await uploadBytes(storageRef, selectedFile);

      setUploadMessage("AI analysis running in background...");
      
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Check your network.");
      setIsProcessing(false);
      setUploadMessage("Upload failed.");
    }
  };

  return (
    // 3. ADDED BACK: The pageContainer wrapper
    <> {/* <-- Add this opening bracket */}
      <Header /> {/* <-- Add your normal header here */}
    <div className={styles.pageContainer}>

      {/* BANNER SECTION */}
      <div className={`${styles.pageHero} ${isModalOpen ? styles.zoomed : ''}`}>
        {/* BACKGROUND IMAGES */}
        <img src="/images/slide1.jpg" className={`${styles.heroimg} ${styles.img1}`} alt="" />
        <img src="/images/slide7.jpg" className={`${styles.heroimg} ${styles.img2}`} alt="" />
        <img src="/images/slide4.jpg" className={`${styles.heroimg} ${styles.img3}`} alt="" />
        <img src="/images/slide3.jpg" className={`${styles.heroimg} ${styles.img4}`} alt="" />
        
        <div className={styles.heroOverlay}></div>

        {/* CENTER HERO CONTENT */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {words.map((word, i) => (
              <span
                key={i}
                className={i === activeWord ? styles.active : styles.hiddenWord}
                style={{ color: colors[i] }} 
              >
                {word}
              </span>
            ))}
          </h1>

          <p className={styles.heroSubtitle}>World Around You!</p>
          <p className={styles.heroDescription}>Turn your photos into knowledge.<br/>Instantly recognize every plant and animal you encounter.</p>

          <button 
            className={styles.heroButton} 
            onClick={openModal}
            disabled={isProcessing}
            style={{ opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? 'Analyzing...' : 'Identify'}
          </button>

          <p className={styles.uploadStatusMessage}>{uploadMessage}</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalDialog}>
              <button className={styles.closeButton} onClick={closeModal}>&times;</button>
              <div className={styles.modalInner} onClick={() => document.getElementById('file-upload').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                ) : (
                  <div className={styles.dropZone}>
                    <div>
                      <p className={styles.uploadText}>Drop or Click to Upload</p>
                      <p className={styles.uploadSubText}>Browse to choose a file (jpg, png)</p>
                    </div>
                  </div>
                )}
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

      {/* 4. ADDED BACK: RESULTS SECTION */}
      <div className={styles.resultsSection}>
        <hr className={styles.divider} />
        <h2 className={styles.resultsTitle}>Your Identified Species</h2>
        {animals.length === 0 && <p className={styles.emptyState}>No species identified yet.</p>}
        
        <div className={styles.resultsGrid}>
          {animals.map((animal) => (
            <div key={animal.id} className={styles.resultCard}>
              
              {animal.imagePath && (
                <FirebaseImage 
                  path={animal.imagePath} 
                  altText={animal.commonName} 
                  className={styles.cardImage} 
                />
              )}

              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{animal.commonName}</h3>
                <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
                <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
                <p className={styles.cardDesc}>{animal.description}</p>
                <p className={styles.cardDate}>
                  <em>Identified on: {animal.createdAt ? animal.createdAt.toDate().toLocaleString() : 'Date not available'}</em>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </>
  );
}