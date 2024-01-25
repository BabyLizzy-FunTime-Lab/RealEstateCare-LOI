<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import {IonItem, IonInput, IonSelect, IonSelectOption} from "@ionic/vue";

export default {
  name: "BacklogMaintenance",
  components: {BaseAccordionLayout, IonItem, IonInput, IonSelect, IonSelectOption},
  data() {
    return {
      inspectionStore: useInspectionStore(),
    }
  }
}
</script>

<template>
<BaseAccordionLayout header-name="Backlog Maintenance" accordion-value="second">
  <ion-item slot="content">
    <ion-input label="Location"
               v-model="inspectionStore.backlogMaintenance.locationInput"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-select v-model="inspectionStore.backlogMaintenance.maintenanceTypeInput"
                label="Maintenance Type" placeholder="Select">
      <ion-select-option value="paint">Paint</ion-select-option>
      <ion-select-option value="wood">Wood Rot</ion-select-option>
      <ion-select-option value="electric">Electric</ion-select-option>
      <ion-select-option value="pipping">Pipping</ion-select-option>
      <ion-select-option value="glas">Glas</ion-select-option>
    </ion-select>
  </ion-item>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
