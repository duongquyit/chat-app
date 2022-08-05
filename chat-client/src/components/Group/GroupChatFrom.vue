<template>
  <form
    class="create-new-group-chat-form"
    @submit.prevent="
      $emit(
        'createGroupChat',
        listUsersDrop,
        currentUser,
        groupChatName,
        groupChatPhotoURL
      )
    "
  >
    <span
      style="text-align: right; color: #ff2f00; font-size: 1.2em"
      @click="$emit('closeGroupChatForm')"
    >
      <i class="fa-solid fa-circle-xmark"></i>
    </span>
    <div class="create-new-group-chat-form-infor">
      <!-- GROUP CHAT NAME -->
      <p>Group chat name</p>
      <!-- show input group chat name when form is create -->
      <input v-if="create" type="text" v-model="groupChatName" />
      <!-- update template -->
      <span v-if="!create" class="group-chat-name">
        <p v-if="!isEditGroupChatName">{{ groupChatName }}</p>
        <input
          v-else
          type="text"
          @keydown.enter="
            $emit('updateGroupChatName', groupChatName),
              (isEditGroupChatName =
                groupChatName != group.groupChatName && groupChatName
                  ? false
                  : true)
          "
          v-model="groupChatName"
        />
        <span
          class="edit-group-chat-name-icon"
          @click="
            (isEditGroupChatName = !isEditGroupChatName),
              (groupChatName = !groupChatName
                ? group.groupChatName
                : groupChatName)
          "
        >
          <span v-if="!isEditGroupChatName">
            <i class="fa-solid fa-pen"></i>
          </span>
          <span v-else>
            <i class="fa-solid fa-xmark"></i>
          </span>
        </span>
      </span>
      <!-- IMAGE GROUP CHAT -->
      <p>Group chat image</p>
      <input
        style="display: none"
        type="file"
        id="groupChatImageFile"
        @change="handleUploadImageGroup"
      />
      <label
        class="new-group-chat-form-upload-image"
        for="groupChatImageFile"
        @dragstart.prevent=""
        @dragover.prevent=""
        @drop.prevent="handleUploadImageGroup"
      >
        <span
          v-if="!groupChatPhotoURL"
          style="font-size: 2em; color: #80808082"
        >
          <i class="fa-solid fa-plus"></i>
        </span>
        <img v-else :src="groupChatPhotoURL" alt="" />
      </label>
    </div>
    <!-- GROUP CHAT LIST USER -->
    <p style="text-align: left; font-size: 1.1em">List user invite group</p>
    <div
      class="create-new-group-chat-form-member"
      @dragover.prevent=""
      @drop="handleDropUser"
      ref="listUsersDropScroll"
    >
      <p v-if="!listUsersDrop.length" class="message-list-drop-user-empty">
        Drag user from list user online and drop here
      </p>
      <div
        class="create-new-group-chat-form-member-item"
        v-else
        v-for="user in listUsersDrop"
        :key="user.uid"
      >
        <img :src="user.photoURL" alt="" />
        <p>{{ user.displayName }}</p>
        <span
          class="remove-user-out-list-member-icon"
          @click="handleRemoveUserOutListUserDrop(user)"
          >&times;</span
        >
      </div>
    </div>
    <button
      class="new-group-chat-submit-btn"
      :class="{ notAllowSubmitButton: !groupChatName || !listUsersDrop.length }"
      v-show="create"
      type="submit"
      :disabled="!groupChatName || !listUsersDrop.length"
    >
      Create
    </button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { nextTick, watch } from "@vue/runtime-core";

import { uploadImageToCloud, isPending } from "../../composables/UploadImage";
import { updateGroupChat } from "../../composables/GroupChat";

import { toast } from "../../composables/ToastMessage";

