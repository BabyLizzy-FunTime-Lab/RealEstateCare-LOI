<template>
<base-layout>
  <base-list-layout list-header-name="User Information">
    <ion-avatar slot="">
      <ion-img alt="Icon-Image of the user." :src="loginStore.getUserAvatar"/>
    </ion-avatar>
    <ion-item v-for="(value, key) in loginStore.getUserInfo">
      <ion-label>{{ key.toUpperCase() }}:</ion-label>
      {{ value }}
    </ion-item>
    <ion-button @click="loginStore.logoutUser"
                v-if="loginStore.loginStatus"
                expand="full" color="primary"
                router-link="/">Logout</ion-button>
    <ion-button v-else expand="full"
                color="primary"
                router-link="/">Login</ion-button>
  </base-list-layout>
</base-layout>
</template>

<script>
import {IonItem, IonLabel, IonAvatar, IonButton, IonImg} from "@ionic/vue";
import baseListLayout from "@/components/base/BaseListLayout.vue";
import {useLoginStore} from "@/stores/LoginStore.js";
export default {
  name: "UserInfo",
  components: {IonItem, IonLabel, IonAvatar, IonButton, IonImg, baseListLayout},
  data() {
    return {
      loginStore: useLoginStore()
    }
  }
}
</script>

<style scoped lang="scss">
ion-avatar {
  height: 12em;
  width: 12em;
  margin: 1em auto 1em auto;
}
ion-button {
  margin-top: 2em;
}
ion-item {
  text-transform: capitalize;
}
</style>
