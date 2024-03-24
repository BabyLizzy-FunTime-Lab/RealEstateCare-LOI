<script>
import {IonAccordionGroup} from "@ionic/vue";
import baseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspection from "@/components/dataDisplayInputs/DamageInspection.vue";
import BacklogMaintenance from "@/components/dataDisplayInputs/BacklogMaintenance.vue";
import TechnicalInstallationInspection from "@/components/dataDisplayInputs/TechnicalInstallationInspection.vue";
import ModificationInspection from "@/components/dataDisplayInputs/ModificationInspection.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";

export default {
  name: "ScheduledView",
  components: {baseListLayout, IonAccordionGroup, DamageInspection,
    BacklogMaintenance, TechnicalInstallationInspection, ModificationInspection},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      damageInspectionData: Object,
      backlogMaintenanceData: Object,
      technicalInstallationData: Object,
      modificationsData: Object
    }
  },
  mounted() {
    this.damageInspectionData = this.inspectionStore.getDamageInspectionViewData;
    this.backlogMaintenanceData = this.inspectionStore.getBacklogMaintenanceViewData;
    this.technicalInstallationData = this.inspectionStore.getTechnicalInstallationViewData;
    this.modificationsData = this.inspectionStore.getModificationsViewData;
  },
  methods: {
    saveDataRequest() {
      console.log("Requesting Damage Inspection data push...");
      this.inspectionStore.pushdamageInspectionViewData();
    },
    updateDamageInspectionViewData($event, inputName) {
      console.log("Requesting update of " + inputName + " in staging state.");
      this.inspectionStore.updateDamageInspectionViewData($event, inputName);
      console.log("Requesting finished");
    },
    updateBacklogMaintenanceViewData($event, inputName) {
      console.log("Requesting update of " + inputName + " in staging state.");
      this.inspectionStore.updateBacklogMaintenanceViewData($event, inputName);
      console.log("Requesting finished");
    },
    updateTechnicalInstallationViewData($event, inputName) {
      console.log("Requesting update of " + inputName + " in staging state.");
      this.inspectionStore.updateTechnicalInstallationViewData($event, inputName);
      console.log("Requesting finished");
    },
    updateModificationsViewData($event, inputName) {
      console.log("Requesting update of " + inputName + " in staging state.");
      this.inspectionStore.updateModificationsViewData($event, inputName);
      // Not sure if this is correct. I'm calling the updateView function in the store
      // instead of here. Am I being too redundant here?
      // this.inspectionStore.updateInputView($event, this.modificationsData, inputName)
      console.log("Requesting finished");
    }
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Scheduled Tasks">
      <ion-accordion-group :multiple="true">
        <DamageInspection
            :location="this.damageInspectionData.locationInput"
            @update:location="updateDamageInspectionViewData($event, 'location')"
            :new-damage="this.damageInspectionData.newDamageInput"
            @update:new-damage="updateDamageInspectionViewData($event, 'newDamage')"
            :complete-date="this.damageInspectionData.dateInput"
            @update:complete-date="updateDamageInspectionViewData($event, 'completeDate')"
            :selected-damage-category="this.damageInspectionData.selectedDamageTypeOption"
            @update:selected-damage-category="updateDamageInspectionViewData($event, 'selectedDamageCategory')"
            :damage-category="this.damageInspectionData.damageTypeInput"
            @update:damage-category="updateDamageInspectionViewData($event, 'damageCategory')"
            :emergency="this.damageInspectionData.emergencyInput"
            @update:emergency="updateDamageInspectionViewData($event, 'emergency')"
            :description="this.damageInspectionData.commentsInput"
            @update:description="updateDamageInspectionViewData($event, 'description')"
            :images="this.damageInspectionData.images"
            @update:images="this.updateDamageInspectionViewData($event,'takePhoto')"
            @delete:image="this.updateDamageInspectionViewData($event,'deletePhoto')"
            :save-data-request="saveDataRequest"
        />
        <BacklogMaintenance
          :location="this.backlogMaintenanceData.locationInput"
          @update:location="this.updateBacklogMaintenanceViewData($event, 'location')"
          :emergency="this.backlogMaintenanceData.emergencyInput"
          @update:emergency="this.updateBacklogMaintenanceViewData($event, 'emergency')"
          :type="this.backlogMaintenanceData.maintenanceTypeInput"
          @update:maintenance-type="this.updateBacklogMaintenanceViewData($event, 'maintenanceType')"
          :cost-indication="this.backlogMaintenanceData.costIndicationInput"
          @update:cost-indication="this.updateBacklogMaintenanceViewData($event, 'costIndication')"
          :images="this.backlogMaintenanceData.images"
          @update:images="this.updateBacklogMaintenanceViewData($event, 'takePhoto')"
          @delete:image="this.updateBacklogMaintenanceViewData($event, 'deletePhoto')"
        />
        <TechnicalInstallationInspection
          :test-procedure-url="this.technicalInstallationData.testProcedureUrl"
          :location="this.technicalInstallationData.locationInput"
          @update:location="this.updateTechnicalInstallationViewData($event, 'location')"
          :installation-type="this.technicalInstallationData.installationTypeInput"
          @update:installation-type="this.updateTechnicalInstallationViewData($event, 'installationType')"
          :client-statement="this.technicalInstallationData.clientStatementInput"
          @update:client-statement="this.updateTechnicalInstallationViewData($event, 'clientStatement')"
          :approved="this.technicalInstallationData.approvedInput"
          @update:approved="this.updateTechnicalInstallationViewData($event, 'approved')"
          :comments="this.technicalInstallationData.commentsInput"
          @update:comments="this.updateTechnicalInstallationViewData($event, 'comments')"
          :images="this.technicalInstallationData.images"
          @update:images="this.updateTechnicalInstallationViewData($event, 'takePhoto')"
          @delete:image="this.updateTechnicalInstallationViewData($event, 'deletePhoto')"
        />
        <ModificationInspection
            :location="this.modificationsData.location"
            @update:location="this.updateModificationsViewData($event, 'location')"
            :documented-mods-file="this.modificationsData.documentedModsFile"
            :documented-mods-url="this.modificationsData.documentedModsUrl"
            @update:documented-mods="this.updateModificationsViewData($event,'documentedModsFile')"
            :modified-by="this.modificationsData.modifiedBy"
            @update:modified-by="this.updateModificationsViewData($event,'modifiedBy')"
            :mod-description="this.modificationsData.modDescription"
            @update:mod-description="this.updateModificationsViewData($event,'modDescription')"
            :required-action="this.modificationsData.requiredAction"
            @update:required-action="this.updateModificationsViewData($event,'requiredAction')"
            :comments="this.modificationsData.comments"
            @update:comments="this.updateModificationsViewData($event,'comments')"
            :images="this.modificationsData.images"
            @update:images="this.updateModificationsViewData($event, 'takePhoto')"
            @delete:image="this.updateModificationsViewData($event, 'deletePhoto')"
        />
      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
