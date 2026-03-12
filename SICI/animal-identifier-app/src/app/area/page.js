'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header';
import styles from '../page.module.css';
import Link from 'next/link';
import Image from 'next/image';

// 1. Your master list of animals for the area
const areaAnimals = ["Red Deer", "Scarlet Macaw", "Axolotyl", "Green Iguana"];

// 2. The Card Component
function AnimalCard({ animalName, discoveredData, onDelete, isDeleting }) {
  // If we have data from Firebase, the animal is active!
  const isActive = !!discoveredData;

  return (
    <div 
      className={isActive ? styles.areaAnimalActive : styles.areaAnimalInactive}
      style={{ 
        border: isActive ? '2px solid #4CAF50' : 'none',
        transition: 'border 0.2s ease-in-out'
      }} 
    >
      {isActive ? (
        // --- ACTIVE STATE (Found in Firebase) ---
        <>
          <h3>{discoveredData.commonName}</h3>
          <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'gray'}}>
            <em>Identified on: {discoveredData.createdAt}</em>
          </p>

          <div style={{ textAlign: 'right', marginTop: 'auto' }}>
            <button
              onClick={() => onDelete(discoveredData.id)}
              disabled={isDeleting}
              className={styles.deleteButton}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      ) : (
        // --- INACTIVE STATE (Not found in Firebase yet) ---
        <>
          {/* The triangle background is handled by the .areaAnimalInactive CSS class */}
          <h3 style={{ color: 'var(--secondary-text)', marginTop: 'auto' }}>{animalName}</h3>
          <p style={{ fontSize: '0.8rem', color: 'gray' }}>
            <em>Undiscovered</em>
          </p>
        </>
      )}
    </div>
  );
}

// 3. Your main page component
export default function AreaPage() {
  const [animals, setAnimals] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { currentUser } = useAuth();
  const router = useRouter(); 

  // Placeholder for your delete logic
  const handleDelete = async (id) => {
    console.log("Delete clicked for ID:", id);
    // TODO: Add your Firestore deleteDoc logic here
  };

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
    });

    return () => unsubscribe();
  }, [currentUser]); 

  return (
    <>
      <Header />
      <div className={styles.page}>
        {/* Combine the standard main style with the wide modifier for this page only */}
        <main className={`${styles.main} ${styles.wideMain}`}>
          <h1 className={styles.title}>Animals In Your Area</h1>
          
          {/* Use the new card grid to lay them out left-to-right */}
          <div className={styles.cardGrid}>
            {areaAnimals.map((animalName, index) => {
              
              // Check if the user has discovered this specific animal
              const discoveredAnimal = animals.find(
                (a) => a.commonName.toLowerCase() === animalName.toLowerCase()
              );

              return (
                <AnimalCard 
                  key={discoveredAnimal ? discoveredAnimal.id : index} 
                  animalName={animalName} 
                  discoveredData={discoveredAnimal}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              );
            })}
          </div>

          <div style={{ marginTop: '2rem' }}>
            {/* You can replace this with a standard button if you don't need the big triangle at the bottom anymore */}
            <Link href="/">
              <button className={styles.button}>Back to Scanner</button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}