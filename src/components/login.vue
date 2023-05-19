<script setup>
// Dependencies
import { ref, defineEmits, watch } from 'vue';
import axios from "axios";

// Variables
const email = ref('');
const password = ref('');
const apiBaseUrl = ref(import.meta.env.VITE_API_USERS_BASE_URL);
const errorMessage = ref('');
const newToken = ref('');

// Functions

/**
 * Login user on API
 * @returns {Promise<void>}
 */
function loginUser() {
  if (email.value && password.value) {
    // Clean error message
    errorMessage.value = '';
    // Conectarse a la API para iniciar sesión del usuario
    axios.post(apiBaseUrl.value + "account/login/", {
      email: email.value,
      password: password.value
    })
      .then(function (response) {
        if (response.status === 200 && response.data.token) {
          if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
          }
          // Set new token
          newToken.value = response.data.token;
          // Save token in localstorage
          localStorage.setItem('token', response.data.token);
        }
      })
      .catch(function (error) {
        // Check error
        if (error.response) {
          errorMessage.value = error.response.data.response;
        }
      })
  }
}

// Emits
const emit = defineEmits(["token"]);

// Watchers
watch(
  // Watcher category
  () => newToken.value,
  (token) => {
    emit("token", token)
  }
)
</script>

<template>
  <div class="container">
    <h2 class="main__title">Login</h2>
    <form class="main__form" @submit.prevent="loginUser">
      <div class="error" v-if="!errorMessage">
        <p style="color: red;">{{ errorMessage }}</p>
      </div>
      <div class="main__form__div">
        <label class="main__form__label" for="email">Email:</label>
        <input class="main__form__input" type="email" id="email" v-model="email" required>
      </div>
      <div class="main__form__div">
        <label class="main__form__label" for="password">Password:</label>
        <input class="main__form__input" type="password" id="password" v-model="password" required>
      </div>
      <button class="main__form__button open" type="submit">Login</button>
    </form>
  </div>
</template>
