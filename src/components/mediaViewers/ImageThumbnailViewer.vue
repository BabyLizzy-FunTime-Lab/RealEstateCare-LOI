<script>
import {
  IonHeader, IonToolbar, IonButton, IonButtons,
  IonContent, IonImg, IonModal, IonThumbnail
} from "@ionic/vue";
import { modalController } from "@ionic/vue";
import ImageViewerModal from "@/components/mediaViewers/ImageViewerModal.vue";

export default {
  name: "ImageThumbnailViewer",
  components: {
    ImageViewerModal,
    IonHeader, IonToolbar, IonModal, IonContent,
    IonThumbnail, IonButton, IonButtons, IonImg
  },
  props: {
    images: Array,
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
  <div id="thumbnail--container">
    <ion-thumbnail v-for="(image, index) in images" :key="index"
                   :image="image" @click="openModal">
      <ion-img :src="image"></ion-img>
<!--      all the modals are being opened at the same time.-->
<!--      the modal needs it's own open and close methods.-->
<!--      ImageViewerModal isn't being used so we'll convert that to have it's own open and-->
<!--      close method. All the modals are listening to the same isModalOpen var. -->
      <ion-modal :is-open="isModalOpen" can-dismiss="true">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-button @click="emitDeletePhoto(image)" >Delete</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content id="image--wrapper">
          <ion-img :src="image"/>
        </ion-content>
      </ion-modal>
    </ion-thumbnail>
  </div>

</template>

<style scoped lang="scss">
ion-modal {
  --ion-background-color: var(--ion-color-modal-dark-background);
}
#image--wrapper {
  ion-img {
    height: 100%;
    background-color: transparent;
  }
}
#thumbnail--container {
  width: 100%;
  margin-bottom: .5em;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: .5em .5em;
}
</style>