export default {
  name: "GroupChatForm",
  props: ["create", "group"],
  setup(props) {
    const currentUser = JSON.parse(localStorage.getItem("auth"));
    const listUsersDropScroll = ref(null);
    const groupChatName = ref(props?.group?.groupChatName || "");
    const listUsersDrop = ref(props?.group?.members || []);
    const groupChatPhotoURL = ref(props?.group?.groupChatPhotoURL || "");

    const isEditGroupChatName = ref(false);

    // handle upload group chat photo
    const handleUploadImageGroup = async (evt) => {
      const imgFile = evt?.dataTransfer?.files[0] || evt?.target?.files[0];
      if (imgFile) {
        groupChatPhotoURL.value = await uploadImageToCloud(imgFile);

        // handle when update form
        if (!props.create) {
          updateGroupChat({
            groupChatId: props.group.groupChatId,
            groupChatName: groupChatName.value,
            groupChatPhotoURL: await uploadImageToCloud(imgFile),
            members: listUsersDrop.value,
          });
        }
      }
    };

    // drag and drop user
    const handleDropUser = (e) => {
      const userDrop = JSON.parse(e.dataTransfer.getData("user"));
      const userDropExist = listUsersDrop.value.find(
        ({ uid }) => uid == userDrop.uid
      );
      if (!userDropExist && userDrop.uid != currentUser.uid) {
        listUsersDrop.value.push(userDrop);

        // handle when update form
        if (!props.create) {
          updateGroupChat({
            groupChatId: props.group.groupChatId,
            groupChatName: groupChatName.value,
            groupChatPhotoURL: groupChatPhotoURL.value,
            members: listUsersDrop.value,
          });
        }
      } else {
        toast.error("User is existing in group chat");
      }
    };

    // remove user from list user droped
    const handleRemoveUserOutListUserDrop = (user) => {
      // handle when update form
      if (listUsersDrop.value.length > 2) {
        const index = listUsersDrop.value.findIndex(
          ({ uid }) => uid == user.uid
        );
        if (props.create) {
          listUsersDrop.value.splice(index, 1);
        } else {
          // handle when update group chat
          if (currentUser.uid != props.group.creator.uid) {
            toast.error("You not boss");
            return;
          }
          listUsersDrop.value.splice(index, 1);
          updateGroupChat({
            groupChatId: props.group.groupChatId,
            groupChatName: groupChatName.value,
            groupChatPhotoURL: groupChatPhotoURL.value,
            members: listUsersDrop.value,
          });
        }
      } else {
        toast.error("At least two users in the group");
      }
    };

    watch(
      listUsersDrop,
      async () => {
        await nextTick();
        listUsersDropScroll.value.scrollTop =
          listUsersDropScroll.value.scrollHeight;
      },
      { deep: true }
    );

    return {
      listUsersDrop,
      groupChatName,
      currentUser,
      listUsersDropScroll,
      groupChatPhotoURL,
      isPending,
      isEditGroupChatName,
      handleUploadImageGroup,
      handleDropUser,
      handleRemoveUserOutListUserDrop,
    };
  },
};
</script>

<style>
.create-new-group-chat-form {
  position: absolute;
  width: 35%;
  min-width: 400px;
  background: white;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  border-radius: 5px;
  top: 3em;
  left: 0;
  right: 0;
  padding: 1em;
  margin: 0 auto;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.create-new-group-chat-form-infor {
  text-align: left;
  margin-bottom: 1em;
}

.create-new-group-chat-form-infor input[type="text"] {
  width: 100%;
  padding: 0.3em 0.5em;
  font-size: 1.1em;
  font-family: system-ui;
  border-radius: 5px;
  border: 1px solid #8080805c;
  color: #5c5c5c;
  outline: none;
}

.create-new-group-chat-form-infor p {
  font-size: 1.1em;
  padding: 0.5em 0em;
}

.create-new-group-chat-form-member {
  width: 100%;
  max-height: 170px;
  margin: 0.5em 0em;
  overflow: auto;
}

.create-new-group-chat-form-member-item {
  display: flex;
  padding: 0.5em;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  border-radius: 5px;
  margin: 0.5em 0em;
  align-items: center;
  position: relative;
}

.create-new-group-chat-form-member-item img {
  width: 2em;
  height: 2em;
  border-radius: 100px;
  margin: 0 0.5em;
}

.new-group-chat-submit-btn {
  width: 10em;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5em 0em;
  font-size: 1em;
  margin: 1em auto 0em auto;
}

.notAllowSubmitButton {
  background: #0066ff9e;
}

.remove-user-out-list-member-icon {
  position: absolute;
  right: 0;
  font-size: 1.5em;
  padding: 0.3em 0.5em;
  cursor: pointer;
}

.message-list-drop-user-empty {
  padding: 1em;
  margin: 0.5em 0em;
  border: 1px solid gray;
  border-style: dashed;
  border-radius: 5px;
}

.new-group-chat-form-upload-image {
  width: 7em;
  height: 7em;
  margin: auto;
  border: 1px solid grey;
  border-style: dashed;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0.2em;
}

.new-group-chat-form-upload-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-chat-name {
  font-size: 1.1em;
  padding: 0.5em 0em;
  display: block;
  display: flex;
  align-items: center;
}

.edit-group-chat-name-icon {
  font-size: 0.8em;
  padding: 0.5em;
  border-radius: 100px;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  margin: 0 0.5em;
}
</style>