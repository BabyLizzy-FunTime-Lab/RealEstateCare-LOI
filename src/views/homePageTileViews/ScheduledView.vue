<script>
import {IonAccordionGroup} from "@ionic/vue";
import baseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspection from "@/components/dataDisplayInputs/InspectionComponentDamage.vue";
import BacklogMaintenance from "@/components/dataDisplayInputs/InspectionComponentBacklogMaintenance.vue";
import TechnicalInstallationInspection from "@/components/dataDisplayInputs/InspectionComponentTechnicalInstallation.vue";
import ModificationInspection from "@/components/dataDisplayInputs/InspectionComponentModification.vue";
import AddressDate from "@/components/dataDisplayInputs/InspectionComponentAddressDate.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";

export default {
  name: "ScheduledView",
  components: {
    baseListLayout, IonAccordionGroup, DamageInspection, BacklogMaintenance,
    TechnicalInstallationInspection, ModificationInspection, AddressDate
  },
  data() {
    return {
      inspectionStore: useInspectionStore(),
      date: null,
      address: null,
      basicInspectionData: Object,
      damageInspectionData: Object,
      backlogMaintenanceData: Object,
      technicalInstallationData: Object,
      modificationsData: Object,
      testData: {
        name: "Test Procedure",
        url: "https://res.cloudinary.com/babylizzyevee/image/upload/v1711289986/CV-images/LOI-cursus/pdf/Test_Procedure.pdf"
      },
    }
  },
  mounted() {
    this.basicInspectionData = this.inspectionStore.getBasicInspectionViewData;
    this.damageInspectionData = this.inspectionStore.getDamageInspectionViewData;
    this.backlogMaintenanceData = this.inspectionStore.getBacklogMaintenanceViewData;
    this.technicalInstallationData = this.inspectionStore.getTechnicalInstallationViewData;
    this.modificationsData = this.inspectionStore.getModificationsViewData;
  },
  methods: {
    pushInspectionViewData() {
      console.log("starting data push.");
      this.inspectionStore.pushInspectionViewData();
    },
    updateDamageInspectionViewData($event, inputName) {
      // Am I being too redundant here?
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
      console.log("Requesting finished");
    },
    updateAddress($event) {
      this.inspectionStore.updateAddressViewData($event);
    },
    updateDate($event) {
      console.log($event);
      this.inspectionStore.updateDateViewData($event);
    }
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Scheduled Tasks">
      <AddressDate
          :address="this.basicInspectionData.address"
          @update:address="updateAddress($event)"
          :date="this.basicInspectionData.date"
          :reset-date="this.basicInspectionData.resetDate"
          @update:date="updateDate($event)"
          @save:data="pushInspectionViewData"
      />
      <ion-accordion-group :multiple="true">
        <DamageInspection
            :location="this.damageInspectionData.location"
            @update:location="updateDamageInspectionViewData($event, 'location')"
            :new-damage="this.damageInspectionData.newDamage"
            @update:new-damage="updateDamageInspectionViewData($event, 'newDamage')"
            :selected-damage-type-option="this.damageInspectionData.selectedDamageTypeOption"
            @update:selected-damage-type-option="updateDamageInspectionViewData($event, 'selectedDamageTypeOption')"
            :damage-type="this.damageInspectionData.damageType"
            @update:damage-type="updateDamageInspectionViewData($event, 'damageType')"
            :emergency="this.damageInspectionData.emergency"
            @update:emergency="updateDamageInspectionViewData($event, 'emergency')"
            :comments="this.damageInspectionData.comments"
            @update:comments="updateDamageInspectionViewData($event, 'comments')"
            :images="this.damageInspectionData.images"
            @update:images="this.updateDamageInspectionViewData($event,'takePhoto')"
            @delete:image="this.updateDamageInspectionViewData($event,'deletePhoto')"
        />
        <BacklogMaintenance
          :location="this.backlogMaintenanceData.location"
          @update:location="this.updateBacklogMaintenanceViewData($event, 'location')"
          :emergency="this.backlogMaintenanceData.emergency"
          @update:emergency="this.updateBacklogMaintenanceViewData($event, 'emergency')"
          :maintenance-type="this.backlogMaintenanceData.maintenanceType"
          @update:maintenance-type="this.updateBacklogMaintenanceViewData($event, 'maintenanceType')"
          :cost-indication="this.backlogMaintenanceData.costIndication"
          @update:cost-indication="this.updateBacklogMaintenanceViewData($event, 'costIndication')"
          :images="this.backlogMaintenanceData.images"
          @update:images="this.updateBacklogMaintenanceViewData($event, 'takePhoto')"
          @delete:image="this.updateBacklogMaintenanceViewData($event, 'deletePhoto')"
        />
        <TechnicalInstallationInspection
          :location="this.technicalInstallationData.location"
          @update:location="this.updateTechnicalInstallationViewData($event, 'location')"
          :installation-type="this.technicalInstallationData.installationType"
          @update:installation-type="this.updateTechnicalInstallationViewData($event, 'installationType')"
          :client-statement="this.technicalInstallationData.clientStatement"
          @update:client-statement="this.updateTechnicalInstallationViewData($event, 'clientStatement')"
          :approved="this.technicalInstallationData.approved"
          @update:approved="this.updateTechnicalInstallationViewData($event, 'approved')"
          :comments="this.technicalInstallationData.comments"
          @update:comments="this.updateTechnicalInstallationViewData($event, 'comments')"
          :images="this.technicalInstallationData.images"
          @update:images="this.updateTechnicalInstallationViewData($event, 'takePhoto')"
          @delete:image="this.updateTechnicalInstallationViewData($event, 'deletePhoto')"
        />
        <ModificationInspection
            :location="this.modificationsData.location"
            @update:location="this.updateModificationsViewData($event, 'location')"
            :documented-mods-file="this.modificationsData.documentedModsFile"
            :documented-mods-doc-name="this.modificationsData.documentedModsDocName"
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
