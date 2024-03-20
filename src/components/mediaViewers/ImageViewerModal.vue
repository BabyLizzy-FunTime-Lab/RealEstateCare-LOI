<script>
import {
  IonHeader, IonToolbar, IonButton, IonButtons,
  IonContent, IonImg, IonModal, IonTitle,
} from "@ionic/vue";

export default {
  name: "ImageViewerModal",
  components: {
    IonHeader, IonToolbar, IonModal, IonContent,
    IonButton, IonButtons, IonImg, IonTitle
  },
  props: {
    documentName: String,
    image: String,
    isOpen: Boolean
  },
  methods: {
    emitClose() {
      this.$emit('close:modal');
    }
  },
  emits: [
    'close:modal',
  ]
}
</script>

<template>
  <ion-modal :is-open="isOpen" can-dismiss="true">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title slot="start">{{documentName}}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emitClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content id="image--wrapper">
      <ion-img :src="image"/>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">

</style>
