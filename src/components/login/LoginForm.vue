<script>
import {
  IonList, IonItem, IonInput,
  IonListHeader, IonLabel,
  IonAlert, useIonRouter
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import {useLoginStore} from "@/stores/LoginStore.js";

export default {
  name: "LoginForm",
  components: {
    IonList, IonItem, IonInput, IonListHeader,
    IonLabel, IonAlert, BaseButton
  },
  data() {
    return {
      loginStore: useLoginStore(),
      router: useIonRouter(),
      username: "",
      password: "",
      inputTwoFactorCode: ""
    }
  },
  methods: {
    login(username, password) {
      this.$router.replace({path:'/'});
      this.loginStore.loginUser(username, password);
    },
    twoFactorAuthentication(inputCode) {
      this.loginStore.twoFactorAuthenticationCheck(inputCode);
    }
  }
}
</script>

<template>
  <ion-alert
      :isOpen="loginStore.getLoginError.status"
      header="Problem!"
      :sub-header="loginStore.getLoginError.subHeader"
      :message="loginStore.getLoginError.message"
      :buttons="['OK']"
      @didDismiss="loginStore.closeLoginError()"
  />
  <form name="loginForm" @submit.prevent v-if="!loginStore.getLoginPhase">
    <ion-list>
      <ion-list-header color="primary">
        <ion-label>
          <h2>Login</h2>
        </ion-label>
      </ion-list-header>
      <ion-item>
        <ion-input
            label="Username:"
            type="text"
            v-model="username"
            placeholder="user"
            @keyup.enter="login(username, password)"
        />
      </ion-item>
      <ion-item>
        <ion-input
            label="Password:"
            type="password"
            v-model="password"
            placeholder="123"
            @keyup.enter="login(username, password)"
        />
      </ion-item>
      <base-button
          name="Login"
          expand="block"
          @click="login(username, password)"
      />
    </ion-list>
  </form>
  <form name="2FAForm" @submit.prevent v-if="loginStore.getLoginPhase">
    <ion-list>
      <ion-list-header color="primary">
        <ion-label>
          <h2>2-Factor Authentication</h2>
        </ion-label>
      </ion-list-header>
      <ion-item>
        <ion-input
            label="Input Code:"
            type="password"
            v-model="inputTwoFactorCode"
            placeholder="123456"
            @keyup.enter="twoFactorAuthentication(inputTwoFactorCode)"
        />
      </ion-item>
      <base-button
          name="Check Code"
          expand="block"
          @click="twoFactorAuthentication(inputTwoFactorCode)"
      />
<!--      we need a cancel button-->
    </ion-list>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  justify-content: center;
  align-items: center;
}
ion-list {
  width: 100%;
}
ion-list-header {
  margin-bottom: .5em;
}
ion-button {
  margin-top: 2em;
  width: 30%;
  margin-left: auto;
  margin-right: auto;
}
</style>
