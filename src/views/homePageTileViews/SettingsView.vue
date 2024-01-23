<script>
import {IonList, IonListHeader, IonLabel, IonItem, IonToggle} from "@ionic/vue";
import {useLoginStore} from "@/stores/LoginStore.js";
import {ref} from 'vue';

export default {
  name: "SettingsView",
  components: {
    IonList, IonListHeader, IonLabel, IonItem, IonToggle
  },
  data() {
    return {
      loginStore: useLoginStore()
    }
  },
  setup() {
    const themeToggle = ref(false);

    return {
      themeToggle,
    }
  },
  methods: {
    toggleDarkMode(event) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark', !prefersDark);
      console.log("prefernce: " + prefersDark);
      console.log(document.body.classList)
      console.log(event);
    }
  }
}
</script>

<template>
<base-layout>
  <ion-list>
    <ion-list-header color="primary">
      <ion-label>
        <h2>Settings</h2>
      </ion-label>
    </ion-list-header>
    <ion-item>
      <ion-toggle :checked="themeToggle" @ionChange="toggleDarkMode" justify="space-between"
      >Dark Mode</ion-toggle>
    </ion-item>
    <ion-item>
      Other app settings.
    </ion-item>
  </ion-list>
</base-layout>
</template>

<style scoped lang="scss">

</style>
