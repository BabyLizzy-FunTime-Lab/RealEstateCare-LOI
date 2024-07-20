<script>
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import InspectionViewer from "@/components/dataViewers/InspectionViewer.vue";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js"
import { sync } from 'ionicons/icons';

export default {
  name: "CompletedView",
  components: {
    BaseListLayout, IonFab, IonFabButton, IonIcon, InspectionViewer
  },
  setup() {
    return {sync};
  },
  data() {
    return {
      completedActionStore: useCompletedTasksStore()
    }
  },
  methods: {
    fetchAllInspections() {
      this.completedActionStore.fetchAllCompletedTasks();
    },
  },
  mounted() {
    this.fetchAllInspections();
  },
  computed: {
    inspections() {
      return this.completedActionStore.getAllInspections;
    }
  }
}
</script>

<template>
  <base-layout>
    <ion-fab slot="fixed" vertical="top" horizontal="center">
      <ion-fab-button class="custom-fab-button" color="primary" size="small">
        <ion-icon @click="this.fetchAllInspections" :icon="sync"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <div class="reload--container"></div>
    <base-list-layout list-header-name="Completed Tasks">
      <InspectionViewer
          v-for="inspection of inspections"
          :key="inspection.id"
          :inspection="inspection"
      />
<!--      <DamageInspectionsViewer-->
<!--          :inspections="damageInspections"-->
<!--          @cancel:updates="this.fetchAllInspections"-->
<!--      />-->
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">
.reload--container {
  height: 4em;
}
ion-fab-button {
  --border-radius: 20px;
}
</style>
