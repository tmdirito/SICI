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
          backgroundColor: 'rgba(12, 40, 22, 0.5)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: '#fff', fontSize: '0.9rem',
          height: '160px', 
          borderRadius: '12px', width: '100%'
        }}
      >
        {hasError ? 'Image Unavailable' : 'Loading...'}
      </div>
    );
  }

  // Removed marginBottom so we can control the gradient perfectly
  return <img src={url} alt={altText} className={className} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', height: '160px' }} />;
}

// 2. The Card Component
function AnimalCard({ animalName, discoveredData }) {
  const isActive = !!discoveredData;

  return (
    <div 
      className={`${isActive ? styles.areaAnimalActive : styles.areaAnimalInactive} glow-card`}
      style={{ 
        border: 'none',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '320px', 
        padding: 0, // <-- THIS IS THE FIX: Overrides the 16px padding from your CSS file!
        backgroundImage: isActive ? undefined : 'url(/triangle.png)',
        backgroundSize: isActive ? undefined : '100% 100%',
        backgroundPosition: isActive ? undefined : 'center',
        backgroundRepeat: isActive ? undefined : 'no-repeat',
        backgroundColor: isActive ? '#f0f4e3' : '#EDE8D0',
        backgroundBlendMode: isActive ? undefined : 'multiply'
      }} 
    >
      {isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ padding: '1rem 1rem 0 1rem' }}>
            {discoveredData.imagePath && (
              <FirebaseImage 
                path={discoveredData.imagePath} 
                altText={discoveredData.commonName} 
              />
            )}
          </div>
          
          {/* Active Card Text Container with Gradient */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1,
            justifyContent: 'flex-end',
            padding: '2rem 1.5rem 1.5rem 1.5rem', 
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px'
          }}>
            <h3 style={{ color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {discoveredData.commonName}
            </h3>
            <p style={{marginTop: '0.5rem', fontSize: '0.8rem', color: '#e0e0e0'}}>
              <em>Identified on: {discoveredData.createdAt}</em>
            </p>
          </div>

        </div>
      ) : (
        /* Inactive Card Text Container with Gradient */
        <div style={{ 
          marginTop: 'auto', 
          marginBottom: '0',
          paddingBottom: '1.5rem',
          paddingTop: '4rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px'
        }}>
          <h3 style={{ color: 'white', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{animalName}</h3>
          <p style={{ fontSize: '0.8rem', color: '#e0e0e0', margin: 0 }}>
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
  const [localAnimals, setLocalAnimals] = useState([]);
  const [regionName, setRegionName] = useState("Loading...");
  const [geoError, setGeoError] = useState("");

  const { currentUser } = useAuth();
  const router = useRouter(); 

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
      
      <style>{`
        .region-banner {
          background-color: #859c84;
          color: #ffffff;
          padding: 24px 20px;
          margin: 2rem auto 1.5rem auto;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 1200px;
          box-sizing: border-box;
          font-weight: 600;
          font-size: 2.2rem;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .region-banner {
            font-size: 1.5rem;
            padding: 16px 15px;
            margin-top: 1rem;
            border-radius: 12px;
          }
        }
      `}</style>

      <div className={styles.page}>
        
        {/* The new responsive banner */}
        <h1 className="region-banner">
          Animals In Your Area {regionName !== "Loading..." && `(${regionName})`}
        </h1>

        <main className={`${styles.main} ${styles.wideMain}`}>
          
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
                  />
                );
              })
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>Calculating your region...</p>
            )}
          </div>
          
        </main>
      </div>
    </>
  );
}