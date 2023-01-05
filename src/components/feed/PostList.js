import {
  getDocs,
  collection,
  getFirestore,
  onSnapshot,
  doc,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Post } from './Post';

const PostList = (props) => {
  const [list, setList] = useState(null);
  const db = getFirestore();
  const postsRef = collection(db, 'posts');

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const unsub = onSnapshot(postsRef, (querySnapshot) => {
    const documents = querySnapshot.docs;
    const posts = documents.map((doc) => ({ ...doc.data(), id: doc.id }));
    setList(posts);
  });

  useEffect(() => {
    getPosts();
    unsub();
  }, []);

  return (
    <div>
      {list?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostList;
