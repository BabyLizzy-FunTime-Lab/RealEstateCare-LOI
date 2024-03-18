<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal,
  IonRadioGroup, IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/dataDisplayInputs/ImageThumbnailViewer.vue";
import { modalController } from "@ionic/vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "DamageInspection",
  components: {
    IonButton, BaseAccordionLayout, IonLabel, IonInput, IonItem, IonTextarea,
    IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, IonSelect,
    IonSelectOption, BaseButton, ImageThumbnailViewer
  },
  data() {
    return {
      newPhoto,
      photos,
      takePhoto
    }
  },
  props: {
    location: String,
    newDamage: String,
    completeDate: String,
    selectedDamageCategory: String,
    damageCategory: String,
    emergency: String,
    description: String,
    images: {
      default: [],
      required: false
    },
    saveDataRequest: {
      type: Function,
    },
  },
  methods: {
    emitInputChange(data, eventName) {
      this.$emit(eventName, data);
    },
    async dismissModal() {
      await modalController.dismiss();
    },
  },
  watch: {
    newPhoto() {
      this.$emit('update:images', newPhoto.value);
    }
  },
  emits: [
      'update:location', 'update:newDamage', 'update:completeDate',
      'update:selectedDamageCategory', 'update:damageCategory',
      'update:emergency', 'update:description', 'update:images', 'delete:image'
  ]
}
</script>

<template>
  <base-accordion-layout header-name="Damage Inspection" accordion-value="first">
  <ion-item slot="content">
    <ion-input label="Location"
               :value="location"
               @input="emitInputChange($event, 'update:location')"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Date</ion-label>
    <ion-datetime-button aria-label="Date" presentation="date" datetime="date"></ion-datetime-button>
    <ion-modal :keep-contents-mounted="true">
      <ion-datetime :value="completeDate"
                    @ionChange="emitInputChange($event, 'update:completeDate')"
                    displayFormat="MMM D, YYYY"
                    pickerFormat="MMM D YYYY"
                    presentation="date" id="date"></ion-datetime>
      <ion-button @click="dismissModal" >OK</ion-button>
    </ion-modal>
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="selectedDamageCategory"
                label="Damage Type"
                placeholder="Select"
                @ionChange="emitInputChange($event, 'update:selectedDamageCategory')">
      <ion-select-option value="deliberately">Deliberately</ion-select-option>
      <ion-select-option value="wear">Wear</ion-select-option>
      <ion-select-option value="violence">Violence</ion-select-option>
      <ion-select-option value="normal use">Normal Use</ion-select-option>
      <ion-select-option value="calamity">Calamity</ion-select-option>
      <ion-select-option value="other">Other</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content" v-if="selectedDamageCategory === 'other'">
    <ion-input :value="damageCategory"
               @input="emitInputChange($event, 'update:damageCategory')"
               label="Input damage type"
               label-placement="floating" placeholder="Here" type="text"></ion-input>
  </ion-item>
  <ion-item slot="content">
    <ion-label>New Damage?</ion-label>
    <ion-radio-group :value="newDamage"
                     @ionChange="emitInputChange($event, 'update:newDamage')"
                     name="newDamage">
      <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
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
    <ion-textarea label="Comments"
                  :value="description"
                  @ionChange="emitInputChange($event, 'update:description')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter your comments"></ion-textarea>
  </ion-item>
  <ion-item slot="content" lines="none">
    <ion-label>Photos</ion-label>
    <ion-button name="takePhoto" @click="takePhoto" color="primary">Take Photo</ion-button>
  </ion-item>
  <ion-item  slot="content" v-if="images.length > 0">
      <image-thumbnail-viewer
          :images="images" @delete-event="emitInputChange($event, 'delete:image')"/>
  </ion-item>
  <BaseButton slot="content" name="Save" @click="saveDataRequest"/>
</base-accordion-layout>
</template>

<style scoped lang="scss">

</style>
