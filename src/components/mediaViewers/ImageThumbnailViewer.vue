<script>
import {
  IonHeader, IonToolbar, IonButton, IonButtons,
  IonContent, IonImg, IonModal, IonThumbnail
} from "@ionic/vue";
import { modalController } from "@ionic/vue";

export default {
  name: "ImageThumbnailViewer",
  components: {
    IonHeader, IonToolbar, IonModal, IonContent,
    IonThumbnail, IonButton, IonButtons, IonImg
  },
  props: {
    image: String,
    readOnly: {
      type: Boolean,
      default: false
    }
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
      this.closeModal();
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
  <ion-thumbnail class="imageThumbnail" :image="image" @click="openModal">
    <ion-img :src="image"></ion-img>
    <ion-modal class="imageThumbnail--imageViewer" :is-open="isModalOpen" can-dismiss="true">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button v-if="!readOnly" @click="emitDeletePhoto(image)" >Delete</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content :scrollX="true" :scrollY="true" >
        <ion-img class="imageViewer__image" :src="image"/>
      </ion-content>
    </ion-modal>
  </ion-thumbnail>
</template>

<style scoped lang="scss">
.imageThumbnail {
  --size: 8em;
  max-width: 20vw;
  max-height: 20vw;
}
.imageThumbnail--imageViewer {
  --ion-background-color: var(--ion-color-modal-dark-background);
  --width: 100vw;
  --max-width: 80em;
  --height: 100%;
  --max-height: 50em;
}
.imageViewer__image {
  height: 100%;
  background-color: transparent;
}
</style>
