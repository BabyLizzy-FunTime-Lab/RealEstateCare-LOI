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
      // This calls for a state update with the new value.
      console.log(inspectionId);
      console.log(newValue);
      this.completedActionStore.updateInspectionData(inspectionType, inspectionId, propertyName, newValue)
    },
    pushChangesToDb(inspectionId) {
      // This triggers a push of the data object with the inspection id.
      this.completedActionStore.pushUpdatedData(inspectionId, "damageInspections");
    }
  },
  watch: {
    inspections(data) {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log(data);
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
            v-for="inspection of inspections"
            :key="inspection.id"
            :read-only-prop="true"
            :inspection-id="inspection.id"
            :header-name="inspection.date"
            :location="inspection.location"
            @update:location="updateInspectionData(
                'damageInspections',
                inspection.id,
                'location',
                $event.target.value)"
            :new-damage="inspection.newDamage"
            @update:new-damage=
                "updateInspectionData(
                    'damageInspections',
                    inspection.id,
                    'newDamage',
                    $event.target.value)"

            :date="inspection.date"
            @update:date=
                "updateInspectionData(
                    'damageInspections', inspection.id,
                    'date',
                    $event)"
            :selected-damage-type-option="inspection.selectedDamageTypeOption"
            @update:selected-damage-type-option=
                "updateInspectionData(
                    'damageInspections',
                    inspection.id,
                    'selectedDamageTypeOption',
                    $event.target.value)"
            :damage-type="inspection.damageType"
            @update:damage-type=
                "updateInspectionData(
                    'damageInspections',
                    inspection.id,
                    'damageType',
                    $event.target.value)"
            :emergency="inspection.emergency"
            @update:emergency=
                "updateInspectionData(
                    'damageInspections',
                    inspection.id,
                    'emergency',
                    $event.target.value)"
            :comments="inspection.comments"
            @update:comments=
                "updateInspectionData(
                    'damageInspections',
                    inspection.id,
                    'comments',
                    $event.target.value)"
            :images="inspection.images"
            @update:images="updateInspectionData(
                    'damageInspections',
                    inspection.id,
                    'images',
                    $event.webviewPath)"
            @delete:image="updateInspectionData(
                    'damageInspections',
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

<style scoped lang="scss">

</style>
