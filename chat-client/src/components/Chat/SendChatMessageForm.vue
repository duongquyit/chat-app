<template>
  <div class="chat-message-form">
    <form @submit.prevent="$emit('submitSendMessage', textInput)">
      <slot
        name="listEmotion"
        :isShowEmotions="isShowEmotions"
        :textInput="textInput"
      >
      </slot>
      <span
        class="chat-form-emotion"
        v-html="emotionIcon"
        @mouseleave="handleChangeEmotionIcon"
        @click="isShowEmotions = !isShowEmotions"
      ></span>
      <div
        class="input-text-message"
        :class="{ borderDarkMode: isDarkMode, darkMode: isDarkMode }"
        ref="textInput"
        contenteditable="true"
        placeholder="Text message"
        aria-multiline="true"
        spellcheck="false"
        @keydown="$emit('changeTextMessage', $event, chatScrollBar)"
      ></div>
      <button type="submit" :class="{ darkMode: isDarkMode }">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { isDarkMode } from "../../composables/GlobalVariables";
import { emotionsCode } from "../../composables/CharCodeEmoji";
import { watch } from "@vue/runtime-core";

export default {
  name: "SendChatMessageForm",
  props: ["chatScrollBar"],
  setup() {
    const textInput = ref(null);
    const isShowEmotions = ref(false);
    const emotionIcon = ref(
      emotionsCode[Math.floor(Math.random() * emotionsCode.length)]
    );

    const handleChangeEmotionIcon = () => {
      emotionIcon.value =
        emotionsCode[Math.floor(Math.random() * emotionsCode.length)];
    };

    // event click outside emotion table and close this
    watch(isShowEmotions, () => {
      const clickOutsideEmotionContainer = (event) => {
        const emotionElement = document.querySelector(".list-enimotion");
        const emotion = document.querySelector(".chat-form-emotion");
        if (
          !emotionElement.contains(event.target) &&
          !emotion.contains(event.target)
        ) {
          isShowEmotions.value = false;
          document.removeEventListener("click", clickOutsideEmotionContainer);
        }
      };
      if (isShowEmotions.value) {
        document.addEventListener("click", clickOutsideEmotionContainer);
      }
    });

    return {
      isDarkMode,
      textInput,
      emotionIcon,
      isShowEmotions,
      handleChangeEmotionIcon,
    };
  },
};
</script>

<style>
.chat-message-form {
  width: 100%;
  padding: 0.5em 0em;
}

.chat-message-form form {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  position: relative;
}

.chat-message-form form input {
  width: 85%;
  padding: 0.5em 1em;
  font-size: 1em;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: #000000bf;
  font-family: system-ui;
  outline: none;
}

.input-text-message {
  max-width: 85%;
  width: 85%;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 1em;
  padding: 0.5em 1em;
  text-align: left;
  outline: none;
  font-family: system-ui;
  max-height: 8em;
  overflow-y: auto;
}

.input-text-message:empty:before {
  content: attr(placeholder);
  cursor: text;
  display: inline-block;
  width: 85%;
}

.chat-message-form form button {
  border: none;
  background: #fff;
  color: #0066ff !important;
  font-family: system-ui;
  display: block;
  font-size: 1.2em;
  padding: 0.5em;
}

.chat-form-emotion {
  padding: 0.3em;
  font-size: 1.5em;
  cursor: pointer;
  border-radius: 100px;
}

.chat-form-emotion:hover {
  background: #80808026;
}
</style>