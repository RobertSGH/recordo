import React from 'react';
import Layout from './components/UI/layout/Layout';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { useContext } from 'react';
// import AuthContext from './store/auth-context';

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
  // const authCtx = useContext(AuthContext);
  // console.log(authCtx);

  return <Layout />;
}

export default App;
