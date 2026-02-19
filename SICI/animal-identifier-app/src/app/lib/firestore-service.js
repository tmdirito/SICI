import { 
  collection, doc, query, orderBy, 
  getDocs, setDoc, updateDoc, getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Import the initialized firestore object from the config
import { firestore } from './firebase'; 

/**
 * Creates a new user document in Firestore upon first sign-up/login.
 * @param {object} user - The Firebase Auth User object (user.uid, user.email).
 * @param {boolean} isExpert - Flag indicating if the user signed up as an expert.
 */
export async function createFirestoreUser(user, isExpert = false) { 
  const userRef = doc(firestore, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date(),
      isExpert: isExpert, // <-- NEW: Saves the expert status to the database
      // Initialize the Bestiary tracking map
      identifiedAnimals: {}, 
    });
    console.log(`New user document created for: ${user.email} | Expert: ${isExpert}`);
  }
}

/**
 * Saves a new animal identification entry and updates the user's bestiary map.
 * @param {string} userId - The authenticated user's UID.
 * @param {object} resultData - Data from the Gemini AI identification and image.
 */
export async function addAnimalIdentification(userId, resultData) {
  if (!userId) {
    console.error("User not authenticated. Cannot save data.");
    return;
  }

  // 1. Save to the History subcollection: /users/{userId}/history/{docId}
  const historyCollectionRef = collection(firestore, 'users', userId, 'history');
  await setDoc(doc(historyCollectionRef), {
    ...resultData,
    timestamp: serverTimestamp(),
  });

  // 2. Update the Bestiary tracking field on the user's main document
  const userRef = doc(firestore, 'users', userId);

  // Use the scientific name as a key (clean it up for safety)
  const animalKey = resultData.scientificName.replace(/\s/g, '_').toLowerCase();

  await updateDoc(userRef, {
    // This sets a field like: identifiedAnimals.ursus_arctos: true
    [`identifiedAnimals.${animalKey}`]: true,
  }, { merge: true }); // 'merge: true' ensures it only updates this field, not overwrites the whole user document

  console.log(`Identification saved and Bestiary updated for user: ${userId}`);
}


/**
 * Fetches all identification entries for the History page.
 * @param {string} userId - The authenticated user's UID.
 * @returns {Array} A list of identification history entries.
 */
export async function getHistory(userId) {
  if (!userId) return [];

  const historyCollectionRef = collection(firestore, 'users', userId, 'history');
  const q = query(historyCollectionRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  const historyList = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    // Format the timestamp for display
    timestamp: doc.data().timestamp?.toDate().toLocaleString(), 
  }));

  return historyList;
}

/**
 * Fetches the unique animals identified for the Bestiary/Achievements page.
 * @param {string} userId - The authenticated user's UID.
 * @returns {object} A map of unique identified animals (e.g., { 'ursus_arctos': true, ... }).
 */
export async function getBestiaryStatus(userId) {
    if (!userId) return {};
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // Returns the map of identified unique animals
        return userSnap.data().identifiedAnimals || {}; 
    }
    return {};
}

/**
 * NEW: Fetches the user's main profile data (including if they are an expert)
 * @param {string} userId - The authenticated user's UID.
 * @returns {object|null} The user document data or null if not found.
 */
export async function getUserProfile(userId) {
  if (!userId) return null;
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}