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
import { useEffect, useState, useRef } from 'react';
import useMessaging from '../favs/UseMessaging';
import formatDate from '../UI/layout/helpers';
import { getStorage, ref, deleteObject } from 'firebase/storage';

export const Post = (props) => {
  const { post, onDelete, currentUser } = props;
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState(null);
  const likesRef = collection(db, 'likes');
  const likesDoc = query(likesRef, where('postId', '==', post.id));
  const timestamp = new Date(post.date.seconds * 1000);
  const { startConversation } = useMessaging();
  const postRef = useRef(null);

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

  const getMediaType = (url) => {
    const imagePattern =
      /\.(jpeg|jpg|gif|png|heic|bmp|webp|tiff|avif)(\?.*)?$/i;
    const videoPattern = /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/i;

    if (imagePattern.test(url)) {
      return 'image';
    } else if (videoPattern.test(url)) {
      return 'video';
    }
    return 'unknown';
  };

  const renderMediaElement = () => {
    const mediaType = getMediaType(post.fileurl);
    console.log(mediaType);
    if (post.fileurl && mediaType === 'image') {
      return (
        <img
          src={post.fileurl}
          onClick={() => window.open(post.fileurl, '_blank')}
        />
      );
    } else if (post.fileurl && mediaType === 'video') {
      return (
        <video
          src={post.fileurl}
          controls
          type='video/mp4'
          onClick={() => window.open(post.fileurl, '_blank')}
        />
      );
    }
  };

  const handleDelete = async () => {
    const storage = getStorage();
    const fileRef = ref(storage, post.fileurl);

    await deleteObject(fileRef);

    await deleteDoc(doc(db, 'posts', post.id));

    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div ref={postRef} className={classes.postcontainer}>
      <div className={classes.itemHeader}>
        <div className={classes.userContainer}>
          <img src={post.userPhoto} alt='User profile' />
          <h4
            onClick={() =>
              startConversation(post.userId, post.username, post.userPhoto)
            }
          >
            @{post.username}
          </h4>
        </div>
        <p className={classes.timestamp}>{formatDate(timestamp)}</p>
      </div>
      <h3 className={classes.text}>{post.text}</h3>
      <div className={classes.media}>{renderMediaElement()}</div>
      <div className={classes.itemFooter}>
        {user && (
          <button
            className={classes.likeButton}
            onClick={hasUserLiked ? removeLike : addLike}
          >
            {hasUserLiked ? (
              <span className={classes.liked}>&#128078;</span>
            ) : (
              <span className={classes.unliked}>&#128077;</span>
            )}
            <span className={classes.likeCount}>{likes?.length || 0}</span>
          </button>
        )}
        {currentUser && currentUser.uid === post.userId && (
          <button className={classes.deletebutton} onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
