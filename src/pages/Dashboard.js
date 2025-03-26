import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Authentication context
import { getSavedStudies, getNotes } from '../services/firestoreService'; // Fetch data

const Dashboard = () => {
  const [gptResponse, setGptResponse] = useState("");
  const [userStudies, setUserStudies] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const { user, signOut } = useAuth();  // UseAuth hook for auth state

  useEffect(() => {
    const fetchData = async () => {
      setUserStudies(await getSavedStudies(user.id));
      setUserNotes(await getNotes(user.id));
    };

    fetchData();
  }, [user]);

  const handleGptQuery = async (query) => {
    const response = await chatGptService.ask(query);  // GPT service function
    setGptResponse(response);
  };

  return (
    <div className="dashboard">
      {/* Dashboard code here */}
    </div>
  );
};

export default Dashboard;
