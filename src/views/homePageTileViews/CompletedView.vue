<script>
import {IonAccordionGroup} from "@ionic/vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import BaseListLayout from "@/components/base/BaseListLayout.vue";

export default {
  name: "CompletedView",
  components: {IonAccordionGroup, BaseListLayout},
  data() {
    return {
      inspectionStore: useInspectionStore()
    }
  },
  mounted() {
    this.inspectionStore.fetchInspections();
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Completed Tasks">
      <ion-accordion-group :multiple="true">

      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
