<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import DamageInspection from "@/components/dataDisplayInputs/DamageInspection.vue";
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js";

export default {
  name: "DamageInspectionsViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, DamageInspection},
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
      // Change the values of the inspections object.
      this.completedActionStore.updateInspectionData(inspectionType, inspectionId, propertyName, newValue)
      // this.inspections.forEach(inspection => {
      //   if(inspection.id === inspectionId) {
      //     inspection[propertyName] = newValue;
      //   }
      // })
    },
    updateInspectionImageArray(oldData, newImageArray) {
      // Replace the old Array with the new one.
    },
    cancelChanges(inspectionType) {
      // Call the fetch function for an inspection type.
    },
    pushChangesToDb(dataObjectArray, inspectionId) {
      // This could replace all data of inspection id with the new data.
    }
  },
  emits: [
    'cancel:updates'
  ]
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Damage Inspections" color-style="secondary">
      <ion-accordion-group slot="content">
        <DamageInspection
            v-for="inspection of inspections" :key="inspection.id"
            :read-only-prop="true"
            :inspection-id="inspection.id"
            :header-name="inspection.location"
            :location="inspection.location"
            @update:location=
                "updateInspectionData(
                    'damageInspections', inspection.id,
                    'location', $event.target.value)"
            :new-damage="inspection.newDamage"
            @update:new-damage=
                "updateInspectionData(
                    'damageInspections', inspection.id,
                    'newDamage', $event.target.value)"
            :date="inspection.date"
            @update:date=
                "updateInspectionData(
                    'damageInspections',inspection.id,
                    'date', $event.target.value)"
            :selected-damage-type-option="inspection.selectedDamageTypeOption"
            @update:selected-damage-type-option=
                "updateInspectionData(
                    'damageInspections', inspection.id,
                    'selectedDamageTypeOption', $event.target.value)"
            :damage-type="inspection.damageType"
            @update:damage-type=
                "updateInspectionData(
                    'damageInspections',inspection.id,
                    'damageType', $event.target.value)"
            :emergency="inspection.emergency"
            @update:emergency=
                "updateInspectionData(
                    'damageInspections',inspection.id,
                    'emergency', $event.target.value)"
            :comments="inspection.comments"
            @update:comments=
                "updateInspectionData(
                    'damageInspections',inspection.id,
                    'comments', $event.target.value)"
            :images="inspection.images"
            @cancel:updates="this.$emit('cancel:updates')"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped lang="scss">

</style>
