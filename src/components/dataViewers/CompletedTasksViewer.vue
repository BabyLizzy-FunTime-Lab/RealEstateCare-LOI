<script>
import baseListLayout from "@/components/base/BaseListLayout.vue";
import {IonAccordionGroup} from "@ionic/vue";
import DamageInspection from "@/components/dataDisplayInputs/DamageInspection.vue";


export default {
  name: "CompletedTasksViewer",
  components: {baseListLayout, IonAccordionGroup, DamageInspection},
  props: {
    inspectionsOfType: Array,
    type: String
  }

}
</script>

<template>
<!--  We need to start here with a base accordion layout. -->
    <ion-accordion-group :multiple="true">
      <DamageInspection
          v-for="(inspection) of inspectionsOfType" :key="inspection.id"
          :location="inspection.location"
      />
    </ion-accordion-group>
<!--  <BaseListLayout :list-header-name="type" style-color="secondary" back-button="false">-->
<!--    <ion-accordion-group  :multiple="true">-->
<!--      <DamageInspection-->
<!--          v-for="(inspection) of inspectionsOfType" :key="inspection.id"-->
<!--          :location="inspection.location"-->
<!--      />-->
<!--    </ion-accordion-group>-->
<!--  </BaseListLayout>-->

</template>

<style scoped lang="scss">

</style>
