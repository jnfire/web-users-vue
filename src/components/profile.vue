<script setup>
// Dependencies
import {defineProps, onMounted, ref} from "vue";
import axios from "axios";

// Props
const props = defineProps({
  // User data
  token: {
    type: String,
    required: true,
  },
});

// Variables
const apiBaseUrl = ref(import.meta.env.VITE_API_USERS_BASE_URL);
const profileUrl = ref(apiBaseUrl.value + "account/profile/");
const errorMessage = ref('');
const profile = ref({
  email: '',
  name: '',
  first_name: '',
  last_name: '',
  avatar_url: '',
});
const isEdit= ref(false);
const base64Image = ref('');

// Functions
/**
 * Get profile from API
 * @returns {Promise<void>}
 */
function getProfile() {
  axios.get(profileUrl.value, {
    headers: {
      Authorization: `Token ${props.token}`,
    },
  })
    .then((response) => {
      // Set profile
      profile.value = response.data;
    })
    .catch((error) => {
      // Check error
      if (error.response) {
        errorMessage.value = error.response.data.response;
      }
    })
}


/**
 * Update profile on API
 * @returns {Promise<void>}
 */
function updateProfile() {
  // Clean error message
  errorMessage.value = '';
  // Conect to the API for update profile
  axios.put(profileUrl.value, {
    email: profile.value.email,
    name: profile.value.name,
    first_name: profile.value.first_name,
    last_name: profile.value.last_name,
  }, {
    headers: {
      Authorization: `Token ${props.token}`,
    },
  })
    .then(function (response) {
      // Set profile
      profile.value = response.data;
      // Set edit mode
      isEdit.value = false;
    })
    .catch(function (error) {
      // Check error
      if (error.response) {
        errorMessage.value = error.response.data.response;
      }
    });
}

/**
 * Returns a file in Base64URL format.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function encodeFileAsBase64Url(file) {
  const reader = new FileReader();

  reader.onload = (event) => {
    base64Image.value = event.target.result;
  };

  reader.readAsDataURL(file);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(base64Image.value);
    };
  });
}

/**
 * Update image profile on API
 * @returns {Promise<void>}
 */
async function updateImageProfile() {
  // Clean error message
  errorMessage.value = '';
  const file = document.getElementById('avatar').files[0];
  if (file) {
    // Check is image
    if (file.type.includes('image')) {
      // Prepare encoded file
      const base64Url = await encodeFileAsBase64Url(file);
      const base64 = base64Url.split(',')[1];
      if (base64) {
        // Conect to the API for update profile
        axios.put(profileUrl.value, {
          avatar: {
            base64: base64,
            name: file.name,
          },
        }, {
          headers: {
            Authorization: `Token ${props.token}`,
          },
        })
          .then(function (response) {
            // Set profile
            profile.value = response.data;
            // Clean file input
            document.getElementById('avatar').value = '';
          })
          .catch(function (error) {
            // Check error
            if (error.response) {
              errorMessage.value = error.response.data.response;
            }
          });
      } else {
        errorMessage.value = 'Error encoding file';
      }
    } else {
      errorMessage.value = 'The file is not an image';
    }
  } else {
    errorMessage.value = 'No file selected';
  }
}


// On start
onMounted(() => {
  getProfile();
})
</script>

<template>
  <div class="container">
    <h2 class="main__title">Profile</h2>
    <h3 class="main__subtitle">{{ profile.name }}</h3>
    <div class="error" v-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
    <div>
      <img class="avatar" :src="profile.avatar_url" alt="Avatar">
      <form class="avatar__form" @submit.prevent="updateImageProfile">
        <label class="avatar__form__item avatar__form__label" for="avatar">Avatar:</label>
        <input class="avatar__form__item avatar__form__input" type="file" id="avatar" accept="image/*">
        <button class="avatar__form__item avatar__form__button open" type="submit">Update image</button>
      </form>
    </div>
    <form class="main__form" v-if="isEdit" @submit.prevent="updateProfile">
      <div class="main__form__div">
        <label class="main__form__label" for="email">Email:</label>
        <input class="main__form__input" type="email" id="email" v-model="profile.email" required>
      </div>
      <div class="main__form__div">
        <label class="main__form__label" for="first_name">First name:</label>
        <input class="main__form__input" type="text" id="first_name" v-model="profile.first_name">
      </div>
      <div class="main__form__div">
        <label class="main__form__label" for="last_name">Last name:</label>
        <input class="main__form__input" type="text" id="last_name" v-model="profile.last_name" >
      </div>
      <div class="main__form__div">
        <button class="main__form__button close" type="button" @click.prevent="isEdit = !isEdit">Cancel</button>
        <button class="main__form__button open" type="submit">Save</button>
      </div>
    </form>
    <div class="main__form" v-else>
      <div class="main__form__div">
        <p class="main__form__label">Email:</p>
        <p class="main__form__input__set">
          {{ profile.email }}
        </p>
      </div>
      <div class="main__form__div">
        <p class="main__form__label">First name:</p>
        <p class="main__form__input__set">
          {{ profile.first_name }}
        </p>
      </div>
      <div class="main__form__div">
        <p class="main__form__label">Last name:</p>
        <p class="main__form__input__set">
          {{ profile.last_name }}
        </p>
      </div>
      <div class="main__form__div">
        <button class="main__form__button open" type="button" @click.prevent="isEdit = !isEdit">Edit</button>
      </div>
    </div>
  </div>
</template>
