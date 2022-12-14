<template>
  <div class="app" :class="{ darkMode: isDarkMode }">
    <!-- create new group chat form -->
    <GroupChatForm v-if="isShowAddGroupForm" :group="null" :create="true"
      @closeGroupChatForm="isShowAddGroupForm = false" @createGroupChat="handleCreateGroupChat" />
    <!-- update group chat form -->
    <GroupChatForm v-if="isShowEditGroupChatForm" :create="false" :group="groupInformation"
      @closeGroupChatForm="isShowEditGroupChatForm = false" @updateGroupChatName="handleUpdateGroupChatName" />
    <Navbar :currentUser="currentUser" :countNotification="countUnseen" />
    <div class="chat-message-container">
      <!-- List user online -->
      <ListUserOnline :listUsersConnected="listUsersConnected" :currentUser="currentUser" @selectUser="handleSelectUser"
        @selectWorldChat="handleSelectPublicChat" @selectGroupChat="handleSelectGroupChat"
        @selectEdit="handleGetGroupInformation" @selectLeave="handleLeaveGroupChat"
        @addGroupChatForm="handleShowAddGroupChatForm" />
      <!-- Chat -->
      <div class="chat-message" :class="{ borderDarkMode: isDarkMode }">
        <!-- message header -->
        <MessageHeader :chatMessageHeaderAvatar="roomChatInfor.image" :chatMessageHeaderName="roomChatInfor.name" />
        <!-- show messages -->
        <DisplayMessage :messages="messages.get(`${chatMessagesKey}`)" :currentUser="currentUser">
          <!-- chat form -->
          <template v-slot:chatForm="{ chatScrollBar }">
            <SendChatMessageForm :chatScrollBar="chatScrollBar" @changeTextMessage="handleChatMessage"
              @submitSendMessage="handleSubmitMessage">
              <!-- show emotion table -->
              <template v-slot:listEmotion="{ isShowEmotions, textInput }">
                <Emotion :isShowEmotions="isShowEmotions" :textInput="textInput" @addEmotion="handleAddEmotion" />
              </template>
            </SendChatMessageForm>
          </template>
        </DisplayMessage>
      </div>
      <!-- profile -->
      <UserProfile :currentUser="currentUser" @editName="handleUpdateProfile"
        @showUploadImgae="(isShowUploadImage = true), (imageURL = '')" />
      <UploadImage v-if="isShowUploadImage" :imageURL="imageURL" @uploadImage="handleUploadImage"
        @dropImage="handleUploadImage" @save="handleSaveChange" @cancel="isShowUploadImage = false" />
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { socket } from "@plugins/socket";
import { useI18n } from "vue-i18n";


import {
  messages,
  createPublicChatMessage,
  createPrivateChatMessage,
  getPublicChatMessage,
  getPrivateChatMessage,
  createGroupChatMessage,
  getGroupChatMessage,
  getPrivateChatId,
} from "@composables/ChatMessage";
import { isDarkMode } from "@composables/GlobalVariables";
import { updateName, updatePhotoURL } from "@composables/UserProfile";
import { uploadImageToCloud } from "@composables/UploadImage";
import {
  addNotification,
  countUnseen,
  getNoficationCurrentUser,
} from "@composables/Notification";
import { addUserToRoom, removeUserFromRoom } from "@composables/Room";
import {
  createGroupChat,
  getGroupsChatOfCurrentUser,
  updateGroupChat,
  leaveGroupChat,
} from "@composables/GroupChat";

import ListUserOnline from "@components/User/ListUserOnline.vue";
import DisplayMessage from "@components/Chat/DisplayMessage.vue";
import MessageHeader from "@components/Chat/MessageHeader.vue";
import UserProfile from "@components/User/UserProfile.vue";
import UploadImage from "@components/Template/UploadImage.vue";
import Navbar from "@components/Template/Navbar.vue";
import SendChatMessageForm from "@components/Chat/SendChatMessageForm.vue";
import Emotion from "@components/Template/Emotion.vue";
import GroupChatForm from "@components/Group/GroupChatFrom.vue";

