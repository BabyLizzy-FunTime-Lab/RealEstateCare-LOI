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
      readOnly: true,
      pushSuccess: false,
    }
  },
  methods: {
    dateFilter(date) {
      return date.split('T')[0];
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
    },
    updateInspectionData(inspectionId, propertyName, newValue, inspectionType = null ) {
      this.completedActionStore.updateInspectionData(inspectionId, propertyName, newValue, inspectionType);
    },
    reset(infoType) {
      switch(infoType) {
        case 'all_data':
          this.readOnlyToggle();
          this.completedActionStore.resetViewData(this.inspection.id, infoType);
          break;
        default:
          this.completedActionStore.resetViewData(this.inspection.id, infoType);
      }
    },
    pushUpdatedData() {
      this.completedActionStore.pushUpdatedData(this.inspection.id).then(result => {
        if(result === "success") {
          console.log("derp");
          this.readOnlyToggle();
          this.pushSuccess = true;
          this.completedActionStore.fetchAllCompletedTasks();
        }
      })
    },
    resetPushSuccess() {
      this.pushSuccess = false;
    }
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
            @cancel:all-updates="reset('all_data')"
            @reset:basic-information="reset('basic_information')"
            :push-success="pushSuccess"
            @reset:push-success="resetPushSuccess"
            @push:all-updates="pushUpdatedData"
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
            @delete:image="this.updateInspectionData(
                inspection.id, 'delete:image', $event, 'damage_inspection')"
            @reset:damage-inspection="reset('damage_inspection')"
        />
        <BacklogMaintenance
            :use-as-data-viewer="true"
            :read-only-trigger="readOnly"
            :location="inspection.backlog_maintenance.location"
            @update:location="this.updateInspectionData(
                inspection.id, 'location', $event, 'backlog_maintenance')"
            :emergency="inspection.backlog_maintenance.emergency"
            @update:emergency="this.updateInspectionData(
                inspection.id, 'emergency', $event, 'backlog_maintenance')"
            :maintenance-type="inspection.backlog_maintenance.maintenanceType"
            @update:maintenance-type="this.updateInspectionData(
                inspection.id, 'maintenanceType', $event, 'backlog_maintenance')"
            :cost-indication="inspection.backlog_maintenance.costIndication"
            @update:cost-indication="this.updateInspectionData(
                inspection.id, 'costIndication', $event, 'backlog_maintenance')"
            :images="inspection.backlog_maintenance.images"
            @update:images="this.updateInspectionData(
                inspection.id, 'images', $event, 'backlog_maintenance')"
            @delete:image="this.updateInspectionData(
                inspection.id, 'delete:image', $event, 'backlog_maintenance')"
            @reset:backlog-maintenance="reset('backlog_maintenance')"
        />
        <TechnicalInstallation
            :use-as-data-viewer="true"
            :read-only-trigger="readOnly"
            :location="inspection.technical_installation_inspection.location"
            @update:location="this.updateInspectionData(
                inspection.id, 'location',
                $event, 'technical_installation_inspection')"
            :installation-type="inspection.technical_installation_inspection.installationType"
            @update:installation-type="this.updateInspectionData(
                inspection.id, 'installationType',
                $event, 'technical_installation_inspection')"
            :client-statement="inspection.technical_installation_inspection.clientStatement"
            @update:client-statement="this.updateInspectionData(
                inspection.id, 'clientStatement',
                $event, 'technical_installation_inspection')"
            :approved="inspection.technical_installation_inspection.approved"
            @update:approved="this.updateInspectionData(
                inspection.id, 'approved',
                $event, 'technical_installation_inspection')"
            :comments="inspection.technical_installation_inspection.comments"
            @update:comments="this.updateInspectionData(
                inspection.id, 'comments',
                $event, 'technical_installation_inspection')"
            :images="inspection.technical_installation_inspection.images"
            @update:images="this.updateInspectionData(
                inspection.id, 'images', $event, 'technical_installation_inspection')"
            @delete:image="this.updateInspectionData(
                inspection.id, 'delete:image', $event, 'technical_installation_inspection')"
            @reset:technical-installation-inspection="reset('technical_installation_inspection')"
        />
        <Modification
            :use-as-data-viewer="true"
            :read-only-trigger="readOnly"
            :location="inspection.modifications.location"
            @update:location="this.updateInspectionData(
                inspection.id, 'location',
                $event, 'modifications')"
            :documented-mods-doc-name="inspection.modifications.documentedModsDocName"
            :documented-mods-url="inspection.modifications.documentedModsUrl"
            @update:documented-mods="this.updateInspectionData(
                inspection.id, 'documentedModsFile',
                $event, 'modifications')"
            :modified-by="inspection.modifications.modifiedBy"
            @update:modified-by="this.updateInspectionData(
                inspection.id, 'modifiedBy',
                $event, 'modifications')"
            :mod-description="inspection.modifications.modDescription"
            @update:mod-description="this.updateInspectionData(
                inspection.id, 'modDescription',
                $event, 'modifications')"
            :required-action="inspection.modifications.requiredAction"
            @update:required-action="this.updateInspectionData(
                inspection.id, 'requiredAction',
                $event, 'modifications')"
            :comments="inspection.modifications.comments"
            @update:comments="this.updateInspectionData(
                inspection.id, 'comments',
                $event, 'modifications')"
            :images="inspection.modifications.images"
            @update:images="this.updateInspectionData(
                inspection.id, 'images',
                $event, 'modifications')"
            @delete:image="this.updateInspectionData(
                inspection.id, 'delete:image',
                $event, 'modifications')"
            @reset:modifications="reset('modifications')"
        />
      </ion-accordion-group>
    </base-accordion-layout>
  </ion-accordion-group>
</template>

<style scoped lang="scss">

</style>
