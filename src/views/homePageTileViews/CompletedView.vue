<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import {IonAccordionGroup} from "@ionic/vue";
import CompletedTasksViewer from "@/components/dataViewers/CompletedTasksViewer.vue";
// import {useInspectionStore} from "@/stores/InspectionStore.js";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js"

export default {
  name: "CompletedView",
  components: {IonAccordionGroup, BaseListLayout, CompletedTasksViewer},
  data() {
    return {
      completedActionStore: useCompletedTasksStore(),
      inspectionsAll: Object,
    }
  },
  mounted() {
    this.completedActionStore.fetchCompletedTasks().then(inspections => {
      this.inspectionsAll = inspections;
    });
  },
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Completed Tasks">
      <base-list-layout
          v-for="(inspectionsOfType, type) of inspectionsAll"
          :key="type" :list-header-name="type" style-color="secondary" :back-button="false" :multiple="true">
        <CompletedTasksViewer :type="type" :inspections-of-type="inspectionsOfType"/>
      </base-list-layout>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
