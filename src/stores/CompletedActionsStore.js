import {defineStore} from "pinia";

export const useHouseStore = defineStore('CompletedActions', {
    state: () => {
        return {
            storeTestVar: 'Store works!'
        }
    },
    getters: {
        getStoreTest(state) {
            return state.storeTestVar;
        }
    }
})
