<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonButton, IonInput, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonTextarea, modalController, IonButtons
} from "@ionic/vue";
import pdfViewerModal from "@/components/mediaViewers/PdfViewerModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ImageThumbnailViewer from "@/components/mediaViewers/ImageThumbnailViewer.vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, photos, newPhoto } = usePhotoCamera();

export default {
  name: "ModificationInspection",
  components: {
    ImageThumbnailViewer, IonButton, IonTextarea, IonSelectOption,
    IonSelect, BaseButton, IonInput, BaseAccordionLayout,
    IonItem, IonLabel, IonButtons, pdfViewerModal
  },
  data() {
    return {
      newPhoto,
      photos,
      takePhoto,
      showChoosePDF: false,
      isPdfModalOpen: false,
      pdfUrl: String
    }
  },
  props: {
    documentedModsFile: {
      type: File,
      default: null
    },
    documentedModsUrl: null,
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
    emitNewPDF(data, eventName) {
      this.convertToBase64(data.target.files[0]).then(result => {
        // console.log(result);
        this.pdfUrl = result;
      })
      const dataObject = {
        file: data.target.files[0],
        url: this.pdfUrl
      }
      // this.emitInputChange(data, eventName);
      console.log(dataObject)
      this.emitInputChange(dataObject, eventName);
      this.showChoosePDF = false
    },
    async dismissModal() {
      await modalController.dismiss();
    },
    async convertToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (error) => {
          reject(error);
        };
        reader.onload = () => {
          resolve(reader.result);
        };
        console.log(file);
        reader.readAsDataURL(file);
      });
    },
    toggleChoosePDF(setTo) {
      if(setTo === false || setTo === true) {
        this.showChoosePDF = setTo
      } else {
        this.toggleOnOff('showChoosePDF')
        // this.showChoosePDF = !this.showChoosePDF;
      }
    },
    toggleOnOff(dataVariableName) {
      this[dataVariableName] = !this[dataVariableName];
    },
    viewPDF(pdf) {
      console.log(pdf);
      this.isPdfModalOpen = true
      this.toggleChoosePDF(false);
    }
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
  <ion-item id="documentedMods" slot="content" lines="none">
    <ion-label >Documented mods</ion-label>
    <ion-buttons v-if="documentedModsFile">
      <BaseButton name="View" @click="viewPDF(documentedModsFile)"/>
      <BaseButton v-if="!showChoosePDF" name="Update" @click="toggleChoosePDF"/>
    </ion-buttons>
  </ion-item>
  <ion-item id="documentedModsFiles" slot="content">
    <ion-label v-if="documentedModsFile">
      <h3>Selected PDF Title:</h3>
      <p>{{documentedModsFile.name}}</p>
    </ion-label>
    <ion-input  v-if="!documentedModsFile || showChoosePDF"
        label="Upload PDF" label-placement="stacked"
        type="file" accept="application/pdf"
        @change="emitNewPDF($event, 'update:documentedMods')"
    />
    <pdf-viewer-modal
        :pdf-url="pdfUrl" :pdf-file="documentedModsFile"
        :is-open="isPdfModalOpen" @close:modal="toggleOnOff('isPdfModalOpen')"
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
    <ion-select :value="requiredAction"
                @ionChange="emitInputChange($event, 'update:requiredAction')"
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
                  :value="comments"
                  @ionChange="emitInputChange($event, 'update:comments')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter your comments"></ion-textarea>
  </ion-item>
  <ion-item slot="content" lines="none">
    <ion-label>Photos</ion-label>
    <ion-button name="takePhoto" @click="takePhoto" color="primary">Take Photo</ion-button>
  </ion-item>
  <ion-item slot="content" v-if="images.length > 0">
    <image-thumbnail-viewer
        :images="images" @delete-event="emitInputChange($event, 'delete:image')"
    />
  </ion-item>
  <BaseButton slot="content" name="Save" @click="saveDataRequest"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">
#documentedMods {
  height: 2.4em;
  ion-buttons {
    justify-content: center;
    align-items: center;
    column-gap: .2em;
    ion-button {
      margin: 0;
    }
  }
}
#documentedModsFiles {
  ion-label {
    margin-bottom: 0;
  }
}
</style>
