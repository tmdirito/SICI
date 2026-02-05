'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from '../page.module.css';
import Header from '../components/Header';
import {doc, deleteDoc } from 'firebase/firestore';
export default function HistoryPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // Renamed for clarity
  // Page protector: redirect if not logged in

   const handleDelete = async (animalID) => {
      if (!currentUser) return; // Make sure user is still logged in

        setIsDeleting(true); // Disable buttons
        try {
      const docRef = doc(firestore, 'users', currentUser.uid, 'animals', animalID);
      
      await deleteDoc(docRef);

      
      } catch (error) {
        console.error("Error deleting document: ", error);
      } finally {
        setIsDeleting(false); // Re-enable buttons
      }
    }
  useEffect(() => { 
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Fetch animal history from Firestore
  useEffect(() => {
    if (!currentUser) return; // Don't run if no user is logged in

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to a readable string
          createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Date not available'
        };
      });
      setAnimals(animalsData);
      setIsLoading(false);
    });

   

    return () => unsubscribe(); // Cleanup listener on unmount
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