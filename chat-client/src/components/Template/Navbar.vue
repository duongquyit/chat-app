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
              @click="isDarkMode = !isDarkMode"
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
              @click="isShowNotification = !isShowNotification"
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

import { isDarkMode } from "../../composables/GlobalVariables";
import {
  listNotifications,
  updateSeenStatus,
} from "../../composables/Notification";
import { logout } from "../../composables/Logout";

import ListNotification from "../Template/ListNotification.vue";

export default {
  name: "TheNavbar",
  props: ["currentUser", "countNotification"],
  components: {
    ListNotification,
  },
  setup() {
    const isShowNotification = ref(false);

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
      handleUpdateSeenStatus,
      handleLogout,
    };
  },
};
</script>

<style>
nav {
  width: 8%;
  padding: 0.5em;
  height: 100%;
  min-width: 5em;
}

.navbar-container {
  width: 100%;
  height: 100%;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-radius: 100px;
}

.navbar {
  width: 100%;
  height: 100%;
}

.navbar ul {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  height: 100%;
  color: #0000006e;
}

.navbar ul li {
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0em;
  position: relative;
}

.nav-bar-item {
  font-size: 1.2em;
  border-radius: 5px;
  position: relative;
  transition: 0.3s font-size ease, 0.2s color ease;
}

.nav-bar-item:hover {
  font-size: 1.6em;
}

.navbar ul li img {
  border-radius: 50%;
  max-width: 3em;
  max-height: 3em;
}

.nav-bar-icon-description {
  font-size: 0.5em;
  font-family: cursive;
  cursor: context-menu;
}

.background-mode {
  background: #fdc830;
  background: linear-gradient(to right, #f39e35, #fdc830);
  border-radius: 20px;
  width: 3.6em;
  height: 2em;
  padding: 0.2em;
  border: 2px solid #ffffff;
}

.background-mode-option {
  width: 50%;
  height: 100%;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(0%);
  transition: transform 0.2s linear;
}

.light-mode-icon {
  color: orange;
}

.dark-mode-icon {
  color: rgb(43, 43, 43);
}

.darkModeToggle {
  background: #000000;
  background: linear-gradient(to bottom, #000000, #444444);
}

.darkModeToggleOption {
  transform: translateX(100%);
}

.amount-notification {
  position: absolute;
  font-size: 0.5em;
  background: #ff1616db;
  width: 1.6em;
  height: 1.6em;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  top: 0;
  right: -5px;
}
</style>