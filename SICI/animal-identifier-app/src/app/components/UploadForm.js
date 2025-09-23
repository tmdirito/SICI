// src/app/components/UploadForm.js

'use client'; 

import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // New state to hold the list of animals from the database
  const [animals, setAnimals] = useState([]);

  // useEffect is a React hook that runs code after the component loads.
  // It's the perfect place to set up our real-time listener.
  useEffect(() => {
    // In a real app, you would get the real logged-in user's ID
    const userId = 'test-user'; 
    if (!userId) return;

    // This is the query to get the user's animals from Firestore
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    // onSnapshot creates the real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const animalsData = [];
      querySnapshot.forEach((doc) => {
        animalsData.push({ id: doc.id, ...doc.data() });
      });
      // Update our component's state with the new data
      setAnimals(animalsData);
    });

    // This is a cleanup function to stop listening when the component is removed
    return () => unsubscribe();
  }, []); // The empty array [] means this effect runs only once

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const userId = 'test-user'; 
      const filePath = `userUploads/${userId}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, filePath);

      // The frontend's only job is to upload the file.
      await uploadBytes(storageRef, file);
      console.log('File uploaded! The backend is now processing it.');

    } catch (err) {
      console.error("Upload failed:", err);
      setError('The file upload failed. Please try again.');
    } finally {
      setIsLoading(false);
      setFile(null); // Clear the file input after upload
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={isLoading || !file}>
          {isLoading ? 'Uploading...' : 'Identify Animal'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <hr style={{margin: '2rem 0'}} />

      {/* This section now maps over the 'animals' state and displays each one */}
      <h2>Your Identified Animals</h2>
      {animals.length === 0 && !isLoading && <p>No animals identified yet.</p>}
      {animals.map((animal) => (
        <div key={animal.id} style={{border: '1px solid #ccc', padding: '1rem', margin: '1rem 0'}}>
          <h3>Result: {animal.commonName}</h3>
          <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
          <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
          <p>{animal.description}</p>
        </div>
      ))}
    </div>
  );
}