<template>
  <div v-if="!lsskActive">
    <q-banner inline-actions class="text-white bg-red q-banner--top-padding absolute-top text-center" v-if="validationError" >
      {{ validationError }}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="dismiss"/>
      </template>
    </q-banner>
    <form @submit.prevent="onSubmit">
      <ul class="wrapper">
        <li class="form-row">
          <label for="l-username">Username</label>
          <input v-model="username" id="l-username"/>
        </li>
        <li class="form-row">
          <label for="l-password">Password</label>
          <input type="password" id="l-password" v-model="password"/>
        </li>
        <li class="form-row">
          <q-checkbox v-model="remember" label="Remember Me" name="remember" color="cyan" dark/>      
        </li>
        <li class="form-row">
          <button type="submit" :disabled="isLoading">Login</button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup>
import { useConnectionStore, socket } from "@/unauthorized/stores/connection";
import { useUserStore } from "@/unauthorized/stores/user";
import {onMounted, ref} from "vue";
import moment from 'moment';

const connectionStore = useConnectionStore();
const userStore = useUserStore();
const isLoading = ref(false);
const username = ref("");
const password = ref("");
const validationError = ref("");
const remember = ref(false);
const lsskActive = ref(true);

const dismiss = () => {
  validationError.value = "";
}

function onSubmit() {
  const errorList = validate()
  if(errorList.length > 0) {
    validationError.value = errorList.join("\n");
    return;
  }

  isLoading.value = true;
  socket.timeout(5000).emit("User:Login", { username: username.value, password: password.value, remember: remember.value }, () => {
    isLoading.value = false;
  });
}

function validate() {
  const errorList = []
  if (username.value.length < 3) {
    errorList.push("Invalid username. It must be at least 3 characters long.");
  }

  if (password.value.length < 8) {
    errorList.push("Invalid password. It must be at least 8 characters long.");
  }

  return errorList;
}

onMounted(() => {
  if(userStore.lssk.key !== null && moment(userStore.lssk.validUntil).unix() >= moment().unix()) {
    socket.timeout(5000).emit("User:Login", {lssk: userStore.lssk.key, username: userStore.username }, () => {
      isLoading.value = false;
    });
  } else {
    lsskActive.value = false;
    userStore.logout();
  }

  socket.on("User:Login", data => {
    if(data.success) {
      connectionStore.isAuthorized = true;
      userStore.username = data.data.username;
      return;
    }

    userStore.logout();
    validationError.value = data.message;
  });
});
</script>

<style lang="scss" scoped>
.wrapper {
  list-style-type: none;
  padding: 20px 0 0 0;
  border-radius: 3px;

  .form-row {
    display: flex;
    justify-content: center;
    padding: .5em;

    > label {
      padding: .5em 1em .5em 0;
      flex: 1;
    }

    > input {
      flex: 2;
    }

    > input,
    > button {
      padding: .5em;
    }

    > button {
      cursor: pointer;
    }
  }
}
</style>
