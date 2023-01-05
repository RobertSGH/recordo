import classes from './Favs.module.css';
import { getFirestore } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const ChatMessaging = (props) => {
  // Initialize the state for the messages and the input field
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Use effect hook to fetch the messages from Firebase on mount
  useEffect(() => {
    const fetchMessages = async () => {
      const db = getFirestore();
      const messagesRef = db.ref('messages');
      console.log(messagesRef);
      const snapshot = await messagesRef.once('value');
      setMessages(snapshot.val());
    };
    fetchMessages();
  }, []);

  // Function to handle sending a message
  const handleSendMessage = () => {
    const db = getFirestore();
    const messagesRef = db.ref('messages');
    messagesRef.push().set({
      text: input,
      timestamp: Date.now(),
    });
    setInput('');
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatMessaging;
