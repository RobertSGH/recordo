import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import classes from './Post.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';
import { useEffect, useState } from 'react';
import useMessaging from '../favs/UseMessaging';

export const Post = (props) => {
  const { post } = props;
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState(null);
  const likesRef = collection(db, 'likes');
  const likesDoc = query(likesRef, where('postId', '==', post.id));
  const timestamp = new Date(post.date.seconds * 1000);
  const { startConversation } = useMessaging();

  useEffect(() => {
    const unsub = onSnapshot(likesDoc, (querySnapshot) => {
      const documents = querySnapshot.docs;
      setLikes(
        documents.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
      );
    });

    return unsub;
  }, []);

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) => [
          ...prev.filter((like) => like.userId !== user.uid),
          { userId: user?.uid, likeId: newDoc.id },
        ]);
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

  let element;

  if (post.fileurl) {
    if (post.fileurl.match(/\.(jpeg|jpg|gif|png)$|\.(jpeg|jpg|gif|png)/)) {
      element = (
        <img
          src={post.fileurl}
          onClick={() => window.open(post.fileurl, '_blank')}
        />
      );
    } else {
      element = (
        <video
          src={post.fileurl}
          controls
          type='video/mp4'
          onClick={() => window.open(post.fileurl, '_blank')}
        />
      );
    }
  }

  return (
    <div className={classes.postcontainer}>
      <div className={classes.items}>
        <h3>{post.text}</h3>
        <div>{element}</div>
        {user && (
          <button onClick={hasUserLiked ? removeLike : addLike}>
            {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
          </button>
        )}
        {likes && <p>Likes: {likes?.length}</p>}
        <h4 onClick={() => startConversation(user?.uid, post.username, '')}>
          @{post.username}
        </h4>
        <p>{timestamp.toLocaleString()}</p>
      </div>
    </div>
  );
};
