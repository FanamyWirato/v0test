<template>
  <q-banner inline-actions class="text-white bg-red q-banner--top-padding absolute-top text-center" v-if="validationError" >
    {{ validationError }}
    <template v-slot:action>
      <q-btn flat color="white" label="Dismiss" @click="dismiss"/>
    </template>
  </q-banner>
  <q-banner inline-actions class="text-white bg-green q-banner--top-padding absolute-top text-center" v-if="creationSuccess" >
    {{ creationSuccess}}
    <template v-slot:action>
      <q-btn flat color="white" label="Dismiss" @click="dismiss"/>
    </template>
  </q-banner>
  <form @submit.prevent="onSubmit">
    <ul class="wrapper">
      <li class="form-row">
        <label for="c-username">Username</label>
        <input v-model="username" id="c-username"/>
      </li>
      <li class="form-row">
        <label for="c-password">Password</label>
        <input type="password" id="c-password" v-model="password"/>
      </li>
      <li class="form-row">
        <button type="submit" :disabled="isLoading">Create</button>
      </li>
    </ul>
  </form>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import { socket } from "@/unauthorized/stores/connection";

const isLoading = ref(false);
const username = ref("");
const password = ref("");
const validationError = ref("");
const creationSuccess = ref("");

const dismiss = () => {
  validationError.value = "";
  creationSuccess.value = "";
}
const onSubmit = () => {
  const errorList = validate()
  if(errorList.length > 0) {
    validationError.value = errorList.join("\n");
    return;
  }

  isLoading.value = true;
  socket.timeout(5000).emit("User:Create", { username: username.value, password: password.value }, () => {
    isLoading.value = false;
  });
};

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
  socket.on("User:Create", (data) => {
    if(data.success) {
      creationSuccess.value = "Account creation successfull, you can login now!";
      return;
    }

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
