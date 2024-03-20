<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonButton, IonInput, IonItem, IonLabel, IonRadio, IonRadioGroup,
  IonSelect, IonSelectOption, IonTextarea,
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageViewerModal from "@/components/mediaViewers/ImageViewerModal.vue";
import ImageThumbnailViewer from "@/components/mediaViewers/ImageThumbnailViewer.vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "TechnicalInstallationInspection",
  components: {
    ImageThumbnailViewer, IonButton, IonTextarea, IonRadio, IonRadioGroup,
    IonSelectOption, IonSelect, IonInput, BaseButton, BaseAccordionLayout,
    IonItem, IonLabel, ImageViewerModal
  },
  data() {
    return {
      newPhoto,
      photos,
      takePhoto,
      isProcedureModalOpen: false
    }
  },
  props: {
    location: String,
    installationType: String,
    clientStatement: String,
    approved: String,
    testProcedure: String,
    comments: String,
    images: {
      default: [],
      required: false
    }
  },
  methods: {
    emitInputChange(data, eventName) {
      this.$emit(eventName, data);
    },
    openCloseModal() {
      this.isProcedureModalOpen = !this.isProcedureModalOpen;
    }
  },
  watch: {
    newPhoto() {
      this.$emit('update:images', newPhoto.value);
    }
  },
  emits: [
    'update:images', 'delete:image', 'update:location', 'update:installationType',
    'update:clientStatement', 'update:approved', 'update:comments'
  ]
}
</script>

<template>
<BaseAccordionLayout header-name="Technical Installation Inspection" accordion-value="third">
  <ion-item slot="content">
    <ion-input label="Location"
               :value="location"
               @input="emitInputChange($event, 'update:location')"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-select label="Installation type"
                :value="installationType"
                @ionChange="emitInputChange($event, 'update:installationType')"
                placeholder="Select">
      <ion-select-option value="cooling">Cooling</ion-select-option>
      <ion-select-option value="heating">Heating</ion-select-option>
      <ion-select-option value="ventilation">Ventilation</ion-select-option>
      <ion-select-option value="electric">Electric</ion-select-option>
      <ion-select-option value="security">Security</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Client statement"
                  :value="clientStatement"
                  @ionChange="emitInputChange($event,'update:clientStatement')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter statement"/>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Approved</ion-label>
    <ion-radio-group :value="approved"
                     @ionChange="emitInputChange($event,'update:approved')"
                     name="newDamage">
      <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Test procedure</ion-label>
    <BaseButton name="View" @click="openCloseModal(isProcedureModalOpen)"/>
    <image-viewer-modal
        document-name="Test procedure" image="/documents/game-boy.jpg"
        :is-open="isProcedureModalOpen" @close:modal="openCloseModal"
    />
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Comments"
                  :value="comments"
                  @ionChange="emitInputChange($event,'update:comments')"
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
  <BaseButton slot="content" name="Save" @click="console.log('saving technical')"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">

</style>
