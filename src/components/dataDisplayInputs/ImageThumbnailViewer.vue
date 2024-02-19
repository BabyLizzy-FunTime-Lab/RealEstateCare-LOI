<script>
import {IonButton, IonImg, IonModal, IonThumbnail} from "@ionic/vue";

export default {
  name: "ImageThumbnailViewer",
  components: {IonModal, IonThumbnail, IonButton, IonImg},
  props: {
    image: String,
    delete: Function,
  },
  methods: {
    openModal(setTo) {
      this.isModalOpen = setTo
    }
  },
  data() {
    return {
      isModalOpen: false
    }
  },
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
          <ion-button :@click="delete" >Delete</ion-button>
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
