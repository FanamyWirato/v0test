<script setup>
import Login from "../components/Login.vue";
import Create from "../../authorized/components/Create.vue";
</script>

<template>
  <header>
    <img src="./assets/logo.png" />
  </header>
  <main>
    <login></login>
    <create></create>
  </main>
</template>

<style>
  @import "./assets/main.scss";
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
  main {
    display: block;
  }
</style>
