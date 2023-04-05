import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../App';
import { useNavigate } from 'react-router-dom';

const useMessaging = () => {
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const startConversation = async (
    recipientId,
    displayName,
    recipientPhoto
  ) => {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q1 = query(
        conversationsRef,
        where('participants', '==', [user.uid, recipientId])
      );
      const q2 = query(
        conversationsRef,
        where('participants', '==', [recipientId, user.uid])
      );
      const querySnapshot1 = await getDocs(q1);
      const querySnapshot2 = await getDocs(q2);

      let conversation;

      if (!querySnapshot1.empty) {
        conversation = querySnapshot1.docs[0];
      } else if (!querySnapshot2.empty) {
        conversation = querySnapshot2.docs[0];
      }

      if (conversation) {
        navigate(
          `/conversations/${conversation.id}?displayName=${displayName}`
        );
      } else {
        const newConversationRef = await addDoc(conversationsRef, {
          participants: [user.uid, recipientId],
          recipientName: displayName,
          senderName: user.displayName,
          senderPhoto: user?.photoURL,
          recipientPhoto: recipientPhoto,
          timestamp: serverTimestamp(),
        });
        navigate(
          `/conversations/${newConversationRef.id}?displayName=${displayName}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { startConversation };
};

export default useMessaging;
