'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header';
import styles from '../page.module.css';
import Link from 'next/link';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase'; // Make sure 'storage' is exported from your firebase.js

// 1. Dictionary of animals by Zoogeographic Region
// 1. Dictionary of common animals by Zoogeographic Region
const zoogeographicAnimals = {
  Nearctic: [
    "Eastern Gray Squirrel", 
    "American Robin", 
    "Raccoon", 
    "White-tailed Deer",
    "Mallard Duck"
  ],
  Neotropical: [
    "Green Iguana", 
    "Great-tailed Grackle", 
    "Capybara", 
    "White-nosed Coati",
    "Rufous-collared Sparrow"
  ],
  Palearctic: [
    "Red Fox", 
    "European Robin", 
    "Eurasian Magpie", 
    "Common Wood Pigeon",
    "European Hedgehog"
  ],
  Afrotropical: [
    "Agama Lizard", 
    "Vervet Monkey", 
    "Pied Crow", 
    "Helmeted Guineafowl",
    "Sacred Ibis"
  ],
  Indomalayan: [
    "Common Myna", 
    "Rhesus Macaque", 
    "Indian Palm Squirrel", 
    "House Crow",
    "Asian Toad"
  ],
  Australasian: [
    "Australian Magpie", 
    "Rainbow Lorikeet", 
    "Common Brushtail Possum", 
    "Laughing Kookaburra",
    "Eastern Grey Kangaroo"
  ],
  // The fallback for errors or middle-of-the-ocean coordinates
  Unknown: [
    "Feral Pigeon", 
    "House Sparrow", 
    "Brown Rat", 
    "Stray Cat" 
  ] 
};

// Helper function to roughly estimate region based on coordinates
// Note: This uses simplified bounding boxes. For 100% precision in a production app, 
// you would want to use a geocoding API or a spatial database.
function getZoogeographicRegion(lat, lon) {
  if (lon < -30) {
    // Americas
    return lat > 20 ? "Nearctic" : "Neotropical";
  } else if (lon >= -30 && lon < 60) {
    // Europe / Africa / Middle East
    return lat > 20 ? "Palearctic" : "Afrotropical";
  } else {
    // Asia / Australia
    if (lat > 30) return "Palearctic";
    if (lat > -10) return "Indomalayan";
    return "Australasian";
  }
}
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
          backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: '#888', fontSize: '0.9rem',
          height: '150px', // Adjusted height for a smaller area card
          borderRadius: '8px', marginBottom: '1rem', width: '100%'
        }}
      >
        {hasError ? 'Image Unavailable' : 'Loading...'}
      </div>
    );
  }

  return <img src={url} alt={altText} className={className} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', objectFit: 'cover', height: '150px' }} />;
}
// 2. The Card Component (unchanged)
function AnimalCard({ animalName, discoveredData, onDelete, isDeleting, index = 0 }) {
  const isActive = !!discoveredData;
  
  // Magic logic: If it's undiscovered AND an odd number in the grid, flip it!
  const isUpsideDown = !isActive && index % 2 !== 0;

  return (
    <div 
      className={isActive ? styles.areaAnimalActive : styles.areaAnimalInactive}
      style={{ 
        border: isActive ? '2px solid #4CAF50' : 'none',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        // FIX: The two lines below force all cards to take up the full row height, fixing your spacing gaps
        height: '100%', 
        minHeight: '280px', 
        // FIX: Flips the entire grey shape upside down
        transform: isUpsideDown ? 'rotate(180deg)' : 'none' 
      }} 
    >
      {isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {discoveredData.imagePath && (
            <FirebaseImage 
              path={discoveredData.imagePath} 
              altText={discoveredData.commonName} 
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <h3>{discoveredData.commonName}</h3>
            <p style={{marginTop: '0.5rem', fontSize: '0.8rem', color: 'gray'}}>
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
          </div>
        </div>
      ) : (
        <div style={{ 
          // FIX: Counter-rotates the text so it isn't upside down, keeping it readable
          transform: isUpsideDown ? 'rotate(-180deg)' : 'none', 
          marginTop: 'auto', // Pushes text to the wide base of the triangle
          paddingBottom: '3rem',
          paddingTop: '3rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{ color: 'var(--secondary-text)', textAlign: 'center' }}>{animalName}</h3>
          <p style={{ fontSize: '0.8rem', color: 'gray', margin: 0 }}>
            <em>Undiscovered</em>
          </p>
        </div>
      )}
    </div>
  );
}

// 3. Main page component
export default function AreaPage() {
  const [animals, setAnimals] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // New state variables for location
  const [localAnimals, setLocalAnimals] = useState([]);
  const [regionName, setRegionName] = useState("Loading...");
  const [geoError, setGeoError] = useState("");

  const { currentUser } = useAuth();
  const router = useRouter(); 

  const handleDelete = async (id) => {
    console.log("Delete clicked for ID:", id);
    // TODO: Add your Firestore deleteDoc logic here
  };

  // Effect to get the user's location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const region = getZoogeographicRegion(latitude, longitude);
          
          setRegionName(region);
          setLocalAnimals(zoogeographicAnimals[region]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setGeoError("Location access denied. Showing default region.");
          setRegionName("Nearctic"); // Default fallback
          setLocalAnimals(zoogeographicAnimals["Nearctic"]);
        }
      );
    } else {
      setGeoError("Geolocation not supported by this browser.");
      setRegionName("Nearctic");
      setLocalAnimals(zoogeographicAnimals["Nearctic"]);
    }
  }, []);

  // Effect to grab the user's discovered animals from Firebase
  // Effect to get the user's location on mount
  // Effect to grab the user's discovered animals from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    // Using onSnapshot so it updates in real-time
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Safely format the date if it exists
          createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Date not available'
        };
      });
      setAnimals(animalsData); // This populates the array your matching logic relies on!
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={`${styles.main} ${styles.wideMain}`}>
          
          <h1 className={styles.title}>
            Animals In Your Area {regionName !== "Loading..." && `(${regionName})`}
          </h1>
          
          {geoError && (
            <p style={{ color: 'orange', textAlign: 'center', marginBottom: '1rem' }}>
              {geoError}
            </p>
          )}

          <div className={styles.cardGrid}>
            {/* Map over the dynamic localAnimals instead of a hardcoded array */}
            {localAnimals.length > 0 ? (
              localAnimals.map((animalName, index) => {
                // NEW, FORGIVING WAY
// NEW, SUPER FORGIVING WAY
const discoveredAnimal = animals.find((a) => {
  if (!a.commonName) return false; 
  
  // 1. Lowercase and remove all spaces, dashes, and special characters
  let dbName = a.commonName.toLowerCase().replace(/[^a-z]/g, '');
  let targetName = animalName.toLowerCase().replace(/[^a-z]/g, '');

  // 2. The Magic Trick: Remove consecutive double letters
  // This turns "raccoon" and "racoon" both into "racon"
  dbName = dbName.replace(/(.)\1+/g, '$1');
  targetName = targetName.replace(/(.)\1+/g, '$1');

  // 3. Check if they match
  return dbName.includes(targetName) || targetName.includes(dbName);
});

                return (
                  <AnimalCard 
                    key={discoveredAnimal ? discoveredAnimal.id : index} 
                    animalName={animalName} 
                    discoveredData={discoveredAnimal}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    index={index}
                  />
                );
              })
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>Calculating your region...</p>
            )}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link href="/">
              <button className={styles.button}>Back to Scanner</button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}