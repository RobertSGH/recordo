import Card from '../UI/layout/Card';
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
import { useEffect } from 'react';

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
  const newUploadTaskRef = useRef(null);

  useEffect(() => {
    const authStateChanged = (user) => {
      if (user) {
        setLoggedin(true);
      } else {
        setLoggedin(false);
      }
    };
    onAuthStateChanged(auth, authStateChanged);
    return () => {
      onAuthStateChanged(auth, authStateChanged);
    };
  }, []);

  const schema = yup.object().shape({
    text: yup.string().required('Input needed'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const storage = getStorage();
    const gsReference = ref(
      storage,
      `gs://recordosapp.appspot.com/media/` + file.name
    );
    try {
      newUploadTaskRef.current = uploadBytesResumable(gsReference, file);
      newUploadTaskRef.current.on('state_changed', (snapshot) => {
        const progressPercentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercentage);
      });

      setFileUrl(await getDownloadURL(gsReference));
      setUploadTask(newUploadTaskRef.current);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onCancelUpload = () => {
    if (newUploadTaskRef.current) {
      newUploadTaskRef.current.cancel();
      setUploadTask(null);
      fileInputRef.current.value = null;
    }
  };

  const onAddPost = async (data) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
      fileurl: fileUrl,
      date: Timestamp.fromDate(new Date()),
    });
    formRef.current.reset();
    fileInputRef.current.value = null;
    setProgress(0);
    setFileUrl(null);
    setUploadTask(null);
  };

  let postcontent = (
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
  );

  return (
    <Card>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onAddPost)}
        ref={formRef}
      >
        <div className={classes.control}>
          <label htmlFor='text'></label>
          <textarea
            placeholder='Start sharing!'
            id='text'
            rows='5'
            {...register('text')}
          ></textarea>
          {loggedIn && (
            <p style={{ color: 'red' }}>
              {' '}
              {errors.text?.message || errors.selectedCategories?.message}
            </p>
          )}
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
        {loggedIn ? postcontent : <p>Please log in to begin.</p>}
        {loggedIn && <button className={classes.customButton}>Post</button>}
      </form>
    </Card>
  );
};

export default AddPost;
