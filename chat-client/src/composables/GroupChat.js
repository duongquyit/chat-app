import { db } from "@/config/firebase";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { ref } from "vue";

const groupChatRef = collection(db, 'group-chat');
const createGroupChat = async ({ listUsers, creator, groupChatName, groupChatPhotoURL }) => {
  const listMembersUID = listUsers.map(user => user.uid);
  if (listUsers.length > 1 && groupChatName.trim() && groupChatPhotoURL.trim()) {
    try {
      await addDoc(groupChatRef, {
        members: [creator, ...listUsers],
        creator: creator,
        groupChatName: groupChatName,
        groupChatPhotoURL: groupChatPhotoURL || 'https://png.pngtree.com/png-vector/20191130/ourlarge/pngtree-group-chat-icon-png-image_2054401.jpg',
        membersId: [creator.uid, ...listMembersUID],
        createdAt: new serverTimestamp(),
      })
    } catch (error) {
      console.log(error);
    }
  }
}

const listGroupsChatOfCurrentUser = ref([]);
const getGroupsChatOfCurrentUser = (currentUser) => {
  try {
    const q = query(groupChatRef, where('membersId', 'array-contains', `${currentUser.uid}`), orderBy('createdAt'));
    onSnapshot(q, (querySnapshot) => {
      listGroupsChatOfCurrentUser.value = querySnapshot.docs.map(doc => {
        return {
          groupChatId: doc.id,
          ...doc.data(),
        }
      })
    });

  } catch (error) {
    console.log(error);
  }
}

const updateGroupChat = async (group) => {
  try {
    const groupRef = doc(db, 'group-chat', group.groupChatId);
    await updateDoc(groupRef, {
      groupChatName: group.groupChatName,
      groupChatPhotoURL: group.groupChatPhotoURL,
      members: group.members,
      membersId: group.members.map(m => m.uid),
    })
  } catch (error) {
    console.log(error);
  }
}

export { listGroupsChatOfCurrentUser, createGroupChat, getGroupsChatOfCurrentUser, updateGroupChat }