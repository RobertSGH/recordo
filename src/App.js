import React from 'react';
import Layout from './components/UI/layout/Layout';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Conversations from './components/favs/Conversations';
import { Login } from './components/UI/layout/Login';
import classes from './App.module.css';

const firebaseConfig = {
  apiKey: 'AIzaSyBNogwN8AELoHzMzvjK78eihuzOls0kx38',
  authDomain: 'recordosapp.firebaseapp.com',
  projectId: 'recordosapp',
  storageBucket: 'recordosapp.appspot.com',
  messagingSenderId: '243100701178',
  appId: '1:243100701178:web:018931f7a3f36b33981443',
  databaseURL:
    'https://recordosapp-default-rtdb.europe-west1.firebasedatabase.app',
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

function App() {
  return (
    <div className={classes.container}>
      <Router>
        <Login />
        <Routes>
          <Route exact path='*' element={<Layout />} />
          <Route path='/conversations' element={<Conversations />} />
          <Route
            path='/conversations/:conversationId'
            element={<Conversations />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
