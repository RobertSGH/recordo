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

const MessagingComponent = (props) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

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

  const getMessages = async () => {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef);

      const unsub = onSnapshot(q, (doc) => {
        const updatedMessages = doc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(updatedMessages);
      });
      console.log(messages);
      return () => unsub();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    const messagesRef = collection(db, 'messages');

    await addDoc(messagesRef, {
      conversation: selectedConversationId,
      message: newMessage,
      userId: user?.uid,
      senderName: user?.displayName,
      senderPhoto: user?.photoURL,
    });

    setNewMessage('');
  };

  function handleSelectConversation(conversationId) {
    setSelectedConversationId(conversationId);
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
      {selectedConversationId && (
        <div className={classes.messages}>
          {messages.map((message) => (
            <div key={message.id}>
              <p>{message.message}</p>
              <img src={message.senderPhoto} />
            </div>
          ))}
        </div>
      )}
      {selectedConversationId && (
        <div>
          <input
            type='text'
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder='Type a message...'
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default MessagingComponent;
