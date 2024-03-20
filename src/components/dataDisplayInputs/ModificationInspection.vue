<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonButton, IonInput, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonTextarea, modalController
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/mediaViewers/ImageThumbnailViewer.vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "ModificationInspection",
  components: {
    ImageThumbnailViewer, IonButton, IonTextarea, IonSelectOption,
    IonSelect, BaseButton, IonInput, BaseAccordionLayout,
    IonItem, IonLabel
  },
  data() {
    return {
      newPhoto,
      photos,
      takePhoto
    }
  },
  props: {
    documentedMods: {
      type: File,
      default: null
    },
    location: String,
    modifiedBy: String,
    modDescription: String,
    requiredAction: String,
    comments: String,
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
    'update:location', 'update:documentedMods', 'update:modDescription',
    'update:requiredAction', 'update:comments', 'update:modifiedBy',
    'update:images', 'delete:image'
  ]
}
</script>

<template>
<BaseAccordionLayout header-name="Modifications" accordion-value="fourth">
  <ion-item slot="content" lines="none">
    <ion-label slot="start">Documented mods</ion-label>
    <BaseButton v-if="documentedMods" slot="end" name="View" @click="console.log(documentedMods)"/>
  </ion-item>
  <ion-item slot="content">
    <ion-input
        aria-label="Upload PDF" label-placement="stacked"
        type="file" accept="application/pdf"
        @change="emitInputChange($event, 'update:documentedMods')"
    />
  </ion-item>
  <ion-item slot="content">
    <ion-input label="Location"
               :value="location"
               @input="emitInputChange($event, 'update:location')"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="modifiedBy"
                @ionChange="emitInputChange($event, 'update:modifiedBy')"
                label="Modified by"
                placeholder="Select">
      <ion-select-option value="tenant">Tenant</ion-select-option>
      <ion-select-option value="contractor">Contractor</ion-select-option>
      <ion-select-option value="unknown">Unknown</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Mod description"
                  :value="modDescription"
                  @ionChange="emitInputChange($event, 'update:modDescription')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter the mod description"></ion-textarea>
  </ion-item>
  <ion-item slot="content">
    <ion-select value=""
                label="Required action"
                placeholder="Select">
      <ion-select-option value="acceptance">Acceptance</ion-select-option>
      <ion-select-option value="inspection request">Inspection request</ion-select-option>
      <ion-select-option value="removal">Removal</ion-select-option>
      <ion-select-option value="adjusting">Adjusting</ion-select-option>
      <ion-select-option value="inspection">Inspection</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Comments"
                  value=""
                  @ionChange="console.log('update:description')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter your comments"></ion-textarea>
  </ion-item>
  <ion-item slot="content" lines="none">
    <ion-label>Photos</ion-label>
    <ion-button name="takePhoto" @click="takePhoto" color="primary">Take Photo</ion-button>
  </ion-item>
      <image-thumbnail-viewer
          :images="images" @delete-event="emitInputChange($event, 'delete:image')"/>
  <BaseButton slot="content" name="Save" @click="console.log('saving mods')"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
