<script>
import {IonAccordion, IonInput, IonItem, IonLabel} from "@ionic/vue";

export default {
  name: "BaseAccordionLayout",
  components: {IonInput, IonItem, IonLabel, IonAccordion},
  props: {
    headerName: String,
    inspectionId: String,
    colorStyle: {
      value: String,
      default: "light"
    }
  }
}
</script>

<template>
  <ion-accordion>
    <ion-item class="custom-list-header" slot="header" :color="colorStyle">
      <ion-label slot="start">{{ headerName }}</ion-label>
    </ion-item>
    <ion-item slot="content" v-if="inspectionId">
      <ion-input readonly label="Inspection ID" label-placement="floating" :value="inspectionId"/>
    </ion-item>
    <slot></slot>
  </ion-accordion>
</template>

<style scoped lang="scss">
.custom-list-header {
  margin-top: .5em;
  border-top: 2px solid var(--ion-color-secondary);
  border-left: 2px solid var(--ion-color-secondary);
  box-sizing: border-box;
}

</style>
