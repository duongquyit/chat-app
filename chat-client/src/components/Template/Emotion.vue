<template>
  <div class="list-enimotion">
    <div class="emotion-nav"></div>
    <div class="emotion-item" v-if="isShowEmotions">
      <span
        class="emotion"
        v-for="emotion in emotionsCode"
        :key="emotion"
        v-html="emotion"
        @click="handleClickEmotion(emotion)"
      ></span>
    </div>
  </div>
</template>

<script>
import { emotionsCode } from "../../composables/CharCodeEmoji";
export default {
  name: "EmotionTemplate",
  props: ["isShowEmotions", "textInput"],
  setup(props, { emit }) {
    const handleClickEmotion = (emotion) => {
      emit("addEmotion", emotion, props.textInput);
    };
    return { emotionsCode, handleClickEmotion };
  },
};
</script>

<style>
.list-enimotion {
  position: absolute;
  background: white;
  border-radius: 5px;
  top: -225px;
  left: -7px;
  box-shadow: rgb(0 0 0 / 18%) 0px 10px 18px;
}

.emotion-item::after {
  content: " ";
  position: absolute;
  border-width: 10px;
  border-style: solid;
  border-color: white transparent transparent transparent;
  bottom: -20px;
  left: 20px;
}

.emotion-item {
  padding: 0.5em;
  width: 300px;
  height: 220px;
  overflow: auto;
  text-align: center;
}

.emotion {
  font-size: 1.5em;
  padding: 0.46em;
  display: inline-block;
  border-radius: 20px;
  cursor: pointer;
}

.emotion:hover {
  background: #80808026;
}
</style>