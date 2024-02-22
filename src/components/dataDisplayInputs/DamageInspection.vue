<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal,
  IonRadioGroup, IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/dataDisplayInputs/ImageThumbnailViewer.vue";
import { usePhotoGallery } from '@/composables/usePhotoGallery.js';

const { takePhoto, photos } = usePhotoGallery();

export default {
  name: "DamageInspection",
  components: {
    IonButton, BaseAccordionLayout, IonLabel, IonInput, IonItem, IonTextarea,
    IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, IonSelect,
    IonSelectOption, BaseButton, ImageThumbnailViewer
  },
  data() {
    return {
      photos,
      takePhoto
    }
  },
  props: {
    location: {
      type: String,
    },
    newDamage: {
      type: String,
    },
    completeDate: {
      type: String,
    },
    selectedDamageCategory: {
      type: String,
    },
    damageCategory: {
      type: String,
    },
    emergency: {
      type: String,
    },
    description: {
      type: String,
    },
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
    testPhoto() {
      console.log(this.photos);
    }
  },
  emits: [
      'update:location', 'update:newDamage', 'update:completeDate',
      'update:selectedDamageCategory', 'update:damageCategory',
      'update:emergency', 'update:description', 'delete:image'
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
    <ion-label>New Damage?</ion-label>
    <ion-radio-group :value="newDamage"
                     @ionChange="emitInputChange($event, 'update:newDamage')"
                     name="newDamage">
        <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
        <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
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
    <ion-label @click="testPhoto">Photos</ion-label>
    <ion-button @click="takePhoto" color="primary">Take Photo</ion-button>
  </ion-item>
  <ion-item  slot="content" v-if="images.length > 0">
    <div id="thumbnail--container">
      <image-thumbnail-viewer v-for="(image, index) in images" :key="index"
                              :image="image" @delete-event="emitInputChange(image, 'delete:image')"/>
    </div>
  </ion-item>
  <BaseButton slot="content" name="Save" @click="saveDataRequest"/>
</base-accordion-layout>
</template>

<style scoped lang="scss">
#thumbnail--container {
  width: 100%;
  margin-bottom: .5em;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: .5em .5em;
}
</style>
