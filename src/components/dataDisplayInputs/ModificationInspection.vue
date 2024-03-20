<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea} from "@ionic/vue";
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
}
</script>

<template>
<BaseAccordionLayout header-name="Modifications" accordion-value="fourth">
  <ion-item slot="content" lines="none">
    <ion-label slot="start">Documented mods</ion-label>
    <BaseButton slot="end" name="View" @click="console.log('get procedure')"/>
  </ion-item>
  <ion-item slot="content">
    <ion-input label="Upload PDF" label-placement="stacked" type="file" accept="application/pdf" @change="console.log('uploading')" />
  </ion-item>
  <ion-item slot="content">
    <ion-input label="Location"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-select value=""
                label="Executed by"
                placeholder="Select">
      <ion-select-option value="tenant">Tenant</ion-select-option>
      <ion-select-option value="contractor">Contractor</ion-select-option>
      <ion-select-option value="unknown">Unknown</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Mod description"
                  value=""
                  @ionChange="console.log('update:modDescription')"
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
<!--    <ion-item  slot="content" v-if="images.length > 0">-->
<!--      <image-thumbnail-viewer-->
<!--          :images="images" @delete-event="emitInputChange($event, 'delete:image')"/>-->
<!--    </ion-item>-->
  <BaseButton slot="content" name="Save" @click="console.log('saving mods')"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
