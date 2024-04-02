<script>
import PdfViewerModal from "@/components/mediaViewers/PdfViewerModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import {IonLabel, IonItem} from "@ionic/vue";

export default {
  name: "DocumentViewer",
  components: {BaseButton, PdfViewerModal, IonLabel, IonItem},
  props: {
    documentInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      openModal: false
    }
  },
  methods: {
    toggleOpen() {
      this.openModal = !this.openModal;
    }
  },
  computed: {
    documentName() {
      return this.documentInfo.name;
    },
    documentUrl() {
      return this.documentInfo.url;
    }
  }
}
</script>

<template>
  <ion-item>
    <ion-label>{{documentName}}</ion-label>
    <BaseButton name="View" @click="toggleOpen" />
    <pdf-viewer-modal
        :pdf-name="documentName"
        :pdf-url="documentUrl"
        :is-open="openModal"
        @close:modal="toggleOpen"
    />
  </ion-item>
</template>

<style scoped lang="scss">

</style>
