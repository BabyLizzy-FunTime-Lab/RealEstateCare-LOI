<script>
import {IonAccordion, IonItem, IonLabel} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  name: "BaseAccordionLayout",
  components: {IonItem, IonLabel, IonAccordion, BaseButton},
  props: {
    headerName: String,
    accordionValue: String,
    onSaveClick: {
      type: Function
    }
  }
}
</script>

<template>
  <ion-accordion :value="accordionValue">
    <ion-item slot="header" color="light">
      <ion-label>{{ headerName }}</ion-label>
    </ion-item>
    <slot></slot>
    <BaseButton slot="content" name="Save" @click="onSaveClick"/>
  </ion-accordion>
</template>

<style scoped lang="scss">
ion-item {
  margin-top: .5em;
  border-top: 2px solid var(--ion-color-secondary);
  border-left: 2px solid var(--ion-color-secondary);
  box-sizing: border-box;
}
</style>
