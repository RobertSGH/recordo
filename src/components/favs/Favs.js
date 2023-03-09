import React, { useState } from 'react';
import {
  collection,
  getFirestore,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import classes from './Favs.module.css';
import useMessaging from './UseMessaging';

const MessagingComponent = (props) => {
  const db = getFirestore();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { startConversation } = useMessaging();

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

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <input
          value={searchQuery}
          placeholder='Find friends!'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <ul>
        {searchResults.map((user) => (
          <li className={classes.results} key={user.recipientId}>
            <img src={user.photoURL} alt={user.displayName} />
            <p>{user.displayName}</p>
            <button
              onClick={() =>
                startConversation(
                  user.recipientId,
                  user.displayName,
                  user.photoURL
                )
              }
            >
              Start conversation
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MessagingComponent;
