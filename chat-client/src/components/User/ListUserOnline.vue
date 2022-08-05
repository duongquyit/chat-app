<template>
  <div
    class="chat-message-list-user-connected"
    :class="{ borderDarkModeLeft: isDarkMode }"
  >
    <div
      class="public-chat"
      :class="{ isSelected: !userIdSelected && !groupIdSelected }"
      @click="
        $emit('selectWorldChat'), (userIdSelected = ''), (groupIdSelected = '')
      "
    >
      <span>World Chat</span>
    </div>
    <!-- GROUP CHAT -->
    <div class="group-chat-message">
      <div class="group-chat-message-header">
        <div
          class="group-chat-message-header-title"
          @click="isShowGroupsChat = !isShowGroupsChat"
        >
          <p>Group chat</p>
          <span
            style="transition: transform 0.5s"
            :class="{ rotateArrow: isShowGroupsChat }"
            ><i class="fa-solid fa-angle-right"></i
          ></span>
        </div>
        <span @click="$emit('addGroupChatForm')">
          <i class="fa-regular fa-square-plus"></i
        ></span>
      </div>
      <div
        class="group-chat-message-body"
        :class="{ showListGroup: isShowGroupsChat }"
      >
        <div
          class="message-group-chat-empty"
          v-if="!listGroupsChatOfCurrentUser.length"
        >
          <p>You don't have any group chat!</p>
        </div>
        <div
          class="group-chat-message-body-item"
          v-else
          :class="{ isSelected: groupIdSelected == group.groupChatId }"
          v-for="group in listGroupsChatOfCurrentUser"
          :key="group"
          @click="
            $emit('selectGroupChat', group),
              (groupIdSelected = group.groupChatId)
          "
        >
          <img :src="group?.groupChatPhotoURL" alt="" />
          <div class="group-chat-message-body-item-content">
            <p class="group-chat-message-body-item-name">
              {{ group?.groupChatName }}
            </p>
            <span
              style="padding: 0 0.5em"
              @click="isShowGroupChatSelection = !isShowGroupChatSelection"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </span>
            <div
              class="group-chat-selection"
              v-show="
                isShowGroupChatSelection && group.groupChatId == groupIdSelected
              "
            >
              <span
                @click="
                  $emit('selectEdit', group), (isShowGroupChatSelection = false)
                "
                >Edit</span
              >
              <span @click="$emit('selectLeave', group)">Leave</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- LIST USER -->
    <span
      class="list-user-connected-title"
      :class="{ borderDarkModeBottom: isDarkMode }"
    >
      User Online
    </span>
    <div class="list-user">
      <div
        class="user-connected-information"
        :class="{ isSelected: userIdSelected == user?.uid && !groupIdSelected }"
        v-for="user in listUsersConnected"
        :key="user.socket"
        draggable="true"
        @click="
          $emit('selectUser', user),
            (userIdSelected = user?.uid),
            (groupIdSelected = '')
        "
        @dragstart="handleDragStart($event, user)"
      >
        <img :src="user.photoURL" alt="" />
        <span>
          {{
            currentUser.uid == user.uid
              ? `${user.displayName} (You)`
              : `${user.displayName}`
          }}
        </span>
        <div v-if="user.isOnline" class="user-status-online"></div>
        <div v-else class="user-status-offline"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";

import { isDarkMode } from "../../composables/GlobalVariables";
import { listGroupsChatOfCurrentUser } from "../../composables/GroupChat";

export default {
  name: "ListUserOnline",
  props: ["listUsersConnected", "currentUser"],
  components: {},
  setup() {
    const userIdSelected = ref("");
    const groupIdSelected = ref("");
    const isShowGroupsChat = ref(false);

    const isShowGroupChatSelection = ref(false);

    const handleDragStart = (event, user) => {
      event.dataTransfer.setData("user", JSON.stringify(user));
    };

    return {
      userIdSelected,
      isDarkMode,
      isShowGroupsChat,
      listGroupsChatOfCurrentUser,
      groupIdSelected,
      isShowGroupChatSelection,
      handleDragStart,
    };
  },
};
</script>

<style>
.chat-message-list-user-connected {
  width: 25%;
  min-width: 300px;
  border-left: 1px solid var(--border-color);
  padding: 1em 0.5em;
  text-align: left;
  border-radius: 10px;
}

.public-chat {
  height: 10%;
  text-align: left;
  padding: 1em 0.5em;
  font-family: system-ui;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 5px;
}

.list-user-connected-title {
  height: 7%;
  font-size: 1.1em;
  font-family: system-ui;
  padding: 0.5em;
  display: block;
  border-bottom: 1px solid var(--border-color);
}

.list-user {
  height: 83%;
  overflow-y: auto;
  padding-right: 0.5em;
}

.user-connected-information {
  display: flex;
  align-items: center;
  padding: 0.7em 0.5em;
  position: relative;
  cursor: pointer;
  border-radius: 5px;
  margin: 0.5em 0em;
  box-shadow: rgb(139 107 107 / 15%) 0px 2px 8px 0px;
}

.user-connected-information img {
  width: 2em;
  height: 2em;
  border-radius: 100px;
}

.user-connected-information span {
  padding: 0em 1em;
  text-align: left;
  font-family: system-ui;
}

.user-status-online,
.user-status-offline {
  width: 0.5em;
  height: 0.5em;
  border-radius: 100px;
  min-width: 0.5em;
  min-height: 0.5em;
}

.user-status-online {
  background: #1bd91b;
}

.user-status-offline {
  background: #80808024;
  border: 1px solid gray;
}

.isSelected {
  background: #85858517;
}

.group-chat-message {
  padding: 0.2em;
}

.group-chat-message-header {
  display: flex;
  justify-content: space-between;
  padding: 0.5em 0em;
  font-size: 1.1em;
}

.group-chat-message-header-title {
  display: inline-flex;
  width: 45%;
  justify-content: space-around;
  cursor: pointer;
}

.group-chat-message-body {
  font-family: inherit;
  height: 0;
  overflow: auto;
  position: relative;
  padding: 0 0.5em;
  transition: height 0.5s;
}

.group-chat-message-body-item {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 0.5em 0.5em;
  margin: 0.5em 0em;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
}

.group-chat-message-body-item img {
  width: 2em;
  height: 2em;
  object-fit: cover;
  border-radius: 100px;
}

.group-chat-message-body-item-content {
  display: flex;
  justify-content: space-between;
  width: 82%;
}

.group-chat-message-body-item-name {
}

.showListGroup {
  height: 176px;
}

.rotateArrow {
  transform: rotate(90deg);
}

.message-group-chat-empty {
  text-align: center;
  font-size: 0.9em;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: cursive;
}

.group-chat-selection {
  position: absolute;
  right: 0px;
  top: 3em;
  background: white;
  padding: 0.2em 0em;
  border-radius: 3px;
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  font-size: 0.8em;
  z-index: 2;
}

.group-chat-selection span {
  width: 100%;
  display: block;
  padding: 0.3em 0.5em;
  font-family: system-ui;
}

.group-chat-selection span:hover {
  background-color: rgba(0, 0, 0, 0.13);
}
</style>