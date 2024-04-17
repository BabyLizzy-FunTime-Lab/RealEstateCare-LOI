<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import TechnicalInstallationInspection from "@/components/dataDisplayInputs/TechnicalInstallationInspection.vue";

export default {
  name: "TechnicalInstallationsViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, TechnicalInstallationInspection},
  props: {
    inspections: null
  }
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Technical Installations" color-style="secondary">
      <ion-accordion-group slot="content">
        <TechnicalInstallationInspection
            v-for="inspection of inspections" :key="inspection.id"
            :header-name="inspection.location"
            :location="inspection.location"
            :installation-type="inspection.installationType"
            :client-statement="inspection.clientStatement"
            :approved="inspection.approved"
            :comments="inspection.comments"
            :images="inspection.images"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped>

</style>
