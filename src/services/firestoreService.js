import { db, auth } from './firebase';  // Initialize Firebase services

// Fetch saved Bible studies for the user
export const getSavedStudies = async (userId) => {
  const studiesRef = db.collection('studies').where('userId', '==', userId);
  const snapshot = await studiesRef.get();
  return snapshot.docs.map(doc => doc.data());
};

// Fetch user notes from Firestore
export const getNotes = async (userId) => {
  const notesRef = db.collection('notes').where('userId', '==', userId);
  const snapshot = await notesRef.get();
  return snapshot.docs.map(doc => doc.data());
};

// GPT interaction API
export const chatGptService = {
  ask: async (query) => {
    const response = await fetch('/api/gpt-query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.response;
  },
};
