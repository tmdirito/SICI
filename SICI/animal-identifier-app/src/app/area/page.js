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
import { storage } from '../lib/firebase'; 

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
  Unknown: [
    "Feral Pigeon", 
    "House Sparrow", 
    "Brown Rat", 
    "Stray Cat" 
  ] 
};

function getZoogeographicRegion(lat, lon) {
  if (lon < -30) {
    return lat > 20 ? "Nearctic" : "Neotropical";
  } else if (lon >= -30 && lon < 60) {
    return lat > 20 ? "Palearctic" : "Afrotropical";
  } else {
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
          height: '150px', 
          borderRadius: '8px', marginBottom: '1rem', width: '100%'
        }}
      >
        {hasError ? 'Image Unavailable' : 'Loading...'}
      </div>
    );
  }

  return <img src={url} alt={altText} className={className} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', objectFit: 'cover', height: '150px' }} />;
}

// 2. The Card Component
function AnimalCard({ animalName, discoveredData, onDelete, isDeleting, index = 0 }) {
  const isActive = !!discoveredData;
  const useTriangle2 = !isActive && index % 2 !== 0;

  return (
    <div 
      className={isActive ? styles.areaAnimalActive : styles.areaAnimalInactive}
      style={{ 
        border: isActive ? '2px solid #4CAF50' : 'none',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        height: '100%', 
        minHeight: '280px', 
        backgroundImage: useTriangle2 ? 'url(/triangle2.png)' : undefined,
        backgroundSize: useTriangle2 ? '100% 100%' : undefined,
        backgroundPosition: useTriangle2 ? 'center' : undefined,
        backgroundRepeat: useTriangle2 ? 'no-repeat' : undefined
      }} 
    >
      {isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem' }}>
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
          marginTop: useTriangle2 ? '0' : 'auto', 
          marginBottom: useTriangle2 ? 'auto' : '0',
          paddingBottom: '3rem',
          paddingTop: '3rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{ color: 'white', textAlign: 'center' }}>{animalName}</h3>
          <p style={{ fontSize: '0.8rem', color: 'white', margin: 0 }}>
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
  const [localAnimals, setLocalAnimals] = useState([]);
  const [regionName, setRegionName] = useState("Loading...");
  const [geoError, setGeoError] = useState("");

  const { currentUser } = useAuth();
  const router = useRouter(); 

  const handleDelete = async (id) => {
    console.log("Delete clicked for ID:", id);
    // TODO: Add your Firestore deleteDoc logic here
  };

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
          setRegionName("Nearctic"); 
          setLocalAnimals(zoogeographicAnimals["Nearctic"]);
        }
      );
    } else {
      setGeoError("Geolocation not supported by this browser.");
      setRegionName("Nearctic");
      setLocalAnimals(zoogeographicAnimals["Nearctic"]);
    }
  }, []);

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
      setAnimals(animalsData); 
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
            {localAnimals.length > 0 ? (
              localAnimals.map((animalName, index) => {
                const discoveredAnimal = animals.find((a) => {
                  if (!a.commonName) return false; 
                  
                  let dbName = a.commonName.toLowerCase().replace(/[^a-z]/g, '');
                  let targetName = animalName.toLowerCase().replace(/[^a-z]/g, '');

                  dbName = dbName.replace(/(.)\1+/g, '$1');
                  targetName = targetName.replace(/(.)\1+/g, '$1');

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