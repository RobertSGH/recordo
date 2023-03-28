import React from 'react';
import Layout from './components/UI/layout/Layout';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Conversations from './components/favs/Conversations';
import classes from './App.module.css';
import UserProfile from './components/favs/UserProfile';
import firebaseConfig from './firebaseConfig';

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

function App() {
  return (
    <div className={classes.container}>
      <Router>
        <Routes>
          <Route exact path='*' element={<Layout />} />
          <Route path='/conversations' element={<Conversations />} />
          <Route
            path='/conversations/:conversationId'
            element={<Conversations />}
          />
          <Route path='/myprofile' element={<UserProfile />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
