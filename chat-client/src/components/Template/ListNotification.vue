<template>
  <div class="list-notification" :class="{ darkMode: isDarkMode }">
    <h3 class="notification-title">Notification</h3>
    <div class="notification-message-no-item" v-if="!notification.length">
      <p>You don't have any notification!</p>
    </div>
    <div
      v-else
      class="notification-item"
      :class="{ isUnseen: !notificationItem.isSeen }"
      v-for="notificationItem in notification"
      :key="notificationItem"
      @click="$emit('updateSeenStatus', notificationItem.docId)"
    >
      <img :src="notificationItem.sender.photoURL" alt="" />
      <div class="notification-message-container">
        <span>
          You have new message from {{ notificationItem.sender.displayName }}
        </span>
        <span class="notification-time-momment">
          {{ timeSince(notificationItem.createdAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { timeSince } from "../../composables/TimeFormart";
export default {
  name: "ListNotification",
  props: ["isDarkMode", "notification"],
  setup() {
    return { timeSince };
  },
};
</script>

<style>
.list-notification {
  position: absolute;
  width: 300px;
  max-height: 280px;
  overflow: auto;
  background: #fff;
  z-index: 1;
  left: 7em;
  top: 0;
  font-size: 0.9em;
  text-align: left;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 1em;
}

.notification-title {
  font-family: system-ui;
  font-weight: 500;
}

.notification-message-no-item p {
  padding: 1em 0em;
  font-family: cursive;
  font-style: italic;
}

.notification-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5em;
  border-radius: 5px;
}

.notification-item:hover {
  background: #f3f3f3a6;
  color: black;
}

.notification-item img {
  width: 2em;
  height: 2em;
}

.notification-message-container {
  padding-left: 1em;
  font-family: system-ui;
}

.notification-time-momment {
  width: 100%;
  display: block;
  font-size: 0.8em;
  font-style: italic;
}

.isUnseen {
  background: #cdcccc38;
}
</style>