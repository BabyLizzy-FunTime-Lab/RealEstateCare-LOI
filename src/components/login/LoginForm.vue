<script>
import {IonList, IonItem, IonInput,
  IonListHeader, IonLabel, IonButton,
  IonAlert, IonContent, useIonRouter} from "@ionic/vue";
import {useLoginStore} from "@/stores/LoginStore.js";

export default {
  name: "LoginForm",
  components: {IonList, IonItem, IonInput,
    IonListHeader, IonLabel, IonButton, IonAlert, IonContent},
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
    }
  }
}
</script>

<template>
  <ion-alert
      :isOpen="loginStore.errorMessage"
      header="Problem!"
      sub-header="There was a login error."
      :message="loginStore.errorMessage"
      :buttons="['OK']"
      @didDismiss="loginStore.setErrorMessage(null)"
  />
  <form>
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
      <ion-button expand="full"
                  color="primary"
                  @click="login(username, password)">Go!</ion-button>
    </ion-list>
  </form>
</template>

<style scoped lang="scss">
ion-list-header {
  margin-bottom: .5em;
}
ion-button {
  margin-top: 2em;
}
</style>
