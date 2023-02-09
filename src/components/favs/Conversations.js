import React, { useState, useEffect } from 'react';
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';
import { Link, useParams } from 'react-router-dom';
import logo from '../UI/layout/Recordo-Logo.png';
import classes from './Conversations.module.css';

const Conversations = () => {
  const { conversationId } = useParams();
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversationId || null
  );

  async function fetchconversations() {
    try {
      const conversationsReff = collection(db, 'conversations');
      const q = query(
        conversationsReff,
        where('participants', 'array-contains', user?.uid)
      );

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
    setSelectedConversationId(conversationId);
    getMessages();
  }

  useEffect(() => {
    fetchconversations();
    if (selectedConversationId) getMessages();
  }, [selectedConversationId]);

  const getMessages = async () => {
    try {
      if (!selectedConversationId) return;
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('conversation', '==', selectedConversationId)
      );
      const unsub = onSnapshot(q, (doc) => {
        const updatedMessages = doc.docs.map((doc) => {
          let data = { id: doc.id, ...doc.data() };
          data.date = data.date.toDate();
          return data;
        });
        setMessages(updatedMessages);
      });
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
      date: Timestamp.fromDate(new Date()),
    });

    setNewMessage('');
  };

  return (
    <div className={classes.container}>
      <Link to='/' className={classes.logo}>
        <img src={logo} alt='Logo' />
      </Link>
      <div className={classes.conversations}>
        {conversations.map((conversation) => (
          <Link key={conversation.id} to={`/conversations/${conversation.id}`}>
            <div onClick={() => handleSelectConversation(conversation.id)}>
              <img src={conversation.photoUrl} alt={conversation.name} />
              <div>
                <h4>
                  {conversation.recipientName === user.displayName
                    ? conversation.senderName
                    : conversation.recipientName}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className={classes.messagescontainer}>
        {selectedConversationId && (
          <div>
            {messages.map((message) => (
              <div className={classes.messages} key={message.id}>
                <p>{message.message}</p>
                <img src={message.senderPhoto} />
                <p>{message.date.toLocaleString()}</p>
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
    </div>
  );
};
export default Conversations;
