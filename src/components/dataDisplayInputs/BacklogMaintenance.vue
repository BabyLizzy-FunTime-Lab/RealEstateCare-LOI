<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import {
  IonItem, IonInput, IonSelect, IonSelectOption, IonRadioGroup,
  IonLabel, IonRadio, IonButton,
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/mediaViewers/ImageThumbnailViewer.vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "BacklogMaintenance",
  components: {
    ImageThumbnailViewer, IonButton, BaseButton, IonRadio, IonLabel, IonRadioGroup,
    BaseAccordionLayout, IonItem, IonInput, IonSelect, IonSelectOption},
  data() {
    return {
      inspectionStore: useInspectionStore(),
      newPhoto,
      photos,
      takePhoto
    }
  },
  props: {
    headerName: {
      value: String,
      default: "Backlog Maintenance"
    },
    location: String,
    emergency: String,
    type: String,
    costIndication: String,
    images: {
      default: []
    },
    saveDataRequest: Function
  },
  methods: {
    emitInputChange(data, eventName) {
      this.$emit(eventName, data);
    },
  },
  watch: {
    newPhoto() {
      this.$emit('update:images', newPhoto.value);
    }
  },
  emits: [
      'update:images', 'delete:image', 'update:location', 'update:emergency',
      'update:maintenanceType', 'update:costIndication',
  ]
}
</script>

<template>
<BaseAccordionLayout :header-name="headerName">
  <ion-item slot="content">
    <ion-input label="Location"
               :value="location"
               @input="emitInputChange($event, 'update:location')"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Emergency Action needed?</ion-label>
    <ion-radio-group :value="emergency"
                     @ionChange="emitInputChange($event, 'update:emergency')"
                     name="emergency">
      <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="type"
                @ionChange="emitInputChange($event, 'update:maintenanceType')"
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
    <ion-select :value="costIndication"
                @ionChange="emitInputChange($event, 'update:costIndication')"
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
  <ion-item  slot="content" v-if="images.length > 0">
    <div id="thumbnail--container">
      <image-thumbnail-viewer :images="images"
                              @delete-event="emitInputChange($event, 'delete:image')"/>
    </div>
  </ion-item>
  <BaseButton slot="content" name="Save" @click="console.log('saving backlog')"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
