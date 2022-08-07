<template>
  <div class="app">
    <Loading v-if="isPending" />
    <div class="signup-form-container">
      <div class="siggup-form">
        <h3>Signup</h3>
        <form
          @submit.prevent="
            $emit('signup', email, password, name),
              (email = ''),
              (password = ''),
              (name = '')
          "
        >
          <input type="text" placeholder="Your full name" v-model="name" />
          <input type="email" placeholder="Email" v-model="email" />
          <input type="password" placeholder="Password" v-model="password" />
          <span class="signup-form-error-message" v-show="errorMessage">
            {{ errorMessage }}
          </span>
          <button type="submit">Signup</button>
        </form>
        <p class="redirect-page">
          You has account?
          <router-link :to="{ name: 'signin' }">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import Loading from "@components/Template/Loading.vue";
export default {
  name: "SignupForm",
  props: ["isPending", "errorMessage"],
  components: {
    Loading,
  },
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");

    return { name, email, password };
  },
};
</script>

<style>
@import '@assets/style/signup.css';
</style>