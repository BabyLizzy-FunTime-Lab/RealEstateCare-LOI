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
import {useCompletedTasksStore} from "@/stores/CompletedTasksStore.js"

export default {
  name: "InspectionViewer",
  components: {
    BasicInformation, DamageInspection, BacklogMaintenance, TechnicalInstallation,
    Modification, IonAccordionGroup, BaseAccordionLayout
  },
  props: {
    inspection: Object
  },
  data() {
    return {
      completedActionStore: useCompletedTasksStore()
    }
  },
  methods: {
    dateFilter(date) {
      return date.split('T')[0];
    },
    updateInspectionData(inspectionId, propertyName, newValue, inspectionType = null ) {
      console.log(newValue);
      this.completedActionStore.updateInspectionDatainspectionId(inspectionId, propertyName, newValue, inspectionType);
    }
  }
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout :header-name="dateFilter(inspection.date)" color-style="secondary">
      <ion-accordion-group slot="content">
        <BasicInformation
            :read-only-prop="true"
            :inspection-id="inspection.id"
            @update:date="updateInspectionData(inspection.id, 'date', $event)"
            :address="inspection.address"
            :date="dateFilter(inspection.date)"
        />
        <DamageInspection
            :read-only-prop="true"
            :location="inspection.damage_inspection.location"
            :new-damage="inspection.damage_inspection.newDamage"
            :selected-damage-type-option="inspection.damage_inspection.selectedDamageTypeOption"
            :damage-type="inspection.damage_inspection.damageType"
            :emergency="inspection.damage_inspection.emergency"
            :comments="inspection.damage_inspection.comments"
            :images="inspection.damage_inspection.images"
        />
        <BacklogMaintenance
            :read-only-prop="true"
            :location="inspection.backlog_maintenance.location"
            :emergency="inspection.backlog_maintenance.emergency"
            :maintenance-type="inspection.backlog_maintenance.maintenanceType"
            :cost-indication="inspection.backlog_maintenance.costIndication"
            :images="inspection.backlog_maintenance.images"
        />
        <TechnicalInstallation
            :read-only-prop="true"
            :location="inspection.technical_installation_inspection.location"
            :installation-type="inspection.technical_installation_inspection.installationType"
            :client-statement="inspection.technical_installation_inspection.clientStatement"
            :approved="inspection.technical_installation_inspection.approved"
            :comments="inspection.technical_installation_inspection.comments"
            :images="inspection.technical_installation_inspection.images"
        />
        <Modification
            :read-only-prop="true"
            :location="inspection.modifications.location"
            :documented-mods-doc-name="inspection.modifications.documentedModsDocName"
            :documented-mods-url="inspection.modifications.documentedModsUrl"
            :modified-by="inspection.modifications.modifiedBy"
            :mod-description="inspection.modifications.modDescription"
            :required-action="inspection.modifications.requiredAction"
            :comments="inspection.modifications.comments"
            :images="inspection.modifications.images"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped lang="scss">

</style>
