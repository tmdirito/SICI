

'use client';

import { useState, useEffect } from 'react';
import styles from './UploadForm.module.css';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export default function UploadForm() {
  const [activeWord, setActiveWord] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const words = ['Discover', 'Identify', 'Explore', 'Capture', 'Understand', 'Connect']; // 6 words
  const colors = ['#606c38', '#bc6c25', '#84a59d', '#b08968', '#bc6c25', '#84a59d']; // one color per word
  // Animate title words
  // Animate title words
useEffect(() => {
  const interval = setInterval(() => {
    setActiveWord(prev => (prev + 1) % words.length);
  }, 2000); // changed from 1500ms to 3000ms
  return () => clearInterval(interval);
}, []);

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

 // --- Firestore Listener (Your existing logic) ---
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

    // Upload to Firebase Storage
    await uploadBytes(storageRef, selectedFile);

    // Do NOT manually write to Firestore.
    // Cloud Function should detect this upload and write result.

    setUploadMessage("AI analysis running in background...");
    
  } catch (err) {
    console.error("Upload failed:", err);
    setError("Upload failed. Check your network.");
    setIsProcessing(false);
    setUploadMessage("Upload failed.");
  }
};

  return (
    <div className={`${styles.pageHero} ${isModalOpen ? styles.zoomed : ''}`}>

      {/* BACKGROUND IMAGES */}
      <img src="/images/slide1.jpg" className={`${styles.heroimg} ${styles.img1}`} alt="" />
      <img src="/images/slide7.jpg" className={`${styles.heroimg} ${styles.img2}`} alt="" />
      <img src="/images/slide4.jpg" className={`${styles.heroimg} ${styles.img3}`} alt="" />
      <img src="/images/slide3.jpg" className={`${styles.heroimg} ${styles.img4}`} alt="" />

      {/* CENTER HERO CONTENT */}
      <div className={styles.heroContent}>
      <h1 className={styles.heroTitle}>
  {words.map((word, i) => (
    <span
      key={i}
      className={i === activeWord ? styles.active : ''}
      style={{ color: colors[i] }}  // <-- dynamic color
    >
      {word}
    </span>
  ))}
</h1>

        <p className={styles.heroSubtitle}>
         World Around You!
        </p>
        <p>Turn your photos into knowledge</p>
        <p>instantly recognize every plant and animal you encounter</p>

        <button className={styles.heroButton} onClick={openModal}>
          Identify
        </button>
      </div>

      
    {/* MODAL */}
{isModalOpen && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalDialog}>
      {/* CLOSE BUTTON */}
      <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
        &times;
      </button>

      {/* INNER DASHED BOX */}
      <div 
        className={styles.modalInner} 
        onClick={() => document.getElementById('file-upload').click()} // trigger file input
      >
        {/* IMAGE PREVIEW */}
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className={styles.previewImage} />
        ) : (
          <img 
            src="/images/drag.webp"  // default image if nothing selected
            alt="Placeholder" 
            className={styles.previewImage} 
          />
        )}

        {/* TEXTS */}
        <p className={styles.uploadText}>Drop or Upload your file here</p>
        <p className={styles.uploadSubText}>Browse to choose a file (jpg, png, gif)</p>

        {/* HIDDEN FILE INPUT */}
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
  );
}





