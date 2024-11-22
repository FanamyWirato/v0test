<script setup>
import Login from "./components/Login.vue";
import { ref } from "vue";
import { useUserStore } from "@/unauthorized/stores/user";
import moment from 'moment';

const userStore = useUserStore();
const lsskActive = ref(true);

if(!(userStore.lssk.key !== null && moment(userStore.lssk.validUntil).unix() >= moment().unix())) {
  lsskActive.value = false;
}
</script>

<template>
  <div class="app-root" v-show="!lsskActive">
    <header>
      <img src="../assets/logo.png" />
    </header>
    <main>
      <login></login>
    </main>
  </div>
</template>

<style>
  @import "../assets/main.scss";
  @import '@quasar/extras/material-icons/material-icons.css';
  @import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
</style>
<style scoped>
  body {
    margin: 0;
    padding: 0;
  }
  header {
    display: block;
  }
  .app-root {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically (if needed) */
    min-height: 100vh; /* Make main element at least as tall as the viewport */
    flex-direction: column;
  }
</style>
