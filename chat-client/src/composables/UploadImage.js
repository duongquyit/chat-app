import axios from 'axios';
import { ref } from 'vue';

const isPending = ref(false);

const uploadImageToCloud = async (imageName) => {
  const formData = new FormData();
  formData.append('file', imageName);
  formData.append('upload_preset', `${process.env.VUE_APP_CLOUD_DINARY_PRESET}`);
  try {
    isPending.value = true;
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.VUE_APP_CLOUD_DINARY_NAME}/image/upload`, formData);
    return res.data.secure_url;
  } catch (error) {
    console.log(error);
  } finally {
    isPending.value = false;
  }
}

export { uploadImageToCloud, isPending }