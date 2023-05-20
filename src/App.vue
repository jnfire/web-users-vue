<script setup>
import {ref} from 'vue'
// Components
import Login from './components/login.vue'
import Create from './components/create.vue'
import Profile from "@/components/profile.vue";
import axios from "axios";


// Variables
const token = ref(localStorage.getItem('token'))
const errorMessage = ref('')
const createAccount = ref(false)

// Functions

/**
 * Logout user on API
 * @returns {Promise<void>}
 */
function logoutUser() {
  // Clean error message
  errorMessage.value = '';
  // Conect to the API for logout user
  axios.get(import.meta.env.VITE_API_USERS_BASE_URL + "account/logout/", {
    headers: {
      Authorization: "Token " + token.value,
    }
  })
    .then(function () {
      // Remove token
      localStorage.removeItem('token');
      // Clean token
      token.value = '';
    })
    .catch(function (error) {
      // Check error
      if (error.response) {
        errorMessage.value = error.response.data.response;
      }
    });
}
</script>
<template>
  <header class="header">
    <h1 class="header__title"><a href="#">Users Website</a></h1>
    <nav class="header__nav">
      <ul class="header__nav__ul" v-if="!token">
        <li class="header__nav__li">
          <button class="header__nav__button open" @click="createAccount = true">Create Account</button>
        </li>
        <li class="header__nav__li">
          <button class="header__nav__button" @click="createAccount = false">Login</button>
        </li>
      </ul>
      <ul class="header__nav__ul" v-else>
        <li class="header__nav__li">
          <button class="header__nav__button close" @click="logoutUser">Logout</button>
        </li>
      </ul>
    </nav>
  </header>
  <div class="error" v-if="errorMessage">
    <p>{{ errorMessage }}</p>
  </div>
  <main>
    <div v-if="!token">
      <Create v-if="createAccount" @create="createAccount = !$event"/>
      <Login v-else @token="token = $event"/>
    </div>
    <Profile v-else :token="token"/>
  </main>
  <footer class="footer">
    <p class="footer__text">
      Developed by <a class="footer__link" href="https://github.com/jnfire">jnfire</a>
    </p>
  </footer>
</template>
