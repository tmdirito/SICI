'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage'; // 1. ADDED STORAGE IMPORTS
import { firestore, storage } from '../lib/firebase'; // 2. ADDED 'storage' HERE
import { useAuth } from '../../context/AuthContext';
import styles from '../page.module.css';
import Header from '../components/Header';

// 3. ADDED THE FIREBASE IMAGE HELPER COMPONENT
function FirebaseImage({ path, altText, className }) {
  const [url, setUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!path) return;
    const fetchUrl = async () => {
      try {
        const downloadUrl = await getDownloadURL(ref(storage, path));
        setUrl(downloadUrl);
      } catch (error) {
        console.warn("Could not load image from Storage:", path);
        setHasError(true); 
      }
    };
    fetchUrl();
  }, [path]);

  if (hasError || !url) {
    return (
      <div 
        className={className} 
        style={{ 
          backgroundColor: '#eaeaea', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#888',
          fontSize: '0.9rem',
          height: '220px', // Matches your CSS
          borderRadius: '8px',
          marginBottom: '1rem'
        }}
      >
        {hasError ? 'Image Unavailable' : 'Loading...'}
      </div>
    );
  }

  return <img src={url} alt={altText} className={className} />;
}


export default function HistoryPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); 

  const handleDelete = async (animalID) => {
      if (!currentUser) return; 

        setIsDeleting(true); 
        try {
      const docRef = doc(firestore, 'users', currentUser.uid, 'animals', animalID);
      await deleteDoc(docRef);
      } catch (error) {
        console.error("Error deleting document: ", error);
      } finally {
        setIsDeleting(false); 
      }
    }
    
  useEffect(() => { 
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Fetch animal history from Firestore
  useEffect(() => {
    if (!currentUser) return; 

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Date not available'
        };
      });
      setAnimals(animalsData);
      setIsLoading(false);
    });

    return () => unsubscribe(); 
  }, [currentUser]);

  if (isLoading) {
    return <p>Loading history...</p>;
  }

  return (
    <>
    <Header />
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Your Identification History</h1>
        <p className={styles.description}>
          A log of all the animals/plants you've discovered.
        </p>

        <div className={styles.resultsContainer} style={{marginTop: '2rem', width: '100%'}}>
          {animals.length === 0 ? (
            <p>No animals identified yet. Go to "Identify Species" to start!</p>
          ) : (
            animals.map((animal) => (
              <div key={animal.id} className={styles.resultCard}>
                
                {/* 4. ADDED THE IMAGE TO THE HISTORY CARD */}
                {animal.imagePath && (
                  <FirebaseImage 
                    path={animal.imagePath} 
                    altText={animal.commonName} 
                    className={styles.cardImage} 
                  />
                )}

                <h3>{animal.commonName}</h3>
                <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
                <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
                <p style={{marginTop: '8px', color: 'var(--secondary-text)'}}>{animal.description}</p>
                <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'gray'}}>
                  <em>Identified on: {animal.createdAt}</em>
                </p>
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(animal.id)}
                      disabled={isDeleting}
                      className={styles.deleteButton}
                      >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
    </>
  );
}