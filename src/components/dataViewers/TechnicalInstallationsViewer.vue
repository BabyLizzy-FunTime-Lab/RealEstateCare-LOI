<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import TechnicalInstallationInspection from "@/components/dataDisplayInputs/TechnicalInstallationInspection.vue";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js";
import BacklogMaintenance from "@/components/dataDisplayInputs/BacklogMaintenance.vue";

export default {
  name: "TechnicalInstallationsViewer",
  components: {BacklogMaintenance, IonAccordionGroup, BaseAccordionLayout, TechnicalInstallationInspection},
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
    },
    pushChangesToDb(inspectionId) {
      // This triggers a push of the data object with the inspection id.
      this.completedActionStore.pushUpdatedData(inspectionId, "technicalInstallations");
    }
  },
  emits: [
    'cancel:updates'
  ]
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Technical Installations" color-style="secondary">
      <ion-accordion-group slot="content">
        <TechnicalInstallationInspection
            v-for="inspection of inspections" :key="inspection.id"
            :read-only-prop="true"
            :inspection-id="inspection.id"
            :header-name="inspection.location"
            :location="inspection.location"
            @update:location=
                "updateInspectionData(
                  'technicalInstallations',
                   inspection.id,
                  'location',
                   $event.target.value)"
            :installation-type="inspection.installationType"
            @update:installation-type=
                "updateInspectionData(
                  'technicalInstallations',
                   inspection.id,
                  'installationType',
                   $event.target.value)"
            :client-statement="inspection.clientStatement"
            @update:client-statement=
                "updateInspectionData(
                  'technicalInstallations',
                   inspection.id,
                  'clientStatement',
                   $event.target.value)"
            :approved="inspection.approved"
            @update:approved=
                "updateInspectionData(
                  'technicalInstallations',
                   inspection.id,
                  'approved',
                   $event.target.value)"
            :comments="inspection.comments"
            @update:comments=
                "updateInspectionData(
                  'technicalInstallations',
                   inspection.id,
                  'comments',
                   $event.target.value)"
            :images="inspection.images"
            @update:images=
                "updateInspectionData(
                    'technicalInstallations',
                    inspection.id,
                    'images',
                    $event.webviewPath)"
            @delete:image=
                "updateInspectionData(
                    'technicalInstallations',
                    inspection.id,
                    'delete:image',
                    $event)"
            @cancel:updates="this.$emit('cancel:updates')"
            @save:data-updates="pushChangesToDb(inspection.id)"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped>

</style>
