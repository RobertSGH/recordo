import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';

const MessagingComponent = (props) => {
  const { message } = props;
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [senderNames, setSenderNames] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    const conversationsReff = collection(db, 'conversations');
    const unsub = onSnapshot(conversationsReff, (doc) => {
      const updatedConversations = doc.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(updatedConversations);
    });

    return () => unsub();
  }, []);

  // const getMessages = async () => {
  //   const messagesRef = collection(db, 'messages');
  //   const messagesDoc = query(messagesRef, where('recipient', '==', user.uid));
  //   const data = await getDocs(messagesDoc);
  //   console.log(data);

  //   setMessages(
  //     data.docs.map((doc) => ({
  //       message: doc.data().message,
  //       messageId: doc.id,
  //       createdAt: doc.data().createdAt,
  //       sender: doc.data().sender,
  //     }))
  //   );
  //   console.log(messages);
  // };

  // useEffect(() => {
  //   getMessages();
  // });

  function handleChange(event) {
    // setMessage(event.target.value);
  }

  function handleSubmit(event) {
    // event.preventDefault();
    // const messagesRef = getFirestore().doc(`messages/${recipient}`);
    // messagesRef
    //   .update({
    //     messages: getFirestore().FieldValue.arrayUnion({
    //       sender: getAuth().currentUser.uid,
    //       message,
    //       timestamp: getFirestore().FieldValue.serverTimestamp(),
    //     }),
    //   })
    //   .then(() => {
    //     setMessage('');
    //   });
  }

  function handleSelectConversation(conversationId) {
    setSelectedConversationId(conversationId);
  }

  return (
    <div className='messaging-container'>
      <div className='conversations'>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation ${
              conversation.id === selectedConversationId ? 'selected' : ''
            }`}
            onClick={() => handleSelectConversation(conversation.id)}
          >
            <div className='conversation-header'>
              <img src={conversation.photoUrl} alt={conversation.name} />
              <div className='conversation-info'>
                <h4>{conversation.name}</h4>
                <p>{conversation.latestMessage}</p>
              </div>
              <div className='timestamp'>
                {/* {new Date(conversation.timestamp.toDate()).toLocaleTimeString()} */}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* {selectedConversationId && (
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === firebase.auth().currentUser.uid ? 'sent' : 'received'}`}>
              <p>{message.message}</p>
              {message.sender !== firebase.auth().currentUser.uid && (
                <div className="sender-name">{senderNames[message.sender]}</div>
              )}
              <div className="timestamp">
                {new Date(message.timestamp.toDate()).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedConversationId && (
        <div className="message-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )} */}
    </div>
  );
};

export default MessagingComponent;
