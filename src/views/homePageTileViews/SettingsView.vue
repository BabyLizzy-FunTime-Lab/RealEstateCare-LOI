<script>
import {IonItem, IonToggle} from "@ionic/vue";
import BaseListLayout from "@/components/base/BaseListLayout.vue";
import {useLoginStore} from "@/stores/LoginStore.js";
import {ref} from 'vue';

export default {
  name: "SettingsView",
  components: {
    BaseListLayout, IonItem, IonToggle
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
      console.log("preference: " + prefersDark);
      console.log(document.body.classList)
      console.log(event);
    }
  }
}
</script>

<template>
<base-layout>
  <base-list-layout list-header-name="Settings">
    <ion-item>
      <ion-toggle
          :checked="themeToggle"
          @ionChange="toggleDarkMode"
          justify="space-between"
      >Dark Mode</ion-toggle>
    </ion-item>
    <ion-item>
      Other app settings.
    </ion-item>
  </base-list-layout>
</base-layout>
</template>

<style scoped lang="scss">

</style>
