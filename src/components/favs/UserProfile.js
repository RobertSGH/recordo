import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { Post } from '../feed/Post';
import { auth } from '../../App';

const UserProfile = () => {
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [userPosts, setUserPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const postsRef = collection(db, 'posts');

  const loadUserPosts = async () => {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('userId', '==', user.uid)
      // orderBy('createdAt', 'desc')
    );
    console.log(q);
    const querySnapshot = await getDocs(q);
    const loadedPosts = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    console.log(loadedPosts);

    setPosts(loadedPosts);
  };

  useEffect(() => {
    loadUserPosts();
  }, []);

  const deletePost = async (postId) => {
    const postsRef = collection(db, 'posts');
    const postToDelete = doc(postsRef, postId);

    await deleteDoc(postToDelete);
    setUserPosts(userPosts.filter((post) => post.id !== postId));
  };

  return (
    <div>
      <h2>Your Posts</h2>
      {posts.map((post) => (
        <Post key={post.id} post={post} onDelete={loadUserPosts} />
      ))}
    </div>
  );
};

export default UserProfile;
