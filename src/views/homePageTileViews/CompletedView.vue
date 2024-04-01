<script>
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspectionsViewer from "@/components/dataViewers/DamageInspectionsViewer.vue";
import BacklogMaintenanceViewer from "@/components/dataViewers/BacklogMaintenanceViewer.vue";
import ModificationsViewer from "@/components/dataViewers/ModificationsViewer.vue";
import TechnicalInstallationsViewer from "@/components/dataViewers/TechnicalInstallationsViewer.vue";
// import {useInspectionStore} from "@/stores/InspectionStore.js";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js"

export default {
  name: "CompletedView",
  components: {
    BaseListLayout, DamageInspectionsViewer, BacklogMaintenanceViewer, ModificationsViewer,
    TechnicalInstallationsViewer
  },
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
    },
    backlogMaintenance() {
      return this.inspectionsAll.backlogMaintenance
    },
    modifications() {
      return this.inspectionsAll.modifications
    },
    technicalInstallations() {
      return this.inspectionsAll.technicalInstallations
    }
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Completed Tasks">
      <DamageInspectionsViewer :inspections="damageInspections"/>
      <BacklogMaintenanceViewer :inspections="backlogMaintenance"/>
      <ModificationsViewer :inspections="modifications"/>
      <TechnicalInstallationsViewer :inspections="technicalInstallations"/>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
