import { socket } from '@/plugins/socket';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../config/firebase';

const messages = ref(new Map());

// PUBLIC CHAT
// collection for public message
const messagesRef = collection(db, 'messages');
const createPublicChatMessage = async (message, sender) => {
  try {
    await addDoc(messagesRef, {
      message: message,
      createdAt: new serverTimestamp(),
      sender: {
        uid: sender.uid,
        displayName: sender.displayName,
        photoURL: sender.photoURL
      },
      isPublicMessage: true,
    });
  } catch (error) {
    console.log(error);
  }
}

const getPublicChatMessage = () => {
  // query get message sort by created at and limit 50 message
  const q = query(messagesRef, where('isPublicMessage', '==', true), orderBy('createdAt', 'desc'), limit(50));
  // handle get realtime message 
  onSnapshot(q, (querySnapshot) => {
    // store message real time
    const publicMessages = querySnapshot.docs.map(item => item.data());
    publicMessages.reverse();
    messages.value.set('public-messages', publicMessages);
  });
}

// GROUP CHAT MESSAGE
const getGroupChatMessage = (groupChatId) => {
  try {
    const q = query(messagesRef,
      where('groupChatId', '==', `${groupChatId}`),
      orderBy('createdAt', 'desc'),
      limit(50));
    onSnapshot(q, (querySnapshot) => {
      const groupMessages = querySnapshot.docs.map(item => item.data());
      groupMessages.reverse();
      messages.value.set(groupChatId, groupMessages);
    });
  } catch (error) {
    console.log(error);
  }
}

const createGroupChatMessage = async (groupChatId, message, sender) => {
  try {
    await addDoc(messagesRef, {
      groupChatId,
      message,
      sender: {
        uid: sender.uid,
        displayName: sender.displayName,
        photoURL: sender.photoURL
      },
      createdAt: new serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
}

// PRIVATE CHAT
// create new collection for private message
const createPrivateChatMessage = async (message, sender, receiver) => {
  // MIDSET
  // room will create with name 'room-userOneId-userTwoId'
  // when sender send first message room is create
  // after receiver receive message and click will just join in room sender created
  const privateMessagesRef = collection(db, 'private-messages', 'rooms', `room-${sender.uid}-${receiver.uid}`);
  try {
    // get current room chat
    const snapshot = await getDocs(privateMessagesRef);
    // if room empty -> rotate position of userId
    if (snapshot.empty) {
      privateMessagesRef._path.segments[2] = `room-${receiver.uid}-${sender.uid}`;
    }
    await addDoc(privateMessagesRef, {
      message: message,
      createdAt: new serverTimestamp(),
      sender: {
        uid: sender.uid,
        displayName: sender.displayName,
        photoURL: sender.photoURL,
      },
      receiver: {
        uid: receiver?.uid,
        displayName: receiver?.displayName,
        photoURL: receiver?.photoURL,
      }
    });
    socket.emit('notificationReceiveMessage', ({ sender, receiver }));
  } catch (error) {
    console.log(error);
  }
}

// get private chat
const getPrivateChatMessage = async (chatPrivateId) => {
  try {
    const privateMessagesRef = collection(db, 'private-messages', 'rooms', `${chatPrivateId}`);
    const q = query(
      privateMessagesRef,
      orderBy("createdAt"),
      limit(50));
    onSnapshot(q, querySnapshot => {
      const privateMessages = querySnapshot.docs.map(item => item.data());
      messages.value.set(privateMessagesRef._path.segments[2], privateMessages);
    })
  } catch (error) {
    console.log(error);
  }
}

const getPrivateChatId = async (userOneId, userTwoId) => {
  try {
    const privateMessagesRef = collection(db, 'private-messages', 'rooms', `room-${userOneId}-${userTwoId}`);
    const snapshot = await getDocs(privateMessagesRef);
    if (snapshot.empty) {
      privateMessagesRef._path.segments[2] = `room-${userTwoId}-${userOneId}`;
    }
    const chatPrivate = privateMessagesRef._path.segments[2]
    return chatPrivate;
  } catch (error) {
    console.log(error);
  }
}

export {
  messages,
  createPublicChatMessage,
  getPublicChatMessage,
  createPrivateChatMessage,
  getPrivateChatMessage,
  getGroupChatMessage,
  createGroupChatMessage,
  getPrivateChatId,
}

