import {defineStore} from "pinia";

export const useNotificationStore = defineStore('notifications', {
  state: () => {
      return {
          notificationIsOpen: false,
          notificationTitle: "",
          notificationMessage: ""
      }
  },
  actions: {
    setNotification(title, message) {
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationIsOpen = true;
        console.log("Deploying notification");
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
