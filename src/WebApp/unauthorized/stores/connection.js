import { defineStore } from "pinia";
import {io} from "socket.io-client";
import moment from 'moment';

const URL = `http://192.168.1.200:8080`;

export const socket = io(URL);

export const useConnectionStore = defineStore("connection", {
    state: () => ({
        isConnected: false,
        isAuthorized: false,
    }),

    actions: {
        bindEvents() {
            socket.on("connect", () => {
                this.isConnected = true;
            });

            socket.on("disconnect", () => {
                this.isConnected = false;
            });
        },
    },
});

// const URL = process.env.NODE_ENV === "production" ? undefined : `http://localhost:8080`;

