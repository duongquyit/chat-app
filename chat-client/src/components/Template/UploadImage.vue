<template>
  <div class="upload-image-container">
    <div
      class="upload-image"
      :class="{ darkMode: isDarkMode, borderDarkMode: isDarkMode }"
    >
      <h3 class="upload-image-title">Upload your image</h3>
      <div class="upload-image-form" :class="{ borderDarkMode: isDarkMode }">
        <input
          type="file"
          id="upload-image-input"
          @change="$emit('uploadImage', $event)"
        />
        <label
          for="upload-image-input"
          @dragstart.prevent=""
          @dragover.prevent=""
          @drop.prevent="$emit('dropImage', $event)"
        >
          <LoadingImage v-if="isPending" />
          <div class="upload-text" v-if="!imageURL">
            <span class="upload-icon"><i class="fa-solid fa-upload"></i></span>
            <span class="upload-text">Upload image from your device</span>
          </div>
          <img class="upload-image-before-save" v-else :src="imageURL" alt="" />
        </label>
      </div>
      <button @click="$emit('save')" class="save-btn">Save</button>
      <button @click="$emit('cancel')" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script>
import { isPending } from "../../composables/UploadImage";
import { isDarkMode } from "../../composables/GlobalVariables";

import LoadingImage from "./LoadingImage.vue";
export default {
  name: "UploadImage",
  props: ["imageURL"],
  components: {
    LoadingImage,
  },
  setup() {
    return { isPending, isDarkMode };
  },
};
</script>

<style>
.upload-image-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #00000026;
  z-index: 2;
  left: 0;
}

.upload-image {
  width: 600px;
  height: 450px;
  background: white;
  margin: 4em auto;
  border-radius: 10px;
}

.upload-image-title {
  padding: 0.5em;
  font-family: system-ui;
  font-weight: 400;
}

.upload-image-form {
  width: 450px;
  height: 70%;
  margin: 0 auto;
  border: 1px solid #0000008a;
  border-style: dashed !important;
}

.upload-image-form label {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  position: relative;
}

#upload-image-input {
  display: none;
}

.save-btn,
.cancel-btn {
  padding: 0.4em 0.5em;
  margin: 1em 4em;
  border: none;
  border-radius: 5px;
  font-family: system-ui;
  color: #fff;
  font-size: 1em;
}

.save-btn {
  background: #2a80c9;
}

.cancel-btn {
  background: #f73434;
}

.upload-icon {
  width: 100%;
  font-size: 2em;
  padding: 0.5em;
  display: block;
}

.upload-text {
  font-size: 1.1em;
}

.upload-image-before-save {
  max-width: 100%;
  max-height: 100%;
}
</style>