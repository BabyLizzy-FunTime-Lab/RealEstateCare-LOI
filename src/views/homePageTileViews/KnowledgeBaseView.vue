<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import {IonAccordionGroup} from "@ionic/vue";

export default {
  name: "KnowledgeBaseView",
  components: {IonAccordionGroup, BaseListLayout}
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Knowledge Base">
      <ion-accordion-group :multiple="true">

      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
