<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import ModificationInspection from "@/components/dataDisplayInputs/ModificationInspection.vue";

export default {
  name: "ModificationsViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, ModificationInspection},
  props: {
    inspections: null
  }
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Modification Inspections" color-style="secondary">
      <ion-accordion-group slot="content">
        <ModificationInspection
            v-for="inspection of inspections" :key="inspection.id"
            :inspection-id="inspection.id"
            :read-only-prop="true"
            :header-name="inspection.location"
            :location="inspection.location"
            :documented-mods-url="inspection.documentedModsUrl"
            :modified-by="inspection.modifiedBy"
            :mod-description="inspection.modDescription"
            :required-action="inspection.requiredAction"
            :comments="inspection.comments"
            :images="inspection.images"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped>

</style>
