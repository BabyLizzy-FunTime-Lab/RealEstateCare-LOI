<script>
import {IonButton} from "@ionic/vue";

export default {
  name: "BaseButton",
  components: {IonButton},
  props: {
    name: ""
  }
}
</script>

<template>
  <ion-button expand="full" fill="solid"
              color="secondary">{{name}}</ion-button>
</template>

<style scoped lang="scss">
ion-button {
  margin-top: 1em;
}
</style>
