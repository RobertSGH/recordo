import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Post } from './Post';

const PostList = (props) => {
  const [list, setList] = useState(null);
  const [displayList, setDisplayList] = useState([]);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const db = getFirestore();
  const postsRef = collection(db, 'posts');

  useEffect(() => {
    const unsub = onSnapshot(postsRef, (querySnapshot) => {
      const documents = querySnapshot.docs;
      const posts = documents.map((doc) => ({ ...doc.data(), id: doc.id }));
      setList(posts.sort((a, b) => b.date.seconds - a.date.seconds));
      setDisplayList(posts.slice(0, limit));
      setHasMore(posts.length > limit);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (list) {
      setDisplayList(list.slice(0, limit));
      setHasMore(list.length > limit);
    }
  }, [limit, list]);

  const loadMore = () => {
    setLoading(true);
    setLimit(limit + 5);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div>
      {displayList.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default PostList;
