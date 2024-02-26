<script>
import {IonHeader, IonToolbar, IonButton, IonButtons, IonContent, IonImg, IonModal, IonThumbnail} from "@ionic/vue";
import { modalController } from "@ionic/vue";

export default {
  name: "ImageThumbnailViewer",
  components: {IonHeader, IonToolbar, IonModal, IonContent, IonThumbnail, IonButton, IonButtons, IonImg},
  props: {
    image: String,
    delete: Function,
  },
  methods: {
    openModal() {
      this.isModalOpen = true
    },
    async dismissModal() {
      await modalController.dismiss();
    },
    closeModal() {
      this.isModalOpen = false
    },
    emitDeletePhoto(img) {
      this.$emit('delete-event', img);
      this.dismissModal();
    }
  },
  data() {
    return {
      isModalOpen: false,
    }
  },
  emits: ['delete-event']
}
</script>

<template>
  <ion-thumbnail @click="openModal">
    <ion-img :src="image"></ion-img>
  </ion-thumbnail>
  <ion-modal :is-open="isModalOpen" can-dismiss="true">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="emitDeletePhoto(image)" >Delete</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
        <a :href="image" download>Dowmload</a>
      </ion-toolbar>
    </ion-header>
    <ion-content id="image--wrapper">
      <ion-img :src="image"/>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">
#image--wrapper {
  ion-img {
    padding-top: 1em;
    height: 80vh;
  }
}
</style>
