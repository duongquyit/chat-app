import { socket } from '@/plugins/socket';
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '@config/firebase';

const messages = ref(new Map());

const PUBLIC_KEY = 'PUBLIC';
const GROUP_KEY = 'GROUP';
const PRIVATE_KEY = 'PRIVATE';

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
    const publicMessages = querySnapshot.docs.map(item => {
      return {
        ...item.data(),
        messageId: item.id,
        chatType: PUBLIC_KEY,
      }
    });
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
      const groupMessages = querySnapshot.docs.map(item => {
        return {
          ...item.data(),
          messageId: item.id,
          chatType: GROUP_KEY,
        }
      });
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
      const privateMessages = querySnapshot.docs.map(item => {
        return {
          ...item.data(),
          messageId: item.id,
          chatType: PRIVATE_KEY,
          chatPrivateId,
        }
      });
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

// function handle message reaction
const handleMessageReaction = async (docRef, { iconReaction, userReaction }) => {
  const doc = await getDoc(docRef);
  if (!doc.data().reaction?.length) {
    await updateDoc(docRef, {
      reaction: [{
        icon: iconReaction,
        user: userReaction,
      }]
    });
  } else {
    // index of reaction into message
    const index = doc.data().reaction.findIndex(({ user }) => user.uid == userReaction.uid);
    if (index != -1) {
      const { icon } = doc.data().reaction[index];
      const updateData = [...doc.data().reaction];
      // remove icon if icon like current icon reaction
      if (icon == iconReaction) {
        updateData.splice(index, 1);
        await updateDoc(docRef, {
          reaction: updateData,
        });
      } else {
        // change icon
        updateData[index].icon = iconReaction;
        await updateDoc(docRef, {
          reaction: updateData,
        });
      }
    } else {
      // add reaction when user not exist in reaction list
      await updateDoc(docRef, {
        reaction: [
          ...doc.data().reaction,
          {
            icon: iconReaction,
            user: userReaction,
          }
        ]
      });
    }
  }
}

const messageReaction = async ({ chatType, messageId, iconReaction, userReaction, chatPrivateId }) => {
  if (chatType == PUBLIC_KEY || chatType == GROUP_KEY) {
    const messageDocRef = doc(db, 'messages', messageId);
    try {
      await handleMessageReaction(messageDocRef, { iconReaction, userReaction });
    } catch (error) {
      console.log(error);
    }
  } else {
    const messageDocRef = doc(db, 'private-messages', 'rooms', chatPrivateId, messageId);
    try {
      await handleMessageReaction(messageDocRef, { iconReaction, userReaction });
    } catch (error) {
      console.log(error);
    }
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
  messageReaction,
}

