<script setup>
import { ref } from 'vue'
import axios from "axios";

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const apiBaseUrl = ref(import.meta.env.VITE_API_USERS_BASE_URL);
const isCreateUser = ref(false);
const isIntentCreateUser = ref(false);
const errorMessage = ref('');


function createUser() {
  if (password.value === confirmPassword.value && email.value) {
    // Conect to the API for create user
    axios.post(apiBaseUrl.value + "account/create/", {
      email: email.value,
      password: password.value
    })
    .then(function (response) {
      // Clean error message
      errorMessage.value = '';
      // Check response
      if (response.status === 201) {
        isCreateUser.value = true;
      } else {
        errorMessage.value = 'Is not created user';
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

</script>

<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="createUser" v-if="!isCreateUser">
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
      <div v-if="password !== ''">
        <label for="confirmPassword">Repeat password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div v-if="password !== '' && confirmPassword !== ''">
        <p v-if="password !== confirmPassword" style="color: red;">Passwords do not match.</p>
        <p v-else style="color: green;">Passwords match.</p>
      </div>
      <button type="submit" >Register</button>
    </form>
    <div v-else>
      <p>¡User successfully created!</p>
      <button @click="">Login</button>
    </div>
  </div>
</template>
