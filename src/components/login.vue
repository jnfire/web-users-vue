<script setup>
import { ref, defineEmits, watch } from 'vue';
import axios from "axios";

const email = ref('');
const password = ref('');
const apiBaseUrl = ref(import.meta.env.VITE_API_USERS_BASE_URL);
const errorMessage = ref('');
const newToken = ref('');

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
  <div>
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <div v-if="errorMessage">
        <p style="color: red;">{{ errorMessage }}</p>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>
