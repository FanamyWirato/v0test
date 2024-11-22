<script setup>
import { useConnectionStore } from '@/unauthorized/stores/connection.js'; 
import UnauthorizedComponent from './unauthorized/App.vue';
import AuthorizedComponent from './authorized/App.vue';
const connectionStore = useConnectionStore();
</script>

<template>
    <div id="app">
        <main>
            <UnauthorizedComponent v-if="!connectionStore.isAuthorized"/>
            <AuthorizedComponent v-else @logout="connectionStore.logout" />
        </main>
    </div>
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