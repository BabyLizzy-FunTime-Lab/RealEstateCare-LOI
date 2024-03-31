<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspectionsViewer from "@/components/dataViewers/DamageInspectionsViewer.vue";
// import {useInspectionStore} from "@/stores/InspectionStore.js";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js"

export default {
  name: "CompletedView",
  components: {BaseListLayout, DamageInspectionsViewer},
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
  computed: {
    damageInspections() {
      return this.inspectionsAll.damageInspections
    }
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Completed Tasks">
        <DamageInspectionsViewer :inspections="damageInspections"/>
      {{inspectionsAll}}
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
