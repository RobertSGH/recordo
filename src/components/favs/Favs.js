import React, { useState } from 'react';
import {
  collection,
  getFirestore,
  query,
  where,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import classes from './Favs.module.css';
import useMessaging from './UseMessaging';
import { useEffect } from 'react';

const MessagingComponent = (props) => {
  const db = getFirestore();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { startConversation } = useMessaging();

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() !== '') {
        const startName = searchQuery.trim();
        const endName =
          startName.slice(0, -1) +
          String.fromCharCode(startName.charCodeAt(startName.length - 1) + 1);

        const q = query(
          collection(db, 'users'),
          where('displayName', '>=', startName),
          where('displayName', '<', endName),
          limit(10)
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
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className={classes.container}>
      <div className={classes.search}>
        <input
          value={searchQuery}
          placeholder='🔍Find friends!'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
