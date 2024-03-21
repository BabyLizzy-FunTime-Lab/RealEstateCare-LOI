<script>
import {
  IonHeader, IonToolbar, IonButton, IonButtons,
  IonContent, IonModal, IonTitle, IonLabel
} from "@ionic/vue";
import VuePdfEmbed from 'vue-pdf-embed'

export default {
  name: "pdfViewerModal",
  components: {
    IonHeader, IonToolbar, IonModal, IonContent,
    IonButton, IonButtons, IonTitle, IonLabel, VuePdfEmbed
  },
  props: {
    pdfFile: null,
    pdfUrl: null,
    isOpen: Boolean,
  },
  methods: {
    emitClose() {
      this.$emit('close:modal');
    },
    async convertToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (error) => {
          reject(error);
        };
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    },
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
        <ion-title slot="start">
          <ion-label>
            <h2>Document Title: </h2>
            <p>{{pdfFile.name}}</p>
          </ion-label>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emitClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content id="image--wrapper">
<!--      <pdf src="documents/game-boy.jpg"/>-->
      <VuePdfEmbed :source="pdfUrl" />
<!--      <VuePdfEmbed :source="pdfFile" />-->
<!--      <VuePdfEmbed source="https://res.cloudinary.com/babylizzyevee/image/upload/v1710855728/CV-images/LOI-cursus/pdf/Batman_vs_Hulk_rpmacr.pdf" />-->
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">

</style>
