<script>
import {IonHeader, IonToolbar, IonButton, IonButtons, IonContent, IonImg, IonModal, IonThumbnail} from "@ionic/vue";

export default {
  name: "ImageThumbnailViewer",
  components: {IonHeader, IonToolbar, IonModal, IonContent, IonThumbnail, IonButton, IonButtons, IonImg},
  props: {
    image: String,
    delete: Function,
  },
  methods: {
    openModal(setTo) {
      this.isModalOpen = setTo
    },
    emitToParent(eventName, img) {
      this.$emit(eventName, img);
      this.openModal(false);
    }
  },
  data() {
    return {
      isModalOpen: false
    }
  },
  emits: ['delete-event']
}
</script>

<template>
  <ion-thumbnail @click="openModal(true)">
    <ion-img :src="image"></ion-img>
  </ion-thumbnail>
  <ion-modal :is-open="isModalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="emitToParent('delete-event', image)" >Delete</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="openModal(false)">Close</ion-button>
        </ion-buttons>
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
