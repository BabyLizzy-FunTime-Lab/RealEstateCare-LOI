<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BacklogMaintenance from "@/components/dataDisplayInputs/InspectionComponentBacklogMaintenance.vue";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js";

export default {
  name: "BacklogMaintenanceViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, BacklogMaintenance},
  data() {
    return {
      completedActionStore: useCompletedTasksStore(),
    }
  },
  props: {
    inspections: null
  },
  methods: {
    updateInspectionData(inspectionType, inspectionId, propertyName, newValue) {
      // This calls for a state update with the new value.
      this.completedActionStore.updateInspectionData(inspectionType, inspectionId, propertyName, newValue)
    }
  },
  emits: [
    'cancel:updates'
  ]
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Backlog Maintenance" color-style="secondary">
      <ion-accordion-group slot="content">
        <BacklogMaintenance
            v-for="inspection of inspections"
            :key="inspection.id"
            :read-only-prop="true"
            :inspection-id="inspection.id"
            :header-name="inspection.location"
            :location="inspection.location"
            @update:location=
                "updateInspectionData(
                  'backlogMaintenance',
                   inspection.id,
                  'location',
                   $event.target.value)"
            :emergency="inspection.emergency"
            @update:emergency=
                "updateInspectionData(
                    'backlogMaintenance',
                    inspection.id,
                    'emergency',
                    $event.target.value)"
            :maintenance-type="inspection.maintenanceType"
            @update:maintenance-type=
                "updateInspectionData(
                    'backlogMaintenance',
                    inspection.id,
                    'maintenanceType',
                    $event.target.value)"
            :cost-indication="inspection.costIndication"
            @update:cost-indication=
                "updateInspectionData(
                    'backlogMaintenance',
                    inspection.id,
                    'maintenanceType',
                    $event.target.value)"
            :images="inspection.images"
            @update:images=
                "updateInspectionData(
                    'backlogMaintenance',
                    inspection.id,
                    'images',
                    $event.webviewPath)"
            @delete:image=
                "updateInspectionData(
                    'backlogMaintenance',
                    inspection.id,
                    'delete:image',
                    $event)"
            @cancel:updates="this.$emit('cancel:updates')"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped>

</style>
