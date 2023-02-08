import { provider } from '../../../App';
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import classes from './Login.module.css';
import { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import logo from './Recordo-Logo.png';
import { Link } from 'react-router-dom';

export const Login = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [siggnedIn, setSiggnedIn] = useState(false);
  const db = getFirestore();

  const signInAsGuest = async () => {
    await signInAnonymously(auth);
    await updateProfile(auth.currentUser, {
      displayName: 'Guest' + Math.floor(Math.random() * 100 + 1),
    });
    setSiggnedIn(true);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);

    setSiggnedIn(true);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } catch (error) {
        console.error(error);
      }
    });

    return unsubscribe;
  };

  const signUserOut = async () => {
    await signOut(auth);
    setSiggnedIn(false);
  };

  return (
    <div className={classes.login}>
      <Link to='/' className={classes.logo}>
        <img src={logo} alt='Logo' />
      </Link>
      {!user ? (
        <button className={classes.button} onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      ) : (
        ''
      )}
      {!user ? (
        <button className={classes.button} onClick={signInAsGuest}>
          Continue as guest
        </button>
      ) : (
        ''
      )}
      <div className={classes.items}>
        <p>{user?.displayName || user?.uid}</p>
        {siggnedIn && <img src={user?.photoURL} alt='imglogo' />}
        {user && (
          <button className={classes.button} onClick={signUserOut}>
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};
