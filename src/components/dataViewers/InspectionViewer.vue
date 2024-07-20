<script>
import BasicInformation
  from "@/components/dataDisplayInputs/InspectionComponentBasicInformation.vue";
import DamageInspection from "@/components/dataDisplayInputs/InspectionComponentDamage.vue";
import BacklogMaintenance
  from "@/components/dataDisplayInputs/InspectionComponentBacklogMaintenance.vue";
import Modification from "@/components/dataDisplayInputs/InspectionComponentModification.vue";
import TechnicalInstallation
  from "@/components/dataDisplayInputs/InspectionComponentTechnicalInstallation.vue";
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";

export default {
  name: "InspectionViewer",
  components: {
    BasicInformation, DamageInspection, BacklogMaintenance, TechnicalInstallation,
    Modification, IonAccordionGroup, BaseAccordionLayout
  },
  props: {
    inspection: Object
  },
  computed: {

  },
  methods: {
    dateFilter(date) {
      return date.split('T')[0];
    },
  }
}
</script>

<template>
  <base-accordion-layout :header-name="dateFilter(inspection.date)" color-style="secondary">
    <ion-accordion-group slot="content">
      <BasicInformation
          :id="inspection.id"
          :address="inspection.address"
          :date="dateFilter(inspection.date)"
      />

    </ion-accordion-group>
  </base-accordion-layout>

</template>

<style scoped lang="scss">

</style>
