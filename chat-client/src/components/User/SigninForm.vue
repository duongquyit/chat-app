<template>
  <div class="app">
    <div class="signin-form-container">
      <div class="signin-form">
        <h3>Signin</h3>
        <form @submit.prevent="$emit('signin', email, password)">
          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Password" />
          <span class="signin-error-message" v-show="errorMessage">
            {{ errorMessage }}
          </span>
          <button type="submit">Signin</button>
        </form>
      </div>
      <div class="or-change-method-signin">
        <span>Or</span>
      </div>
      <span
        @click="$emit('signinWithGoogle')"
        class="signin-with-society-network gg-login"
        ><span class="icon-custom"
          ><i class="fa-brands fa-google"></i></span
        >&ensp;Login with Google</span
      >
      <span
        @click="$emit('signinWithFacebook')"
        class="signin-with-society-network fb-login"
      >
        <span class="icon-custom"
          ><i class="fa-brands fa-facebook"></i></span
        >&ensp;Login with Facebook</span
      >
      <p class="redirect-page">
        You don't has account?
        <router-link :to="{ name: 'signup' }">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  name: "SigninForm",
  props: ["errorMessage"],
  setup() {
    const email = ref("");
    const password = ref("");

    return { email, password };
  },
};
</script>

<style>
@import '@assets/style/signin.css';
</style>