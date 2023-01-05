import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import classes from './Post.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';
import { useEffect, useState } from 'react';

export const Post = (props) => {
  const { post } = props;
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState(null);

  let element;

  if (post.fileurl) {
    if (post.fileurl.match(/\.(jpeg|jpg|gif|png)$|\.(jpeg|jpg|gif|png)/)) {
      element = (
        <img
          src={post.fileurl}
          onClick={() => window.location.assign(post.fileurl)}
        />
      );
    } else {
      element = (
        <video
          src={post.fileurl}
          controls
          type='video/mp4'
          onClick={() => window.location.assign(post.fileurl)}
        />
      );
    }
  }

  const likesRef = collection(db, 'likes');
  const likesDoc = query(likesRef, where('postId', '==', post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) => [...prev, { userId: user?.uid, likeId: newDoc.id }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where('postId', '==', post.id),
        where('userId', '==', user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, 'likes', likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes((prev) => prev?.filter((like) => like.likeId !== likeId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div className={classes.postcontainer}>
      <div className={classes.items}>
        <p>{post.text}</p>
        <div>{element}</div>
        <p>@{post.username}</p>
        {user && (
          <button onClick={hasUserLiked ? removeLike : addLike}>
            {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
          </button>
        )}
        {likes && <p>Likes: {likes?.length}</p>}
      </div>
    </div>
  );
};
