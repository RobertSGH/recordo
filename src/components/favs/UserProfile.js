import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { Post } from '../feed/Post';
import { auth } from '../../App';
import classes from './UserProfile.module.css';
import { Link } from 'react-router-dom';
import logo from '../UI/layout/icons/Recordo-Logo.png';

const UserProfile = () => {
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [userPosts, setUserPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  const loadUserPosts = async () => {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const loadedPosts = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    setPosts(loadedPosts);
  };

  useEffect(() => {
    loadUserPosts();
  }, []);

  return (
    <div className={classes.postlistcontainer}>
      <div className={classes.postlistHeader}>
        <Link to='/' className={classes.logo}>
          <img src={logo} alt='Logo' />
        </Link>
        <h3>Posts</h3>
      </div>
      <div className={classes.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onDelete={loadUserPosts}
              currentUser={user}
            />
          ))
        ) : (
          <div className={classes.noPostsMessage}>
            <p>You haven't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
