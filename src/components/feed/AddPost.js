import classes from './AddPost.module.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useCallback } from 'react';

const AddPost = (props) => {
  const [loggedIn, setLoggedin] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadTask, setUploadTask] = useState(null);
  const [progress, setProgress] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const postsRef = collection(db, 'posts');
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedin(true);
      } else {
        setLoggedin(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const schema = yup.object().shape({
    text: yup.string().required('Input needed'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const storage = getStorage();
    const gsReference = ref(storage, `media/` + file.name);
    const uploadTask = uploadBytesResumable(gsReference, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressPercentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercentage);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      () => {
        getDownloadURL(gsReference).then((url) => {
          setFileUrl(url);
        });
      }
    );
    setUploadTask(uploadTask);
  }, []);

  const onCancelUpload = useCallback(() => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
      setFileUrl(null);
      setProgress(0);
      fileInputRef.current.value = null;
    }
  }, [uploadTask]);

  const onAddPost = async (data) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      fileurl: fileUrl,
      date: Timestamp.fromDate(new Date()),
      userPhoto: user?.photoURL,
    });
    fileInputRef.current.value = null;
    setProgress(0);
    setFileUrl(null);
    setUploadTask(null);
    reset();
  };

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit(onAddPost)}
      ref={formRef}
    >
      {loggedIn ? (
        <>
          <div className={classes.control}>
            <label htmlFor='text'></label>
            <textarea
              placeholder='Start sharing!'
              id='text'
              rows='5'
              {...register('text')}
            ></textarea>
            <p style={{ color: 'red' }}>{errors.text?.message}</p>
          </div>
          {uploadTask && (
            <div>
              <div
                className={classes.progress}
                style={{ width: `${progress}%` }}
              />
              <button onClick={onCancelUpload}>Cancel</button>
            </div>
          )}
          <label htmlFor='inputTag'>
            Select File
            <input
              type='file'
              id='inputTag'
              name='file'
              onChange={onFileChange}
              ref={fileInputRef}
              className={classes.customInput}
            />
          </label>
          <button className={classes.customButton}>Post</button>
        </>
      ) : (
        <p>Please sign in or continue as Guest to begin.</p>
      )}
    </form>
  );
};

export default AddPost;
