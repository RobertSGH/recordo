import React, { useState, useEffect } from 'react';
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';
import { Link, useParams, useLocation } from 'react-router-dom';
import classes from './Conversations.module.css';
import logo from '../UI/layout/icons/Recordo-Logo.png';

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
        where('participants', 'array-contains', user?.uid || null),
        where('hasMessages', '==', true)
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
    const selectedConversation = conversations.find(
      (conversation) => conversation.id === conversationId
    );
    if (selectedConversation.hasMessages) {
      setSelectedConversationId(conversationId);
      getMessages();
    }
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
        where('conversation', '==', selectedConversationId),
        orderBy('date', 'asc')
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
    const conversationRef = doc(db, 'conversations', selectedConversationId);
    await updateDoc(conversationRef, { hasMessages: true });
  };

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  );
  const recipientName =
    selectedConversation?.recipientName === user?.displayName
      ? selectedConversation?.senderName
      : selectedConversation?.recipientName;

  const handleFetchConversations = () => {
    fetchconversations();
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const displayName = searchParams.get('displayName');

  return (
    <div className={classes.messagingPageContainer}>
      <div className={classes.container}>
        <div className={classes.conversations}>
          <div className={classes.conversationsContent}>
            <div className={classes.conversationsHeader}>
              <Link to='/' className={classes.logo}>
                <img src={logo} alt='Logo' />
              </Link>
            </div>
            <div className={classes.conversationsList}>
              {conversations.length > 0 ? (
                <ul>
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.id}
                      className={
                        conversation.id === selectedConversationId
                          ? classes.selected
                          : ''
                      }
                    >
                      <Link
                        to={`/conversations/${conversation.id}`}
                        onClick={() =>
                          handleSelectConversation(conversation.id)
                        }
                      >
                        <img
                          src={
                            conversation.senderPhoto === user?.photoURL
                              ? conversation.recipientPhoto
                              : conversation.senderPhoto
                          }
                          alt={conversation.name}
                        />
                        <h4>
                          {conversation.recipientName === user?.displayName
                            ? conversation.senderName
                            : conversation.recipientName}
                        </h4>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={classes.noConversationsMessage}>
                  <p>No conversations found.</p>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleFetchConversations}>Load Conversations</button>
        </div>
        <div className={classes.messagescontainer}>
          {selectedConversation && (
            <div className={classes.messagesHeader}>
              <h3>{recipientName}</h3>
            </div>
          )}
          <div className={classes.messagesList}>
            {selectedConversationId && (
              <ul>
                {messages.map((message) => (
                  <li key={message.id}>
                    <div
                      className={
                        message.userId === user?.uid
                          ? classes.userMessage
                          : classes.recipientMessage
                      }
                    >
                      {message.userId !== user?.uid && (
                        <img src={message.senderPhoto} alt='Photo' />
                      )}

                      <div>
                        <h5>{message.message}</h5>
                        <p>{message.date.toLocaleString()}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedConversationId && (
            <div className={classes.messageInput}>
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
    </div>
  );
};
export default Conversations;
