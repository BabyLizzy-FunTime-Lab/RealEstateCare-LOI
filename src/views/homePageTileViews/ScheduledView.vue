<script>
import {IonAccordionGroup} from "@ionic/vue";
import baseListLayout from "@/components/base/BaseListLayout.vue";
import DamageInspection from "@/components/dataDisplayInputs/DamageInspection.vue";
import BacklogMaintenance from "@/components/dataDisplayInputs/BacklogMaintenance.vue";
import TechnicalInstallationInspection from "@/components/dataDisplayInputs/TechnicalInstallationInspection.vue";
import Modifications from "@/components/dataDisplayInputs/Modifications.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";

export default {
  name: "ScheduledView",
  components: {baseListLayout, IonAccordionGroup, DamageInspection,
    BacklogMaintenance, TechnicalInstallationInspection, Modifications},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      damageInspectionData: Object
    }
  },
  mounted() {
    this.damageInspectionData = this.inspectionStore.getDamageInspectionStagingData
  },
  methods: {
    saveDataRequest() {
      console.log("Requesting Damage Inspection data push...");
      this.inspectionStore.pushDamageInspectionStagingData();
    },
    updateDamageInspectionStagingData($event, inputName) {
      console.log("Requesting update of " + inputName + " in staging state.");
      this.inspectionStore.updateDamageInspectionStagingData($event, inputName);
      console.log("Requesting finished");
    },
    handleDeletePhoto(imgURL) {
      this.updateDamageInspectionStagingData(imgURL,'deletePhoto', );
    },
    handleTakingPhoto(newImg) {
      this.updateDamageInspectionStagingData(newImg,'takePhoto', );
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
            @update:location="updateDamageInspectionStagingData($event, 'location')"
            :new-damage="this.damageInspectionData.newDamageInput"
            @update:new-damage="updateDamageInspectionStagingData($event, 'newDamage')"
            :complete-date="this.damageInspectionData.dateInput"
            @update:complete-date="updateDamageInspectionStagingData($event, 'completeDate')"
            :selected-damage-category="this.damageInspectionData.selectedDamageTypeOption"
            @update:selected-damage-category="updateDamageInspectionStagingData($event, 'selectedDamageCategory')"
            :damage-category="this.damageInspectionData.damageTypeInput"
            @update:damage-category="updateDamageInspectionStagingData($event, 'damageCategory')"
            :emergency="this.damageInspectionData.emergencyInput"
            @update:emergency="updateDamageInspectionStagingData($event, 'emergency')"
            :description="this.damageInspectionData.commentsInput"
            @update:description="updateDamageInspectionStagingData($event, 'description')"
            :images="this.damageInspectionData.images"
            @update:images="handleTakingPhoto"
            @delete:image="handleDeletePhoto"
            :save-data-request="saveDataRequest"
        />
        <BacklogMaintenance/>
        <TechnicalInstallationInspection/>
        <Modifications/>
      </ion-accordion-group>
    </base-list-layout>
  </base-layout>
</template>

<style scoped lang="scss">

</style>
