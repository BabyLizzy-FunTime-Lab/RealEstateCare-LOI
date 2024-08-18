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
    }
  },
  methods: {
    login(username, password) {
      this.$router.replace({path:'/'});
      this.loginStore.loginUser(username, password);
      // When user and password match, fetch the 2way authentication code.
      // Then render the 2way authentication form.
      // If there is a match set loginStatus to true.
      // On fail, deploy notification. Make sure to include a cancel button.
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
  <form name="login">
    <ion-list>
      <ion-list-header color="primary">
        <ion-label>
          <h2>Login</h2>
        </ion-label>
      </ion-list-header>
      <ion-item>
        <ion-input type="text"
                   v-model="username"
                   placeholder="user"
                   label="username:"
                   @keyup.enter="login(username, password)"/>
      </ion-item>
      <ion-item>
        <ion-input type="password"
                   v-model="password"
                   placeholder="123"
                   label="password:"
                   @keyup.enter="login(username, password)"/>
      </ion-item>
      <base-button name="Login" expand="block" @click="login(username, password)"/>
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
