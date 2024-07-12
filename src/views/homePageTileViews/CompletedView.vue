<script>
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspectionsViewer from "@/components/dataViewers/DamageInspectionsViewer.vue";
import BacklogMaintenanceViewer from "@/components/dataViewers/BacklogMaintenanceViewer.vue";
import ModificationsViewer from "@/components/dataViewers/ModificationsViewer.vue";
import TechnicalInstallationsViewer from "@/components/dataViewers/TechnicalInstallationsViewer.vue";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js"
import { sync } from 'ionicons/icons';

export default {
  name: "CompletedView",
  components: {
    BaseListLayout, DamageInspectionsViewer, BacklogMaintenanceViewer, ModificationsViewer,
    TechnicalInstallationsViewer, IonFab, IonFabButton, IonIcon
  },
  setup() {
    return {sync};
  },
  data() {
    return {
      completedActionStore: useCompletedTasksStore(),
    }
  },
  methods: {
    fetchAllInspections() {
      this.completedActionStore.fetchCompletedTasks();
    }
  },
  mounted() {
    this.fetchAllInspections();
  },
  computed: {
    damageInspections() {
      return this.completedActionStore.getAllInspections.damageInspections
    },
    backlogMaintenance() {
      return this.completedActionStore.getAllInspections.backlogMaintenance
    },
    modifications() {
      return this.completedActionStore.getAllInspections.modifications
    },
    technicalInstallations() {
      return this.completedActionStore.getAllInspections.technicalInstallations
    }
  }
}
</script>

<template>
  <base-layout>
    <ion-fab slot="fixed" vertical="bottom" horizontal="center">
      <ion-fab-button color="primary">
        <ion-icon @click="this.fetchAllInspections" :icon="sync"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <base-list-layout list-header-name="Completed Tasks">
      <DamageInspectionsViewer
          :inspections="damageInspections"
          @cancel:updates="this.fetchAllInspections"
      />
      <BacklogMaintenanceViewer
          :inspections="backlogMaintenance"
          @cancel:updates="this.fetchAllInspections"
      />
      <ModificationsViewer
          :inspections="modifications"
          @cancel:updates="this.fetchAllInspections"
      />
      <TechnicalInstallationsViewer
          :inspections="technicalInstallations"
          @cancel:updates="this.fetchAllInspections"
      />
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">
ion-fab {
  margin-bottom: var(--ion-safe-area-bottom, 0);
}
</style>
