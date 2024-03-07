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
    this.damageInspectionData = this.inspectionStore.getDamageInspectionViewData
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
    handleDeletePhoto(imgURL) {
      this.updateDamageInspectionViewData(imgURL,'deletePhoto', );
    },
    handleTakingPhoto(newImg) {
      this.updateDamageInspectionViewData(newImg,'takePhoto', );
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
