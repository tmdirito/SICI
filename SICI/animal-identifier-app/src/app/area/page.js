'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot, addDoc, doc, setDoc, limit, getDocs } from 'firebase/firestore';
import { firestore, storage } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header';
import styles from '../page.module.css';
import { ref, getDownloadURL } from 'firebase/storage';

// --- Helper component to load Firebase images ---
function FirebaseImage({ path, altText, className, style }) {
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
          backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: '#888', fontSize: '0.9rem',
          height: '150px', 
          borderRadius: '8px', marginBottom: '1rem', width: '100%',
          ...style
        }}
      >
        {hasError ? 'Image Unavailable' : 'Loading...'}
      </div>
    );
  }

  return <img src={url} alt={altText} className={className} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', objectFit: 'cover', height: '150px', ...style }} />;
}

// --- NEW: The Clickable Location Card Component ---
function LocationCard({ locationName, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        border: '3px solid #6c8954',
        borderRadius: '24px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px',
        margin: '2rem auto',
        minHeight: '400px',
        backgroundImage: 'url(/triangle2.png)', // Uses your triangle image!
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: '1.5rem 3rem',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#918f8f', margin: 0, fontSize: '2rem' }}>{locationName}</h2>
        <p style={{ color: '#6c8954', marginTop: '10px', fontWeight: 'bold' }}>Click to discover wildlife!</p>
      </div>
    </div>
  );
}

// --- UPDATED: The Animal Card Component ---
function AnimalCard({ animalName, discoveredData, onDelete, isDeleting, index = 0 }) {
  const isActive = !!discoveredData;

  return (
    <div 
      className={isActive ? styles.areaAnimalActive : styles.areaAnimalInactive}
      style={{ 
        border: isActive ? '2px solid #6c8954' : '2px dashed #ccc',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        height: '100%', 
        minHeight: '280px', 
        backgroundColor: isActive ? 'white' : '#f4f4f4' // White if found, light gray if unfound
      }} 
    >
      {isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
          {/* THE STICKER (Found) */}
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%', padding: '6px',
            backgroundColor: 'white', boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            transform: index % 2 === 0 ? 'rotate(-4deg)' : 'rotate(4deg)', 
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center',
            justifyContent: 'center', overflow: 'hidden'
          }}>
            {discoveredData.imagePath && (
              <FirebaseImage 
                path={discoveredData.imagePath} 
                altText={discoveredData.commonName} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', margin: 0 }}
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#111' }}>{discoveredData.commonName}</h3>
            <p style={{marginTop: '0.5rem', fontSize: '0.8rem', color: '#555'}}>
              <em>Identified on: <br/> {discoveredData.createdAt}</em>
            </p>
          </div>
        </div>
      ) : (
        <div style={{ 
          padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center', justifyContent: 'center', height: '100%'
        }}>
          {/* GRAY QUESTION MARK (Unfound) */}
          <div style={{
            width: '100px', height: '100px', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Make sure you add a question-mark.png to your public folder! */}
            <img src="/question-mark.png" alt="Unknown" style={{ width: '80%', opacity: 0.3 }} />
          </div>
          <h3 style={{ color: '#555' }}>{animalName}</h3>
          <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, marginTop: '5px' }}>
            <em>Undiscovered</em>
          </p>
        </div>
      )}
    </div>
  );
}

