<template>
  <div
    class="user-profile-container"
    :class="{ borderDarkModeRight: isDarkMode }"
  >
    <div class="user-profile-avatar">
      <div class="profile-avatar">
        <img :src="currentUser?.photoURL" alt="" />
        <span @click="$emit('showUploadImgae')" class="update-avatar"
          ><i class="fa-solid fa-pencil"></i
        ></span>
      </div>
    </div>
    <div class="user-profile-information">
      <span v-if="!isEditName">
        {{ currentUser?.displayName }}&ensp;
        <span @click="isEditName = true"
          ><i class="fa-solid fa-pen-to-square"></i
        ></span>
      </span>
      <!-- form change name -->
      <form
        v-else
        class="edit-name-form"
        @submit.prevent="$emit('editName', newName), (isEditName = false)"
      >
        <input type="text" v-model="newName" />
        <span @click="isEditName = false"
          ><i class="fa-solid fa-xmark"></i
        ></span>
      </form>
      <span>{{ currentUser?.email }}</span>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { isDarkMode } from "../../composables/GlobalVariables";
export default {
  name: "UserProfile",
  props: ["currentUser"],
  setup(props) {
    const newName = ref(props.currentUser.displayName);
    const isEditName = ref(false);

    return { newName, isEditName, isDarkMode };
  },
};
</script>

<style>
.user-profile-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  height: 100vh;
  border-right: 1px solid var(--border-color);
  width: 25%;
  min-width: 200px;
  border-radius: 10px;
  padding: 0.5em;
}
.user-profile-avatar {
  width: 100%;
  position: relative;
}

.profile-avatar {
  width: 6em;
  height: 6em;
  margin: 2em auto;
  position: relative;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 100px;
}

.user-profile-information {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 1em 0;
  position: relative;
}

.user-profile-information span {
  width: 100%;
  font-family: system-ui;
  letter-spacing: 1px;
  padding: 0.2em 0.5em;
}

.edit-name-form {
  width: 100%;
}

.edit-name-form input {
  padding: 0.3em;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1em;
  font-family: system-ui;
  color: #383838;
  outline: none;
}

#update-avatar {
  display: none;
}

.update-avatar {
  position: absolute;
  width: 1em;
  height: 1em;
  padding: 1em;
  background: #fff;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  right: -0.5em;
  bottom: -0.5em;
  color: #504e4e;
}

.update-avatar:hover {
  background: rgb(241, 241, 241);
}
</style> 