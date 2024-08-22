<script>
import {IonButton} from "@ionic/vue";

export default {
  name: "BaseButton",
  components: {IonButton},
  props: {
    name: {
      default: "No Name"
    },
    buttonColor: {
      default: "secondary"
    },
    buttonExpand: {
      default: "full"
    }
  }
}
</script>

<template>
  <ion-button
      :expand="buttonExpand"
      type="button"
      fill="solid"
      :color="buttonColor"
  >{{name}}</ion-button>
</template>

<style scoped lang="scss">
ion-button {
  margin-top: 1em;
}
</style>