// --- Main Page Component ---
export default function AreaPage() {
  const [step, setStep] = useState('loading'); // Start in loading state
  const [locationInput, setLocationInput] = useState('');
  const [activeLocation, setActiveLocation] = useState('');
  
  const [userAnimals, setUserAnimals] = useState([]);
  const [geminiAnimals, setGeminiAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();
  const router = useRouter();

  // 1. PERSISTENCE: Check if user already has a saved location on mount
  useEffect(() => {
    if (!currentUser) return;

    const fetchSavedLocation = async () => {
      const locRef = collection(firestore, 'users', currentUser.uid, 'activeLocation');
      const q = query(locRef, limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const savedData = querySnapshot.docs[0].data();
        setActiveLocation(savedData.name);
        setGeminiAnimals(savedData.animals || []);
        setStep('card'); // Go straight to the card if they have one saved
      } else {
        setStep('input'); // No location found, show input
      }
    };

    fetchSavedLocation();
  }, [currentUser]);

  // 2. Fetch user's found animals (Your existing listener)
  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Date not available'
        };
      });
      setUserAnimals(animalsData); 
    });
    return () => unsubscribe();
  }, [currentUser]);

  // 3. STEP 1: Save Location to Firestore and move to Card
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!locationInput.trim() || !currentUser) return;

    const locName = locationInput.trim();
    setActiveLocation(locName);
    
    // Save this as the "active" location in Firestore
    try {
      await setDoc(doc(firestore, 'users', currentUser.uid, 'activeLocation', 'current'), {
        name: locName,
        updatedAt: new Date(),
        animals: [] // Reset animals for the new location
      });
      setStep('card');
    } catch (err) {
      console.error("Error saving location:", err);
    }
  };

  // 4. STEP 2: Trigger Gemini and SAVE the results to the location document
  const handleCardClick = async () => {
    setStep('grid'); 
    setIsLoading(true);

    try {
      const foundAnimalNames = userAnimals.map(a => a.commonName).filter(Boolean).join(', ');

      const requestRef = await addDoc(collection(firestore, 'users', currentUser.uid, 'locationRequests'), {
        location: activeLocation,
        alreadyFound: foundAnimalNames,
        status: 'pending',
        createdAt: new Date()
      });

      const unsubscribe = onSnapshot(doc(firestore, 'users', currentUser.uid, 'locationRequests', requestRef.id), async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.status === 'completed' && data.animals) {
            setGeminiAnimals(data.animals);
            
            // SAVE the generated animals to the persistent location doc
            await setDoc(doc(firestore, 'users', currentUser.uid, 'activeLocation', 'current'), {
              name: activeLocation,
              animals: data.animals,
              updatedAt: new Date()
            }, { merge: true });

            setIsLoading(false);
            unsubscribe();
          } 
          else if (data.status === 'error') {
            setGeminiAnimals(["Mule Deer", "Bison", "Red Fox", "Raccoon", "Monarch Butterfly"]);
            setIsLoading(false);
            unsubscribe();
          }
        }
      });

    } catch (error) {
      console.error("Failed to request:", error.message);
      setIsLoading(false);
    }
  };

  // --- Render Logic ---
  if (step === 'loading') return <div className={styles.page} style={{textAlign: 'center', padding: '5rem'}}>Loading your adventure...</div>;

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={`${styles.main} ${styles.wideMain}`}>
          <h1 className={styles.title} style={{color: "var(--secondary-text)", textAlign: 'center'}}>
            Explore Local Wildlife
          </h1>

          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <form onSubmit={handleLocationSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
              <input 
                type="text" 
                placeholder="Enter a City, Park, or Trail..." 
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                style={{ padding: '1rem', fontSize: '1.2rem', width: '100%', maxWidth: '400px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '1rem' }}
              />
              <button type="submit" className={styles.button}>Generate Location Card</button>
            </form>
          )}

          {/* STEP 2: PERSISTENT CARD */}
          {step === 'card' && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: "var(--secondary-text)" }}>Your Active Adventure:</p>
              <LocationCard locationName={activeLocation} onClick={handleCardClick} />
              <button onClick={() => setStep('input')} className={styles.button} style={{ backgroundColor: 'transparent', color: '#6c8954', border: '1px solid #6c8954', marginTop: '1rem' }}>
                Change Location
              </button>
            </div>
          )}

          {/* STEP 3: ANIMAL GRID (Loading or Results) */}
          {step === 'grid' && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: "var(--secondary-text)", margin: 0 }}>Wildlife in {activeLocation}</h2>
                <button onClick={() => setStep('card')} className={styles.button} style={{ padding: '0.5rem 1rem' }}>Back to Card</button>
              </div>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ fontSize: '1.2rem', color: "var(--secondary-text)" }}>Gemini is scanning {activeLocation} for wildlife...</p>
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {geminiAnimals.map((animalName, index) => {
                    // Check if Gemini's suggested animal exists in the user's found list
                    const discoveredAnimal = userAnimals.find((a) => {
                      if (!a.commonName) return false; 
                      let dbName = a.commonName.toLowerCase().replace(/[^a-z]/g, '');
                      let targetName = animalName.toLowerCase().replace(/[^a-z]/g, '');
                      return dbName.includes(targetName) || targetName.includes(dbName);
                    });

                    return (
                      <AnimalCard 
                        key={index} 
                        animalName={animalName} 
                        discoveredData={discoveredAnimal}
                        index={index}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}