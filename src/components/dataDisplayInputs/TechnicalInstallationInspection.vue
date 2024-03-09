<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/dataDisplayInputs/ImageThumbnailViewer.vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "TechnicalInstallationInspection",
  components: {
    ImageThumbnailViewer, IonButton, IonTextarea, IonRadio, IonRadioGroup,
    IonSelectOption, IonSelect, IonInput, BaseButton, BaseAccordionLayout,
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
<BaseAccordionLayout header-name="Technical Installation Inspection" accordion-value="third">
  <ion-item slot="content">
    <ion-input label="Location"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-select value=""
                label="Installation type"
                placeholder="Select"
                @ionChange="console.log('tech damage')">
      <ion-select-option value="cooling">Cooling</ion-select-option>
      <ion-select-option value="heating">Heating</ion-select-option>
      <ion-select-option value="ventilation">Ventilation</ion-select-option>
      <ion-select-option value="electric">Electric</ion-select-option>
      <ion-select-option value="security">Security</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Client statement"
                  value=""
                  @ionChange="console.log('update:clientStatement')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter statement"></ion-textarea>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Approved</ion-label>
    <ion-radio-group value=""
                     @ionChange="console.log('update:approved')"
                     name="newDamage">
      <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Test procedure</ion-label>
    <BaseButton name="View" @click="console.log('get procedure')"/>
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
<!--  <ion-item  slot="content" v-if="images.length > 0">-->
<!--    <div id="thumbnail&#45;&#45;container">-->
<!--      <image-thumbnail-viewer v-for="(image, index) in images" :key="index"-->
<!--                              :image="image" @delete-event="emitInputChange(image, 'delete:image')"/>-->
<!--    </div>-->
<!--  </ion-item>-->
  <BaseButton slot="content" name="Save" @click="console.log('saving technical')"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
