<template>
  <div
    class="list-icon-message-reaction-container"
    :class="{ receiveMessageListIconReaction: !isSendMessage }"
  >
    <span
      class="icon-item"
      :class="{ iconReacted: iconReacted == icon }"
      v-for="icon in listIconMessageReaction"
      :key="icon"
      v-html="icon"
      @click="handleClickOnIcon(icon, message)"
    ></span>
    <span class="new-icon"><i class="fa-solid fa-plus"></i></span>
  </div>
</template>
<script>
import { listIconMessageReaction } from "@composables/CharCodeEmoji";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "ListIconMessageReaction",
  props: {
    isSendMessage: {
      type: Boolean,
    },
    message: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const currentUser = JSON.parse(localStorage.getItem("auth"));
    const iconReacted = ref("");

    const handleClickOnIcon = (icon, message) => {
      emit("reactionMessage", icon, message);
    };

    onMounted(() => {
      if (props.message.reaction) {
        props.message.reaction.forEach(({ icon, user }) => {
          if (user.uid == currentUser.uid) {
            iconReacted.value = icon;
          }
        });
      }
    });

    return { listIconMessageReaction, iconReacted, handleClickOnIcon };
  },
};
</script>

<style>
.iconReacted {
  background: #0000000f !important;
}

.list-icon-message-reaction-container {
  background: white;
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  padding: 0.3em;
  border-radius: 100px;
  display: flex;
  align-items: center;
  position: absolute;
  left: -132px;
  top: -55px;
  z-index: 2;
}

.icon-item {
  background: none;
  padding: 0.2em;
  font-size: 1.4em;
  border-radius: 50%;
  cursor: pointer;
}

.icon-item:hover {
  background: #8080802f;
}

.new-icon {
  background: #8080801f;
  font-size: 0.7em;
  width: 27px;
  height: 27px;
  text-align: center;
  display: flex;
  color: #00000057;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 0.2em;
}

.new-icon:hover {
  background-color: #8080802f;
}

.receiveMessageListIconReaction {
  left: -100px;
}
</style>