<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import {IonItem, IonInput, IonSelect, IonSelectOption, IonRadioGroup, IonLabel, IonRadio, IonButton} from "@ionic/vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/dataDisplayInputs/ImageThumbnailViewer.vue";

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "BacklogMaintenance",
  components: {
    ImageThumbnailViewer,
    IonButton,
    BaseButton,
    IonRadio, IonLabel, IonRadioGroup, BaseAccordionLayout, IonItem, IonInput, IonSelect, IonSelectOption},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      newPhoto,
      photos,
      takePhoto
    }
  }
}
</script>

<template>
<BaseAccordionLayout header-name="Backlog Maintenance" accordion-value="second">
  <ion-item slot="content">
    <ion-input label="Location"
               v-model="inspectionStore.backlogMaintenanceViewData.locationInput"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Emergency Action needed?</ion-label>
    <ion-radio-group value=""
                     @ionChange="console.log('emergency')"
                     name="emergency">
      <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-select value=""
                label="Maintenance Type"
                placeholder="Select">
      <ion-select-option value="paint">Paint</ion-select-option>
      <ion-select-option value="wood">Wood Rot</ion-select-option>
      <ion-select-option value="electric">Electric</ion-select-option>
      <ion-select-option value="pipping">Pipping</ion-select-option>
      <ion-select-option value="glass">Glass</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-select value=""
                label="Cost Prediction"
                placeholder="Select">
      <ion-select-option value="0-500">0-500</ion-select-option>
      <ion-select-option value="500-1500">500-1500</ion-select-option>
      <ion-select-option value="1500+">1500+</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content" lines="none">
    <ion-label>Photos</ion-label>
    <ion-button name="takePhoto" @click="takePhoto" color="primary">Take Photo</ion-button>
  </ion-item>
<!--  <ion-item  slot="content" v-if="images.length > 0">-->
<!--    <div id="thumbnail&#45;&#45;container">-->
<!--      <image-thumbnail-viewer v-for="(image, index) in images" :key="index"-->
<!--                              :image="image" @delete-event="emitInputChange(image, 'delete:image')"/>-->
<!--    </div>-->
<!--  </ion-item>-->
  <BaseButton slot="content" name="Save" @click="console.log('saving backlog')"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
