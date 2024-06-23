<script>
import {
  IonModal, IonHeader, IonToolbar, IonTitle,
  IonButton, IonButtons, IonContent, IonText
} from "@ionic/vue";
import {useNotificationStore} from "@/stores/NotificationStore.js";

// Let not uee props and give this direct access to the notification store.
// If a notification is needed all we need is access to the store.
export default {
  name: "BaseNotificationModal",
  components: {
    IonModal, IonHeader, IonToolbar, IonTitle,
    IonButton, IonButtons, IonContent, IonText
  },
  data() {
    return {
      notificationStore: useNotificationStore(),
    }
  },
  computed: {
    notificationIsOpen() {
      return this.notificationStore.getNotificationIsOpen;
    },
    notificationTitle() {
      return this.notificationStore.getNotificationTitle;
    },
    notificationMessage() {
      return this.notificationStore.getNotificationMessage;
    }
  }
}
</script>

<template>
  <ion-modal :is-open="notificationIsOpen" can-dismiss="true">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title slot="start">Notification</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="notificationStore.closeNotification()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-text color="secondary">
        <h2>{{notificationTitle}}</h2>
      </ion-text>
      <ion-text>{{notificationMessage}}</ion-text>
    </ion-content>
  </ion-modal>
</template>

<style scoped>

</style>
