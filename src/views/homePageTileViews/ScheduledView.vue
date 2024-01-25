<script>
import {IonAccordionGroup} from "@ionic/vue";
import baseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspection from "@/components/scheduledView/DamageInspection.vue";
import BacklogMaintenance from "@/components/scheduledView/BacklogMaintenance.vue";
import TechnicalInstallationInspection from "@/components/scheduledView/TechnicalInstallationInspection.vue";
import Modifications from "@/components/scheduledView/Modifications.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";

export default {
  name: "ScheduledView",
  components: {baseListLayout, IonAccordionGroup, DamageInspection,
    BacklogMaintenance, TechnicalInstallationInspection, Modifications},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      inspectionInputData: {
        id: "",
        inspectorId: "",
        location: "",
        new_damage: "",
        complete_date: new Date().toISOString(),
        selected_damage_category: "",
        damage_category: "",
        emergency: "",
        description: "",
        images: []
      }
    }
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Scheduled Tasks">
      <ion-accordion-group :multiple="true">
        <DamageInspection/>
        <BacklogMaintenance/>
        <TechnicalInstallationInspection/>
        <Modifications/>
      </ion-accordion-group>
    </base-list-layout>

    <p>Each form should have a unique id, the client location, send date and the inspector id.</p>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
