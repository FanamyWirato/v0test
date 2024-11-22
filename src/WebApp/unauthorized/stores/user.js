import { defineStore } from "pinia";
import moment from 'moment';
import { useConnectionStore} from "@/unauthorized/stores/connection";


export const useUserStore = defineStore("user", {
    persist: true, // This is now correctly recognized by pinia-plugin-persistedstate
    state: () => ({
        lssk: {key: null, validUntil: moment()},
        username: null
    }),

    actions: {
        logout() {
            const connectionStore = useConnectionStore();
            connectionStore.isAuthorized = false;
            this.lssk = {key: null, validUntil: moment()};
            this.username = null;
        }
    },
});
