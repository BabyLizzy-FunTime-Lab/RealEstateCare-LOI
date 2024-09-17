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
    pdfName: null,
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
  computed: {
    filename() {
      if(this.pdfName) {
        return this.pdfName;
      } else if(this.pdfFile && this.pdfUrl) {
        // It takes the file name out of the pdf file object.
        return this.pdfFile.name;
      } else {
        // It takes the file name out of the URL.
        return this.pdfUrl.substring(this.pdfUrl.lastIndexOf('/') + 1);
      }
    }
  },
  emits: [
    'close:modal',
  ]
}
</script>

<template>
  <ion-modal class="pdfViewer" :is-open="isOpen" can-dismiss="true">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="pdfViewer__title" slot="start">
          <ion-label>
            <h2>Document Title: </h2>
            <p>{{filename}}</p>
          </ion-label>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emitClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content id="image--wrapper">
      <VuePdfEmbed class="pdfViewer__pdf" :source="pdfUrl"/>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">
.pdfViewer {
  --ion-background-color: var(--ion-color-modal-dark-background);
  --height: 100%;
  --width: 100vw;
  --max-width: 40em;
  .pdfViewer__title {
    max-width: 75%;
  }
  .pdfViewer__pdf {
    width: 100%;
  }
}
</style>
