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

export const Login = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [siggnedIn, setSiggnedIn] = useState(false);
  const [guestSiggnedIn, setGuestSiggnedIn] = useState(false);

  const signInAsGuest = async () => {
    await signInAnonymously(auth);
    await updateProfile(auth.currentUser, {
      displayName: 'Guest' + Math.floor(Math.random() * 100 + 1),
    });
    setSiggnedIn(true);
    setGuestSiggnedIn(true);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
    setSiggnedIn(true);
  };

  const signUserOut = async () => {
    await signOut(auth);
    setSiggnedIn(false);
  };

  return (
    <div className={classes.login}>
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
      <p>{user?.displayName || user?.uid}</p>
      <div className={classes.items}>
        {guestSiggnedIn && <img src={user?.photoURL} />}
        {siggnedIn && (
          <button className={classes.button} onClick={signUserOut}>
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};
