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
      completedActionStore: useCompletedTasksStore(),
      readOnly: true
    }
  },
  methods: {
    dateFilter(date) {
      return date.split('T')[0];
    },
    updateInspectionData(inspectionId, propertyName, newValue, inspectionType = null ) {
      this.completedActionStore.updateInspectionData(inspectionId, propertyName, newValue, inspectionType);
    },
    reset(infoType) {
      this.completedActionStore.resetViewData(this.inspection.id, infoType);
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
    },
  }
}
</script>

<template>
  <ion-accordion-group>
    <base-accordion-layout :header-name="dateFilter(inspection.date)" color-style="secondary">
      <ion-accordion-group slot="content">
        <BasicInformation
            :use-as-data-viewer="true"
            :inspection-id="inspection.id"
            :address="inspection.address"
            @update:address="this.updateInspectionData(inspection.id, 'address', $event)"
            :date="dateFilter(inspection.date)"
            @update:date="this.updateInspectionData(inspection.id, 'date', $event)"
            @update:read-only-toggle="readOnlyToggle"
            @cancel:all-updates="readOnlyToggle"
            @reset:basic-information="reset('basic_information')"
        />
        <DamageInspection
            :use-as-data-viewer="true"
            :read-only-trigger="readOnly"
            :location="inspection.damage_inspection.location"
            @update:location="this.updateInspectionData(
                inspection.id, 'location', $event, 'damage_inspection')"
            :new-damage="inspection.damage_inspection.newDamage"
            @update:new-damage="this.updateInspectionData(
                inspection.id, 'newDamage', $event, 'damage_inspection')"
            :selected-damage-type-option="inspection.damage_inspection.selectedDamageTypeOption"
            @update:selected-damage-type-option="this.updateInspectionData(
                inspection.id, 'selectedDamageTypeOption', $event, 'damage_inspection')"
            :damage-type="inspection.damage_inspection.damageType"
            @update:damage-type="this.updateInspectionData(
                inspection.id, 'damageType', $event, 'damage_inspection')"
            :emergency="inspection.damage_inspection.emergency"
            @update:emergency="this.updateInspectionData(
                inspection.id, 'emergency', $event, 'damage_inspection')"
            :comments="inspection.damage_inspection.comments"
            @update:comments="this.updateInspectionData(
                inspection.id, 'comments', $event, 'damage_inspection')"
            :images="inspection.damage_inspection.images"
            @update:images="this.updateInspectionData(
                inspection.id, 'images', $event, 'damage_inspection')"
            @reset:damage-inspection="reset('damage_inspection')"
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
