<script>
import {IonButton, IonIcon, IonLabel} from "@ionic/vue";

export default {
  name: "BottomToolbarButton",
  components: {IonIcon, IonButton, IonLabel},
  props: {
    label: String,
    icon: String,
    path: String,
  },
}
</script>

<template>
    <ion-button :router-link="path">
      <div class="custom-bottom-toolbar-button">
        <ion-icon :icon="icon"></ion-icon>
        <ion-label>{{ label }}</ion-label>
      </div>
    </ion-button>
</template>

<style scoped lang="scss">
.custom-bottom-toolbar-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}
ion-icon {
  height: 1.2em;
  font-size: 1.5em;
}
ion-button {
  text-transform: capitalize;
  font-size: .8em;
  ion-label {
    font-weight: 100;
    font-size: 1em;
  }
}
</style>
