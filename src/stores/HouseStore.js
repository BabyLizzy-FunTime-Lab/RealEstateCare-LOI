import {defineStore} from "pinia";

export const useHouseStore = defineStore('houses', {
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
