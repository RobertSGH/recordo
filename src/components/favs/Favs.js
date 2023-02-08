import React, { useState } from 'react';
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';
import { useNavigate } from 'react-router-dom';

const MessagingComponent = (props) => {
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('displayName', '==', searchQuery)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setSearchResults(
          querySnapshot.docs.map((doc) => ({
            recipientId: doc.id,
            ...doc.data(),
          }))
        );
      });
      return () => unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  const startConversation = async (recipientId, displayName) => {
    try {
      const conversationsRef = collection(db, 'conversations');

      await addDoc(conversationsRef, {
        participants: [user.uid, recipientId],
        recipientName: displayName,
        senderName: user.displayName,
      });

      navigate('/conversations');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.map((user) => (
        <div key={user.recipientId}>
          <img src={user.photoURL} alt={user.displayName} />
          <p>{user.displayName}</p>
          <button
            onClick={() =>
              startConversation(user.recipientId, user.displayName)
            }
          >
            Start conversation
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessagingComponent;
