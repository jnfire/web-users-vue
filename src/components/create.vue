<script setup>
// Dependencies
import {defineEmits, ref, watch} from 'vue'
import axios from "axios";

// Variables
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const apiBaseUrl = ref(import.meta.env.VITE_API_USERS_BASE_URL);
const isCreateUser = ref(false);
const isIntentCreateUser = ref(false);
const errorMessage = ref('');

// Functions

/**
 * Create user on API
 * @returns {Promise<void>}
 */
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

const emit = defineEmits(["create"]);

// Watchers
watch(
  // Watcher category
  () => isCreateUser.value,
  (isCreate) => {
    emit("create", isCreate)
  }
)
</script>

<template>
  <div class="container">
    <h2 class="main__title">Register</h2>
    <form class="main__form" @submit.prevent="createUser" v-if="!isCreateUser">
      <div class="error" v-if="errorMessage">
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
      <div class="main__form__div" v-if="password !== ''">
        <label class="main__form__label" for="confirmPassword">Repeat password:</label>
        <input class="main__form__input" type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div class="main__form__div" v-if="password !== '' && confirmPassword !== ''">
        <p v-if="password !== confirmPassword" style="color: red;">Passwords do not match.</p>
        <p v-else style="color: green;">Passwords match.</p>
      </div>
      <button class="main__form__button open" type="submit" >Register</button>
    </form>
  </div>
</template>
