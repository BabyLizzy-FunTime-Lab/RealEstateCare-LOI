<script>
import {IonAccordionGroup} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import DamageInspection from "@/components/dataDisplayInputs/DamageInspection.vue";

export default {
  name: "DamageInspectionsViewer",
  components: {IonAccordionGroup, BaseAccordionLayout, DamageInspection},
  props: {
    inspections: null
  }

}
</script>

<template>
<!--  We need to start here with a base accordion layout. -->
  <ion-accordion-group>
    <base-accordion-layout header-name="Damage Inspections" color-style="secondary">
      <ion-accordion-group slot="content">
        <DamageInspection
            v-for="inspection of inspections" :key="inspection.id"
            :header-name="inspection.date"
            :location="inspection.location"
        />
      </ion-accordion-group>
    </base-accordion-layout>
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
