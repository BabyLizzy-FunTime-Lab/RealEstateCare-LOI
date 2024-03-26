<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import {IonAccordionGroup} from "@ionic/vue";
import DocumentViewer from "@/components/mediaViewers/DocumentViewer.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";


export default {
  name: "KnowledgeBaseView",
  components: {IonAccordionGroup, BaseListLayout, DocumentViewer},
  data() {
    return {
      inspectionStore: useInspectionStore(),
    }
  },
  computed: {
    documents() {
      return this.inspectionStore.getKnowledgeBase;
    }
  },
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Knowledge Base">
      <ion-accordion-group :multiple="true">
        <DocumentViewer
            v-for="document of documents"
            :key="document.name"
            :document-info="document"
        />
      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
