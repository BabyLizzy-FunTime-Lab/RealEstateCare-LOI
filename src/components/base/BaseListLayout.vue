<script>
import {IonLabel, IonList, IonListHeader, IonButtons, IonButton, IonIcon, IonBackButton} from "@ionic/vue";
import {arrowBack} from "ionicons/icons";

export default {
  name: "BaseListLayout",
  methods: {
    arrowBack() {
      return arrowBack
    },
  },
  components: {IonListHeader, IonList, IonLabel, IonButtons, IonButton, IonIcon, IonBackButton},
  props: {
    listHeaderName: String,
    styleColor: {
      value: String,
      default: "primary"
    },
    backButton: {
      value: Boolean,
      default: true
    }
  }
}
</script>

<template>
  <ion-list>
    <ion-list-header :color="styleColor">
      <ion-label><h2>{{listHeaderName}}</h2></ion-label>
      <ion-buttons v-if="backButton === true">
        <IonBackButton defaultHref="/" :icon="arrowBack()"/>
      </ion-buttons>
    </ion-list-header>
    <slot></slot>
  </ion-list>
</template>

<style scoped lang="scss">

</style>
