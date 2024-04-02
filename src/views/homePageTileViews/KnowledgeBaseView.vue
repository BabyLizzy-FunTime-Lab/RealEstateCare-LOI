<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import {IonAccordionGroup} from "@ionic/vue";
import DocumentViewer from "@/components/mediaViewers/DocumentViewer.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import {useLoginStore} from "@/stores/LoginStore.js";

export default {
  name: "KnowledgeBaseView",
  components: {IonAccordionGroup, BaseListLayout, DocumentViewer},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      loginStore: useLoginStore(),
      allPdfDocuments: null
    }
  },
  mounted() {
    this.allPdfDocuments = this.loginStore.getAllBaseDocuments
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Knowledge Base">
      <ion-accordion-group :multiple="true">
        <DocumentViewer
            v-for="document of allPdfDocuments"
            :key="document.name"
            :document-info="document"
        />
      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
