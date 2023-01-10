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
import classes from './Favs.module.css';
import { Route, Link } from 'react-router-dom';

const Conversations = (props) => {
  const [conversations, setConversations] = useState([]);

  async function fetchconversations() {
    try {
      const conversationsReff = collection(db, 'conversations');
      const q = query(conversationsReff, where('recipient', '==', user?.uid));

      const unsub = onSnapshot(q, (doc) => {
        const updatedConversations = doc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConversations(updatedConversations);
      });

      return () => unsub();
    } catch (error) {
      console.error(error);
    }
  }

  function handleSelectConversation(conversationId) {
    history.push(`/conversation/${conversationId}`);
  }

  return (
    <div>
      <div>
        <label onClick={fetchconversations}>Conversations</label>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation.id)}
          >
            <div onClick={getMessages}>
              <img src={conversation.photoUrl} alt={conversation.name} />
              <div>
                <h4>{conversation.senderName}</h4>
                <p>{conversation.latestMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
