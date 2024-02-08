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
      damageInspectionData: Object
    }
  },
  mounted() {
    this.damageInspectionData = this.inspectionStore.getDamageInspectionStagingData
  },
  methods: {
    saveData() {
      let data = this.damageInspectionData;
      delete data.selected_damage_category;
      // new data gets added a new id.
      delete data.id;
      console.log(data);
      // the inspectorId is added by the saveDamageInspections function.
      // this.inspectionStore.saveDamageInspections();
      console.log("Saving Damage Inspection data...");
    },
    setDamageType() {
      this.damageInspectionData.damage_category = this.damageInspectionData.selected_damage_category;
    },
    updateDamageInspectionStagingData($event, inputName) {
      // we need a switch. depending on input name we choose a store action.
      let newData = $event.target.value;
      this.inspectionStore.updateDamageInspectionStagingData(newData, inputName);
      console.log("Requesting update of " + inputName + " in staging state.");
      console.log(this.damageInspectionData);
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
            :damage-category="this.damageInspectionData.damageTypeInput"
            :emergency="this.damageInspectionData.emergencyInput"
            :description="this.damageInspectionData.commentsInput"
            :images="this.damageInspectionData.images"
            :save-data="saveData"
            :set-damage-type="setDamageType"
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
