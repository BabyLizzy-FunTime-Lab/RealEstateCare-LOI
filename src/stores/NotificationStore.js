import {defineStore} from "pinia";

export const useNotificationStore = defineStore('notifications', {
  state: () => {
      return {
          notificationIsOpen: {
              type: Boolean,
              default: false
          },
          notificationTitle: String,
          notificationMessage: String
      }
  },
  actions: {
    setNotification(title, message) {
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationIsOpen = true;
    },
    closeNotification() {
        this.notificationTitle = "";
        this.notificationMessage = "";
        this.notificationIsOpen = false;
    }
  },
  getters: {
    getNotificationTitle(state) {
        return state.notificationTitle;
    },
    getNotificationMessage(state) {
        return state.notificationMessage;
    },
    getNotificationIsOpen(state) {
        return state.notificationIsOpen;
    }
  }
})
