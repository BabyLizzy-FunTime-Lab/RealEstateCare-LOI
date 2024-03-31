<script>
import {IonAccordion, IonItem, IonLabel} from "@ionic/vue";

export default {
  name: "BaseAccordionLayout",
  components: {IonItem, IonLabel, IonAccordion,},
  props: {
    headerName: String,
    accordionValue: String,
    colorStyle: {
      value: String,
      default: "light"
    }
  }
}
</script>

<template>
  <ion-accordion :value="accordionValue">
    <ion-item slot="header" :color="colorStyle">
      <ion-label>{{ headerName }}</ion-label>
    </ion-item>
    <slot></slot>
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
