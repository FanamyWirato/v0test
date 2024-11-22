<template>
    <div>
        Hello Menu!
    </div>
</template>

<script setup>
import { useConnectionStore, socket } from "@/unauthorized/stores/connection";
import {onMounted, ref} from "vue";

const isLoading = ref(false);

onMounted(() => {
    socket.timeout(5000).emit("Config:ListMenu", {}, () => {
        isLoading.value = false;
    });

    socket.on("Config:ListMenu", data => {
        if(data.success) {
            console.log(data.data)
        }
    });
});
</script>

<style lang="scss" scoped>
</style>