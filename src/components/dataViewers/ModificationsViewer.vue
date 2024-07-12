<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import ModificationInspection from "@/components/dataDisplayInputs/ModificationInspection.vue";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js";
import BacklogMaintenance from "@/components/dataDisplayInputs/BacklogMaintenance.vue";

export default {
  name: "ModificationsViewer",
  components: {BacklogMaintenance, IonAccordionGroup, BaseAccordionLayout, ModificationInspection},
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
      this.completedActionStore.pushUpdatedData(inspectionId, "modifications");
    }
  },
  emits: [
    'cancel:updates'
  ]
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Modification Inspections" color-style="secondary">
      <ion-accordion-group slot="content">
        <ModificationInspection
            v-for="inspection of inspections"
            :key="inspection.id"
            :inspection-id="inspection.id"
            :read-only-prop="true"
            :header-name="inspection.location"
            :location="inspection.location"
            @update:location=
                "updateInspectionData(
                  'modifications',
                   inspection.id,
                  'location',
                   $event.target.value)"
            :documented-mods-doc-name="inspection.documentedModsDocName"
            :documented-mods-url="inspection.documentedModsUrl"
            @update:documented-mods=
                "updateInspectionData(
                    'modifications',
                    inspection.id,
                    'documentedModsFile',
                    $event)"
            :modified-by="inspection.modifiedBy"
            @update:modified-by=
                "updateInspectionData(
                  'modifications',
                   inspection.id,
                  'modifiedBy',
                   $event.target.value)"
            :mod-description="inspection.modDescription"
            @update:mod-description=
                "updateInspectionData(
                  'modifications',
                   inspection.id,
                  'modDescription',
                   $event.target.value)"
            :required-action="inspection.requiredAction"
            @update:required-action=
                "updateInspectionData(
                  'modifications',
                   inspection.id,
                  'requiredAction',
                   $event.target.value)"
            :comments="inspection.comments"
            @update:comments=
                "updateInspectionData(
                  'modifications',
                   inspection.id,
                  'comments',
                   $event.target.value)"
            :images="inspection.images"
            @update:images=
                "updateInspectionData(
                    'modifications',
                    inspection.id,
                    'images',
                    $event.webviewPath)"
            @delete:image=
                "updateInspectionData(
                    'modifications',
                    inspection.id,
                    'delete:image',
                    $event)"
            @save:data-updates="pushChangesToDb(inspection.id)"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped>

</style>
