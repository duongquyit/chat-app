<template>
  <nav>
    <div
      class="navbar-container"
      :class="{
        borderDarkModeLeft: isDarkMode,
        borderDarkModeRight: isDarkMode,
      }"
    >
      <div class="navbar">
        <ul :class="{ darkMode: isDarkMode }">
          <li><img :src="currentUser?.photoURL" alt="" /></li>
          <li>
            <div
              class="background-mode"
              :class="{ darkModeToggle: isDarkMode }"
              @click="handleClickThemeMode"
            >
              <div
                class="background-mode-option"
                :class="{ darkModeToggleOption: isDarkMode }"
              >
                <span v-if="isDarkMode" class="dark-mode-icon">
                  <i class="fa-solid fa-moon"></i>
                </span>
                <span v-else class="light-mode-icon">
                  <i class="fa-solid fa-sun"></i>
                </span>
              </div>
            </div>
          </li>
          <li>
            <span
              class="nav-bar-item notification-icon"
              @click="handleClickNotificationItem"
            >
              <i class="fa-solid fa-bell"></i>
              <p class="nav-bar-icon-description">Notification</p>
              <div v-if="countNotification" class="amount-notification">
                {{ countNotification }}
              </div>
            </span>
            <ListNotification
              v-if="isShowNotification"
              :isDarkMode="isDarkMode"
              :notification="listNotifications"
              @updateSeenStatus="handleUpdateSeenStatus"
            />
          </li>
          <li>
            <span class="nav-bar-item">
              <i class="fa-solid fa-message"></i>
              <p class="nav-bar-icon-description">Message</p>
            </span>
          </li>
          <li>
            <span class="nav-bar-item">
              <i class="fa-solid fa-user"></i>
              <p class="nav-bar-icon-description">User</p>
            </span>
          </li>
          <li>
            <span class="nav-bar-item" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <p class="nav-bar-icon-description">Logout</p>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "@vue/reactivity";
  import { watch } from "@vue/runtime-core";

import { isDarkMode } from "@composables/GlobalVariables";
import {
  listNotifications,
  updateSeenStatus,
} from "@composables/Notification";
import { logout } from "@composables/Logout";

import ListNotification from "@components/Template/ListNotification.vue";

export default {
  name: "TheNavbar",
  props: ["currentUser", "countNotification"],
  components: {
    ListNotification,
  },
  setup() {
    const isShowNotification = ref(false);

    const handleClickThemeMode = () => {
      isDarkMode.value = !isDarkMode.value;
    }

    const handleClickNotificationItem = () => {
      isShowNotification.value = !isShowNotification.value;
    }

    const handleUpdateSeenStatus = (docId) => {
      updateSeenStatus(docId);
    };

    const handleLogout = () => {
      logout();
    };

    watch(isShowNotification, () => {
      const clickOutsideNotification = (event) => {
        const listNotifications = document.querySelector(".list-notification");
        const notifiIcon = document.querySelector(".notification-icon");
        if (
          !listNotifications?.contains(event.target) &&
          !notifiIcon?.contains(event.target)
        ) {
          isShowNotification.value = false;
          document.removeEventListener("click", clickOutsideNotification);
        }
      };
      if (isShowNotification.value) {
        document.addEventListener("click", clickOutsideNotification);
      }
    });

    return {
      isDarkMode,
      listNotifications,
      isShowNotification,
      handleClickThemeMode,
      handleClickNotificationItem,
      handleUpdateSeenStatus,
      handleLogout,
    };
  },
};
</script>

<style>
@import '@assets/style/navbar.css'; 
</style>