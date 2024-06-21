import {defineStore} from "pinia";

export const useNotificationStore = defineStore('notifications', {
  state: () => {
      return {
          notificationTitle: String,
          notificationMessage: String
      }
  },
  actions: {
    setTitle(givenTitle) {
        this.notificationTitle = givenTitle;
    },
    setMessage(givenMessage) {
        this.notificationMessage = givenMessage;
    }
  }
})
