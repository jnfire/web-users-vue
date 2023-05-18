<script setup>
import {ref, onMounted} from 'vue'
// Components
import Login from './components/login.vue'
import Create from './components/create.vue'
import Profile from "@/components/profile.vue";

// Variables
const token = ref('')
const createAccount = ref(false)

// Functions

/**
 * @description This function is to get the token from the localstorage
 * @returns {void}
 */
const getToken = () => {
  const localToken = localStorage.getItem('token')
  if (localToken) {
    token.value = localToken
  }
}


onMounted(() => {
  getToken()
})
</script>

<template>
  <header>
    <h1>Users Website</h1>
  </header>
  <main>
    <div v-if="!token">
      <Create v-if="createAccount" msg="Es para crear el usuario" />
      <Login v-else msg="Para logear el usuario" />
    </div>
    <Profile v-else msg="Es para ver el perfil del usuario" />
  </main>
  <footer>
    <p>
      Developed by <a href="https://github.com/jnfire">jnfire</a>
    </p>
  </footer>
</template>
