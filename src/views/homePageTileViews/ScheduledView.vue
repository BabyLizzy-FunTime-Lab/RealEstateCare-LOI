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
      damageInspectionData: {
        id: "",
        inspectorId: "",
        location: "",
        new_damage: "",
        complete_date: new Date().toISOString(),
        selected_damage_category: "",
        damage_category: "",
        emergency: "",
        description: "",
        images: []
      }
    }
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
  }
}
</script>

<template>
  <base-layout>
    <base-list-layout list-header-name="Scheduled Tasks">
      <ion-accordion-group :multiple="true">
        <DamageInspection
            id="{{this.damageInspectionData.id}}"
            inspector-id="{{this.damageInspectionData.inspectorId}}"
            :location="this.damageInspectionData.location"
            :new_damage="this.damageInspectionData.new_damage"
            complete_date="{{this.damageInspectionData.complete_date}}"
            selected_damage_category="{{this.damageInspectionData.selected_damage_category}}"
            damage_category="{{this.damageInspectionData.damage_category}}"
            emergency="{{this.damageInspectionData.emergency}}"
            description="{{this.damageInspectionData.description}}"
            images="{{this.damageInspectionData.images}}"
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
