<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BacklogMaintenance from "@/components/dataDisplayInputs/BacklogMaintenance.vue";

export default {
  name: "BacklogMaintenanceViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, BacklogMaintenance},
  props: {
    inspections: null
  }
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout header-name="Backlog Maintenance" color-style="secondary">
      <ion-accordion-group slot="content">
        <BacklogMaintenance
            v-for="inspection of inspections" :key="inspection.id"
            :header-name="inspection.location"
            :location="inspection.location"
            :emergency="inspection.emergency"
            :type="inspection.maintenanceType"
            :cost-indication="inspection.costIndication"
            :images="inspection.images"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped>

</style>
