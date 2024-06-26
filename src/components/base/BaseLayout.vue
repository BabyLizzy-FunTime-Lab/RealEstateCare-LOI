<!--This is the base layout for the entire app.
It gets imported in the main.js file together with the basic theme/variables css-->
<script>
import {IonPage, IonButtons, IonImg,
  IonButton, IonContent, IonHeader,
  IonToolbar, IonFooter, IonProgressBar, IonAvatar} from "@ionic/vue";
import { build, search, alertCircle } from 'ionicons/icons';
import {useLoginStore} from "@/stores/LoginStore.js";
import LoginForm from "@/components/login/LoginForm.vue";
import BaseLayoutBottomToolbarButton from "@/components/base/BaseLayoutBottomToolbarButton.vue";
import BaseNotificationModal from "@/components/base/BaseNotificationModal.vue";

export default {
  name: "BaseLayout",
  components: {
    BaseLayoutBottomToolbarButton, BaseNotificationModal, IonPage,
    IonButtons, IonImg, IonButton, IonContent, IonHeader, IonToolbar,
    IonFooter, LoginForm, IonProgressBar, IonAvatar
  },
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
      <div class="toolbar--wrapper">
        <ion-toolbar class="toolbar--top" >
          <ion-img
              router-link="/"
              class="toolbar__logo"
              src="/logos/real-estate-care-logo.png"
              alt="Real Estate Logo" slot="start"/>
          <h1 class="invisible-header-title">RealEstateCare</h1>
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
      <base-notification-modal/>
      <ion-progress-bar v-if="loginStore.loadingStatus" color="secondary" type="indeterminate"></ion-progress-bar>
    </ion-header>
    <ion-content>
      <LoginForm v-if="!loginStore.loginStatus"></LoginForm>
      <slot v-else-if="loginStore.loginStatus"></slot>
    </ion-content>
    <ion-footer>
      <ion-toolbar class="toolbar--bottom">
        <ion-buttons>
          <base-layout-bottom-toolbar-button label="Active Task" :icon="build" path="/scheduled"/>
          <base-layout-bottom-toolbar-button label="Search" :icon="search" path="/completed"/>
          <base-layout-bottom-toolbar-button label="Information" :icon="alertCircle" path="/knowledge-base"/>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </IonPage>
</template>

<style scoped lang="scss">
.invisible-header-title {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.ion-page {
  align-items: center;
  background-color: var(--ion-color-tertiary);
}
.top-decoration {
  height: 1.1em;
  background-color: var(--ion-color-secondary);
}
.toolbar--top, .toolbar--bottom {
  --color: var(--ion-color-primary-contrast);
}
.toolbar--wrapper {
  background-color: var(--ion-color-primary);
}
.toolbar--top {
  --background: var(--ion-color-primary);
  max-width: 80em;
  margin: auto;
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
    background-color: var(--ion-color-primary-contrast);
    border: .2em solid var(--ion-color-secondary);
  }
}
.toolbar--bottom {
  --background: var(--ion-color-secondary);
  ion-buttons {
    justify-content: space-between;
    max-width: 40em;
    margin: auto;
  }
}
ion-content {
  --padding-start: .2em;
  --padding-end: .2em;
  max-width: 40em;
}
</style>
