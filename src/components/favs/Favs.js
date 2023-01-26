import React, { useState, useEffect } from 'react';
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  Timestamp,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';

const MessagingComponent = (props) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const getMessages = async () => {
    try {
      if (!selectedConversationId) return;
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('conversation', '==', selectedConversationId)
      );
      const unsub = onSnapshot(q, (doc) => {
        const updatedMessages = doc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
    });

    setNewMessage('');
  };

  function handleSelectConversation(conversationId) {
    setSelectedConversationId(conversationId);
    getMessages();
  }

  useEffect(() => {
    if (selectedConversationId) getMessages();
  }, [selectedConversationId]);

  const startConversation = async (recipientId, displayName) => {
    try {
      const conversationsRef = collection(db, 'conversations');

      await addDoc(conversationsRef, {
        participants: [user.uid, recipientId],
        recipientName: displayName,
        senderName: user.displayName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
                <h4>{conversation.recipientName}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedConversationId && (
        <div>
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
