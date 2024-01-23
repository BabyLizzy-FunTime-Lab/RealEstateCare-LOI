<script>
import {IonPage, IonButtons, IonImg,
  IonButton, IonContent, IonHeader,
  IonToolbar, IonFooter, IonProgressBar, IonAvatar} from "@ionic/vue";
import { build, search, alertCircle } from 'ionicons/icons';
import BottomToolbarButton from "@/components/toolbar/BottomToolbarButton.vue";
import {useLoginStore} from "@/stores/LoginStore.js";
import LoginForm from "@/components/login/LoginForm.vue";

export default {
  name: "BaseLayout",
  components: {
    BottomToolbarButton, IonPage, IonButtons, IonImg,
    IonButton, IonContent, IonHeader, IonToolbar,
    IonFooter, LoginForm, IonProgressBar, IonAvatar},
  setup() {
    return { alertCircle, build, search };
  },
  data() {
    return {
      loginStore: useLoginStore()
    }
  },
  methods: {
    print(icon) {
      console.log(icon);
    },
  }
}
</script>

<template>
  <IonPage>
    <ion-header :translucent="true">
      <div class="top-decoration"></div>
      <div>
        <ion-toolbar class="toolbar--top" >
          <ion-img
              router-link="/"
              class="toolbar__logo"
              src="/logos/real-estate-care-logo.png"
              alt="Real Estate Logo" slot="start"/>
          <ion-buttons slot="secondary">
            <ion-button v-if="loginStore.getLoginStatus" router-link="/user-info">
              <ion-avatar>
                <ion-img
                    alt="Icon-Image of the user."
                    :src="loginStore.getUserAvatar" />
              </ion-avatar>
            </ion-button>
            <ion-button router-link="/">
              <ion-img
                  class="toolbar__icon"
                  src="/icons/toolbar/toolbar-bell-icon.png"
                  alt="Bell Icon"/>
            </ion-button>
            <ion-button router-link="/settings">
              <ion-img
                  class="toolbar__icon"
                  src="/icons/toolbar/toolbar-settings-icon.png"
                  alt="Settings Icon"/>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </div>
      <ion-progress-bar v-if="loginStore.loadingStatus" color="secondary" type="indeterminate"></ion-progress-bar>
    </ion-header>
    <ion-content>
      <LoginForm v-if="!loginStore.loginStatus"></LoginForm>
      <slot v-else-if="loginStore.loginStatus"></slot>
    </ion-content>
    <ion-footer>
      <ion-toolbar class="toolbar--bottom">
        <ion-buttons>
          <bottom-toolbar-button label="Active Task" :icon="build" path="/scheduled"/>
          <bottom-toolbar-button label="Search" :icon="search" path="/completed"/>
          <bottom-toolbar-button label="Information" :icon="alertCircle" path="/knowledge-base"/>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </IonPage>
</template>

<style scoped lang="scss">
.top-decoration {
  height: 1.1em;
  background-color: var(--ion-color-secondary);
}
.toolbar--top, .toolbar--bottom {
  --color: white;
}
.toolbar--top {
  --background: var(--ion-color-primary);
  .toolbar__logo {
    height: 2.3em;
    padding-left: .5em;
  }
  .toolbar__icon, ion-avatar {
    height: 1.6em;
    border-radius: 1em;
  }
  ion-avatar {
    width: 1.6em;
    background-color: lightgray;
    border: .2em solid var(--ion-color-secondary);
  }
}
.toolbar--bottom {
  --background: var(--ion-color-secondary);
  ion-buttons {
    justify-content: space-between;
  }
}
ion-content {
  --padding-start: .2em;
  --padding-end: .2em;
}
</style>
