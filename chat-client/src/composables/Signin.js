import { socket } from '@/plugins/socket';

import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { ref } from 'vue';
import { auth } from '../config/firebase';

import router from '../router/index';

const isPending = ref(false);
const errorMessage = ref("");


const signin = async (email, password) => {
  try {
    isPending.value = true;
    errorMessage.value = '';
    const res = await signInWithEmailAndPassword(auth, email, password);
    socket.connect();
    socket.auth = res.user.providerData[0];
    localStorage.setItem('auth', JSON.stringify(res.user.providerData[0]));
    router.push('chat');
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email';
        break;
      case 'auth/internal-error':
        errorMessage.value = 'Missing password';
        break;
      case 'auth/wrong-password':
        errorMessage.value = 'Wrong password';
        break;
      case 'auth/user-not-found':
        errorMessage.value = 'Email not found';
        break;
      default:
        errorMessage.value = error.code;
    }
  } finally {
    isPending.value = false;
  }
}

const googleProvider = new GoogleAuthProvider();
const signinWithGoogle = async () => {
  try {
    isPending.value = true;
    errorMessage.value = '';
    const res = await signInWithPopup(auth, googleProvider);
    socket.connect();
    socket.auth = res.user.providerData[0];
    router.push('chat');
    localStorage.setItem('auth', JSON.stringify(res.user.providerData[0]));
  } catch (error) {
    errorMessage.value = error.code;
  } finally {
    isPending.value = false;
  }
}

const faceBookProvider = new FacebookAuthProvider();
const signinWithFacebook = async () => {
  try {
    isPending.value = true;
    errorMessage.value = '';
    const res = await signInWithPopup(auth, faceBookProvider);
    socket.connect();
    socket.auth = res.user.providerData[0];
    localStorage.setItem('auth', JSON.stringify(res.user.providerData[0]));
    router.push('chat');
  } catch (error) {
    errorMessage.value = error.code;
  } finally {
    isPending.value = false;
  }
}

export { signin, signinWithGoogle, signinWithFacebook, isPending, errorMessage }