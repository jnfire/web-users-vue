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
  <h2>Profile</h2>
  <h3>{{ profile.name }}</h3>
  <div v-if="errorMessage">
    <p style="color: red;">{{ errorMessage }}</p>
  </div>
  <div>
    <img :src="profile.avatar_url" alt="Avatar">
    <form @submit.prevent="updateImageProfile">
      <label for="avatar">Avatar:</label>
      <input type="file" id="avatar" accept="image/*">
      <button type="submit">Update image</button>
    </form>
  </div>
  <form v-if="isEdit" @submit.prevent="updateProfile">
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="profile.email" required>
    </div>
    <div>
      <label for="first_name">First name:</label>
      <input type="text" id="first_name" v-model="profile.first_name">
    </div>
    <div>
      <label for="last_name">Last name:</label>
      <input type="text" id="last_name" v-model="profile.last_name" >
    </div>
    <div>
      <button type="button" @click.prevent="isEdit = !isEdit">Cancel</button>
      <button type="submit">Save</button>
    </div>
  </form>
  <div v-else>
    <div>
      <p>Email:</p>
      <p>
        {{ profile.email }}
      </p>
    </div>
    <div>
      <p>First name:</p>
      <p>
        {{ profile.first_name }}
      </p>
    </div>
    <div>
      <p>Last name:</p>
      <p>
        {{ profile.last_name }}
      </p>
    </div>
    <div>
      <button type="button" @click.prevent="isEdit = !isEdit">Edit</button>
    </div>
  </div>
</template>
