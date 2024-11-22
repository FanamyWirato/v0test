<template>
    <span @click="logout" class="clickable">Logout</span>
</template>
<script setup>
import {onMounted} from 'vue';
import { useUserStore } from "@/unauthorized/stores/user";
import { socket } from "@/unauthorized/stores/connection";
import moment from 'moment';

const userStore = useUserStore();

const logout = () => {
    userStore.logout();
}

onMounted(() => {
    socket.on("User:Login:Remember", (data) => {
        if(data.success) {
            userStore.lssk.key = data.data.key;
            userStore.lssk.validUntil = moment(data.data.validUntil);
            userStore.lsskKey = data.data.key;
        } else {
            userStore.logout();
        }
        console.log(userStore.lssk);
        console.log(userStore.lsskKey);
    });
});
</script>
<style scoped lang="scss">
    span {
        float: right;
    }
</style>