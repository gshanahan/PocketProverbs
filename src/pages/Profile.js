import React from 'react';
import { useAuth } from '../contexts/AuthContext';  // UseAuth hook for user data

const Profile = () => {
  const { user } = useAuth();  // Get user data from context

  return (
    <div className="profile">
      <h1>Your Profile</h1>
      <img src={user.profilePic} alt="Profile" />
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>
      {/* More user info */}
    </div>
  );
};

export default Profile;
