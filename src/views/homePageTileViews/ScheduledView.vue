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
      // we need a switch. depending on input name we choose a store action.
      let newData = $event.target.value;
      this.inspectionStore.updateDamageInspectionStagingData(newData, inputName);
      console.log("Requesting update of " + inputName + " in staging state.");
      console.log(this.damageInspectionData);
    },
    handleDeleteStagingImageEvent(img) {
      console.log("Deleting: " + img);
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
            @delete:image="handleDeleteStagingImageEvent"
            :save-data-request="saveDataRequest"
        />
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
