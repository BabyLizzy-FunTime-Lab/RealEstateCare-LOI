<script>
import {IonAccordionGroup} from "@ionic/vue";
import baseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspection from "@/components/scheduledView/DamageInspection.vue";
import BacklogMaintenance from "@/components/scheduledView/BacklogMaintenance.vue";
import TechnicalInstallationInspection from "@/components/scheduledView/TechnicalInstallationInspection.vue";
import Modifications from "@/components/scheduledView/Modifications.vue";
export default {
  name: "ScheduledView",
  components: {baseListLayout, IonAccordionGroup, DamageInspection,
    BacklogMaintenance, TechnicalInstallationInspection, Modifications}
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