export default {
  name: "ChatPage",
  components: {
    ListUserOnline,
    DisplayMessage,
    MessageHeader,
    UserProfile,
    UploadImage,
    Navbar,
    SendChatMessageForm,
    Emotion,
    GroupChatForm,
  },
  setup() {
    const { t } = useI18n();

    // get user on localstorage
    const currentUser = ref(JSON.parse(localStorage.getItem("auth")));

    // chat type
    const isChatPrivate = ref(false);
    const isChatGroup = ref(false);

    // define key for type chat and room chat
    const chatMessagesKey = ref("public-messages");

    // HANDLE SELECT CHAT PRIVATE OR PUBLIC
    // select chat with other user online or chat world
    const roomChatInfor = ref({
      name: `${t('message.chatType.public')}`,
      image: "",
    });

    const userIsSelected = ref({});
    const handleSelectUser = async (user) => {
      roomChatInfor.value.name = user.displayName;
      roomChatInfor.value.image = user.photoURL;
      // get user is select to chat private
      userIsSelected.value = user;
      // get message private between user and other user
      const chatPrivate = await getPrivateChatId(
        currentUser.value.uid,
        user.uid
      );
      chatMessagesKey.value = chatPrivate;
      getPrivateChatMessage(chatPrivate);
      // set status chat
      isChatPrivate.value = true;
      isChatGroup.value = false;
      addUserToRoom(user.socket);
    };

    const handleSelectPublicChat = () => {
      chatMessagesKey.value = "public-messages";
      // change message header
      roomChatInfor.value.name = `${t('message.chatType.public')}`;
      roomChatInfor.value.image = "";
      // get world message
      getPublicChatMessage();
      // set status chat
      isChatPrivate.value = false;
      isChatGroup.value = false;
      // remove user out of room private chat
      removeUserFromRoom();
    };

    // HANDLE GROUP --------------------------------------------------------------------------------
    const isShowAddGroupForm = ref(false);
    const groupChatId = ref("");

    const handleShowAddGroupChatForm = () => {
      isShowAddGroupForm.value = true;
    };

    getGroupsChatOfCurrentUser(currentUser.value);

    const handleCreateGroupChat = (
      listUsers,
      currentUser,
      groupChatName,
      groupChatPhotoURL
    ) => {
      createGroupChat({
        listUsers,
        creator: currentUser,
        groupChatName,
        groupChatPhotoURL,
      });
      isShowAddGroupForm.value = false;
    };

    const handleSelectGroupChat = (group) => {
      chatMessagesKey.value = group.groupChatId;
      //
      roomChatInfor.value.name = group.groupChatName;
      roomChatInfor.value.image = group.groupChatPhotoURL;
      isChatPrivate.value = true;
      isChatGroup.value = true;
      groupChatId.value = group.groupChatId;
      getGroupChatMessage(groupChatId.value);
      // remove user out of room private chat
      removeUserFromRoom();
    };

    const isShowEditGroupChatForm = ref(false);
    const groupInformation = ref({});
    const handleGetGroupInformation = (group) => {
      groupInformation.value = group;
      isShowEditGroupChatForm.value = true;
    };

    const handleUpdateGroupChatName = (newGroupChatName) => {
      updateGroupChat({
        groupChatId: groupInformation.value.groupChatId,
        groupChatName: newGroupChatName,
        groupChatPhotoURL: groupInformation.value.groupChatPhotoURL,
        members: groupInformation.value.members,
      });
    };

    const handleLeaveGroupChat = (groupChatId) => {
      leaveGroupChat(groupChatId, currentUser.value);
      roomChatInfor.value.name = `${t('message.chatType.public')}`;
      roomChatInfor.value.image = "";
    };

    // HANDLE CHAT -------------------------------------------------------------------------------
    const handleChatMessage = (evt, chatScrollBar) => {
      if (evt.key === "Enter" && evt.shiftKey) {
        chatScrollBar.scrollTop = chatScrollBar.scrollHeight;
      } else {
        if (evt.key === "Enter" && evt.target.innerHTML.trim()) {
          // send chat public
          if (!isChatPrivate.value) {
            console.log("chat public");
            createPublicChatMessage(
              evt.target.innerHTML.trim(),
              currentUser.value
            );
          } else {
            // send chat group
            if (isChatGroup.value) {
              console.log("chat group");
              createGroupChatMessage(
                groupChatId.value,
                evt.target.innerHTML.trim(),
                currentUser.value
              );
            } else {
              // send chat private
              console.log("chat private");
              createPrivateChatMessage(
                evt.target.innerHTML.trim(),
                currentUser.value,
                userIsSelected.value
              );
            }
          }
          evt.target.innerHTML = "";
          evt.preventDefault();
        }
      }
    };

    const handleSubmitMessage = (textInput) => {
      if (textInput.innerHTML.trim()) {
        if (!isChatPrivate.value) {
          createPublicChatMessage(
            textInput.innerHTML.trim(),
            currentUser.value
          );
        } else {
          if (isChatGroup.value) {
            createGroupChatMessage(
              groupChatId.value,
              textInput.innerHTML.trim(),
              currentUser.value
            );
          } else {
            createPrivateChatMessage(
              textInput.innerHTML.trim(),
              currentUser.value,
              userIsSelected.value
            );
          }
        }
      }
      textInput.innerHTML = "";
    };

    // add emotion to chat input
    const handleAddEmotion = (emotion, textInput) => {
      textInput.innerHTML += emotion;
    };

    // HANDLE UPDATE PROFILE ---------------------------------------------------------------------
    const handleUpdateProfile = (newName) => {
      updateName(newName);
      currentUser.value.displayName = newName;
    };

    const isShowUploadImage = ref(false);
    const imageURL = ref("");
    const handleUploadImage = async (evt) => {
      imageURL.value = "";
      // evt?.dataTransfer?.files[0] -> get file when user drop file from device
      // evt?.target?.files[0] -> get file when user using choose file
      imageURL.value = await uploadImageToCloud(
        evt?.dataTransfer?.files[0] || evt?.target?.files[0]
      );
    };

    const handleSaveChange = async () => {
      if (imageURL.value) {
        await updatePhotoURL(imageURL.value);
        isShowUploadImage.value = false;
        currentUser.value.photoURL = imageURL.value;
      }
    };

    // SOCKET HANDLE -------------------------------------------------------------------------------
    const listUsersConnected = ref([]);
    onMounted(() => {
      // default show world chat
      getPublicChatMessage();
      getNoficationCurrentUser();

      // reconnect socket if user not yet log out
      if (!socket.connected && localStorage.getItem("auth")) {
        socket.connect();
        socket.auth = JSON.parse(localStorage.getItem("auth"));
      }
      // send event get all connected
      socket.emit("getListUserConnect");
      // receive list user connected
      socket.on("listUsersConnected", (listUsers) => {
        listUsersConnected.value = [...listUsers];
      });
      // listen and receive information when new user connected
      socket.on("newUserConnect", (user) => {
        const userExistIndex = listUsersConnected.value.findIndex(
          ({ uid }) => uid == user.uid
        );
        // if user reconnect will receive message from sender
        if (userIsSelected.value.uid == user.uid) {
          userIsSelected.value.socket = user.socket;
        }
        if (userExistIndex == -1) {
          listUsersConnected.value.push(user);
        } else {
          listUsersConnected.value.splice(userExistIndex, 1, user);
        }
      });
      // listen event when other user update information
      socket.on("newUserUpdateInformation", (user) => {
        const index = listUsersConnected.value.findIndex(
          (item) => item.socket === user.socket
        );
        listUsersConnected.value.splice(index, 1, user);
      });
      // listen and receive notification when someone send message to curren user
      socket.on("notificationNewMessage", async (data) => {
        await addNotification(data);
      });
      // listen and receive notification when someone disconnected
      socket.on("userDisconnect", (listUsers) => {
        listUsersConnected.value = [...listUsers];
      });
    });

    return {
      messages,
      chatMessagesKey,
      isChatPrivate,
      currentUser,
      listUsersConnected,
      roomChatInfor,
      isShowUploadImage,
      imageURL,
      isDarkMode,
      isShowAddGroupForm,
      countUnseen,
      isShowEditGroupChatForm,
      groupInformation,
      groupChatId,
      handleChatMessage,
      handleSelectUser,
      handleSelectPublicChat,
      handleUpdateProfile,
      handleUploadImage,
      handleSaveChange,
      handleSubmitMessage,
      handleAddEmotion,
      handleCreateGroupChat,
      handleSelectGroupChat,
      handleGetGroupInformation,
      handleUpdateGroupChatName,
      handleLeaveGroupChat,
      handleShowAddGroupChatForm,
    };
  },
};
</script>

<style>
.chat-message-container {
  width: 92%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.chat-message {
  width: 50%;
  min-width: 400px;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
</style>
