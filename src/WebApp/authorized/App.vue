<script setup>
import LongSignedSessionKey from "./components/LongSignedSessionKey.vue";
import { socket } from "@/unauthorized/stores/connection";
import { onMounted, ref } from 'vue';
const categories = ref([
  {
    name: 'General',
    links: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' }
    ]
  },
  {
    name: 'Services',
    links: [
      { name: 'Service 1', path: '/service1' },
      { name: 'Service 2', path: '/service2' }
    ]
  }
]);
const leftDrawerOpen = ref(false)
function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
}

socket.timeout(5000).emit("Config:ListMenu");
onMounted(() => {
  socket.on("Config:ListMenu", data => {
    if(data.success) {
      categories.value = [];
      for (const [category, entries] of Object.entries(data.data.nav)) {
        console.log(category, entries)
        categories.value.push({
          name: category,
          links: entries.map(entry => ({ name: entry, path: `/${entry.toLowerCase()}` }))
        });
      }
    }
  });
});
</script>

<template>
  <q-layout view="lHh LpR lfr">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/logo.png">
          </q-avatar>
          Cavalcando
          <LongSignedSessionKey class="right"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left">
      <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="(category, index) in categories" :key="index" class="category">
              <h5>{{ category.name }}</h5>
              <router-link v-for="link in category.links" :key="link.path" :to="link.path">{{ link.name }}</router-link><br>
            </div>
          </div>
        </q-scroll-area>          
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
</q-layout>
</template>
<style>
  @import "../assets/main.scss";
  @import '@quasar/extras/material-icons/material-icons.css';
  @import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
</style>
<style scoped lang="scss">
// Define color variables for easy theme management
// $nav-bg-color: rgba(0, 78, 78, 0.10);
// $header-bg-color: rgba(0, 255, 255, 0.05);
// $hover-bg-color: rgba(0, 255, 255, 0.33);
// $text-color: white;

// Global styles
body {
  margin: 0;
  padding: 0;
  width: 100vw;
}

.app {
  display: flex;
  height: 100vh;
}
h5{
  color: $primary;
}

.category {
  margin-bottom: 20px;

  // h5 {
  //   margin: 0 0 10px 20px;
  // }

  a {
    padding: 0 0 0 20px;
    text-decoration: none;
    display: block;
  }
}
</style>