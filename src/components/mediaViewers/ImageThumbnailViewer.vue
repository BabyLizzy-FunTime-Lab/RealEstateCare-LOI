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
  <ion-thumbnail :image="image" @click="openModal">
    <ion-img class="test" :src="image"></ion-img>
    <ion-modal :is-open="isModalOpen" can-dismiss="true">
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
      <ion-content :scrollX="true" :scrollY="true" id="image--wrapper">
        <ion-img :src="image"/>
      </ion-content>
    </ion-modal>
  </ion-thumbnail>
</template>

<style scoped lang="scss">
ion-modal {
  --ion-background-color: var(--ion-color-modal-dark-background);
  --width: 100vw;
  --max-width: 80em;
  --height: 100%;
  --max-height: 50em;
}
#image--wrapper {
  ion-img {
    height: 100%;
    background-color: transparent;
  }
}
ion-thumbnail {
  --size: 100%;
}
</style>
