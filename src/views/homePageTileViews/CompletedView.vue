<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import {IonAccordionGroup} from "@ionic/vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";

export default {
  name: "CompletedView",
  components: {IonAccordionGroup, BaseListLayout},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      inspectionsAll: Object,
    }
  },
  mounted() {
    this.inspectionStore.fetchInspections().then(inspections => {
      this.inspectionsAll = inspections;
    });
  },
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Completed Tasks">
      <ion-accordion-group v-for="(inspectionOfType, type) of inspectionsAll" :key="type" :multiple="true">
        <div>{{type}}</div>
        {{inspectionOfType[0].id}}
      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
