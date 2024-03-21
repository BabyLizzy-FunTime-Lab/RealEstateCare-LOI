<script>
import {
  IonHeader, IonToolbar, IonButton, IonButtons,
  IonContent, IonModal, IonTitle, IonLabel
} from "@ionic/vue";

export default {
  name: "pdfViewerModal",
  components: {
    IonHeader, IonToolbar, IonModal, IonContent,
    IonButton, IonButtons, IonTitle, IonLabel
  },
  props: {
    document: null,
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
        <ion-title slot="start">
          <ion-label>
            <h2>Document Title: </h2>
            <p>{{document.name}}</p>
          </ion-label>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emitClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content id="image--wrapper">
      PDF here
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="scss">

</style>
