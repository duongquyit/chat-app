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

import { isDarkMode } from "../../composables/GlobalVariables";

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
.chat-message-list-message {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chat-message-show-message {
  width: 100%;
  max-height: 100%;
  padding: 0.5em;
  overflow-y: auto;
}

.message {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.chat-message-receive,
.chat-message-send {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0.2em 0em;
}

.text-message {
  display: flex;
  max-width: 70%;
  position: relative;
}

.tooltip-send,
.tooltip-receive {
  position: absolute;
  top: 5px;
  background: #201f1fd1;
  color: white;
  padding: 0.5em;
  border-radius: 3px;
  font-size: 0.7em;
  width: 130px;
  visibility: hidden;
}

.tooltip-send {
  left: -140px;
}
.tooltip-receive {
  right: -140px;
}

.tooltip-send::after {
  content: " ";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #201f1fd1;
}

.tooltip-receive::after {
  content: " ";
  position: absolute;
  top: 50%;
  left: -7%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #201f1fd1 transparent transparent;
}

.text-message:hover .message-tooltip {
  visibility: visible;
}

.chat-message-receive {
  justify-content: flex-start;
}

.chat-message-send {
  justify-content: flex-end;
}

.chat-message-receive img {
  width: 2em;
  height: 2em;
  border-radius: 100px;
  margin: 0 0.5em 0 0;
}

.chat-message-receive span,
.chat-message-send span {
  padding: 0.5em 0.7em;
  border-radius: 20px;
  font-size: 0.95em;
  font-family: system-ui;
  text-align: left;
}

.chat-message-receive span {
  background: #e4e6eb;
  color: black;
}

.chat-message-send span {
  background: #0084ff;
  color: white;
}
</style>