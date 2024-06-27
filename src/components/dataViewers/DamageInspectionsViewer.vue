<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import DamageInspection from "@/components/dataDisplayInputs/DamageInspection.vue";

export default {
  name: "DamageInspectionsViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, DamageInspection},
  props: {
    inspections: null
  },
  methods: {
    updateInspectionData(property, newValue) {
      // Change the values of the inspections object.
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
  }
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
            :new-damage="inspection.newDamage"
            :date="inspection.date"
            :selected-damage-type-option="inspection.selectedDamageTypeOption"
            :damage-type="inspection.damageType"
            :emergency="inspection.emergency"
            :comments="inspection.comments"
            :images="inspection.images"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped lang="scss">

</style>
