<template>
  <div class="chat-message-list-message">
    <div class="chat-message-show-message" ref="chatScrollBar">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div
          class="chat-message-send"
          v-if="message.sender.uid == currentUser?.uid"
        >
          <div class="text-message">
            <span v-html="message.message"> </span>
            <div class="message-tooltip tooltip-send">
              {{ message?.createdAt?.toDate().getHours() }}:{{
                message?.createdAt?.toDate().getSeconds()
              }}
              {{ message?.createdAt?.toDate().toDateString() }}
            </div>
          </div>
        </div>
        <div class="chat-message-receive" v-else>
          <img :src="message.sender.photoURL" alt="" />
          <div class="text-message">
            <span v-html="message.message"> </span>
            <div class="message-tooltip tooltip-receive">
              {{ message?.createdAt?.toDate().getHours() }}:{{
                message?.createdAt?.toDate().getSeconds()
              }}
              {{ message?.createdAt?.toDate().toDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- chat input form -->
    <slot name="chatForm" :chatScrollBar="chatScrollBar"> </slot>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { nextTick, onMounted, watch } from "@vue/runtime-core";

import { isDarkMode } from "@composables/GlobalVariables";

export default {
  name: "DisplayMessage",
  props: ["messages", "currentUser"],
  setup(props) {
    const chatScrollBar = ref(null);

    // watch change of messages
    watch(
      () => props.messages,
      async () => {
        // await DOM updated then scroll bar to bottom
        await nextTick();
        chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
      }
    );

    onMounted(() => {
      // set scroll bar auto bottom when mounted
      chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
    });

    return { chatScrollBar, isDarkMode };
  },
};
</script>

<style>
@import '@assets/style/display_message.css'; 
</style>