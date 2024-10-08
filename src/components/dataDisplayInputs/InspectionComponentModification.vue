<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonButton, IonInput, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonTextarea, modalController, IonButtons
} from "@ionic/vue";
import pdfViewerModal from "@/components/mediaViewers/PdfViewerModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import { usePhotoCamera } from '@/services/usePhotoCamera.js';

const { takePhoto } = usePhotoCamera();

export default {
  name: "ModificationInspection",
  components: {
    IonButton, IonTextarea, IonSelectOption,
    IonSelect, BaseButton, IonInput, BaseAccordionLayout,
    IonItem, IonLabel, IonButtons, pdfViewerModal, PhotoViewer
  },
  data() {
    return {
      takePhoto,
      readOnly: false,
      showChoosePDF: false,
      isPdfModalOpen: false,
      pdfUrl: String,
    }
  },
  props: {
    headerName: {
      type: String,
      default: "Modifications"
    },
    documentedModsFile: {
      type: File,
      default: null
    },
    documentedModsDocName: null,
    documentedModsUrl: null,
    inspectionId: String,
    location: String,
    modifiedBy: String,
    modDescription: String,
    requiredAction: String,
    comments: String,
    images: {
      value: Array,
      default: [],
      required: false
    },
    useAsDataViewer: {
      type: Boolean,
      default: false
    },
    readOnlyTrigger: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitInputChange(eventName, data = null) {
      switch(eventName) {
        case "reset:modifications":
          this.$emit(eventName);
          break;
        default:
          this.$emit(eventName, data);
      }
    },
    emitNewPDF(eventName, data) {
      this.convertToBase64(data.target.files[0]).then(result => {
        this.pdfUrl = result;
        const dataObject = {
          file: data.target.files[0],
          url: this.pdfUrl
        }
        this.emitInputChange(eventName, dataObject);
        this.showChoosePDF = false
      })
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
        reader.readAsDataURL(file);
      });
    },
    toggleChoosePDF(setTo) {
      if(setTo === false || setTo === true) {
        this.showChoosePDF = setTo
      } else {
        this.toggleOnOff('showChoosePDF')
      }
    },
    toggleOnOff(dataVariableName) {
      this[dataVariableName] = !this[dataVariableName];
    },
    viewPDF() {
      this.isPdfModalOpen = true
      this.toggleChoosePDF(false);
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
      console.log("test")
    },
    takePhotoAction() {
      takePhoto().then(newImage => {
        this.$emit('update:images', newImage.value);
      })
    }
  },
  watch: {
    documentedModsUrl() {
      this.pdfUrl = this.documentedModsUrl;
    },
    readOnlyTrigger(newValue) {
      this.readOnly = newValue;
    }
  },
  computed: {
    pdfName() {
      // This finds the pdf name in the viewData
      if(this.documentedModsFile) {
        return this.documentedModsFile.name;
      } else if(this.documentedModsDocName) {
        return this.documentedModsDocName;
      } else if(this.documentedModsUrl) {
        return this.documentedModsUrl.substring(this.documentedModsUrl.lastIndexOf('/') + 1);
      }
      return "no title selected";
    }
  },
  mounted() {
    this.pdfUrl = this.documentedModsUrl;
    this.readOnly = this.useAsDataViewer;
  },
  emits: [
    'update:location', 'update:documentedMods', 'update:modDescription',
    'update:requiredAction', 'update:comments', 'update:modifiedBy',
    'update:images', 'delete:image', 'reset:modifications'
  ]
}
</script>

<template>
<BaseAccordionLayout :header-name="headerName" :inspection-id="inspectionId">
  <ion-item class="documentedMods" slot="content" lines="none">
    <ion-label class="custom-label" >Documented mods</ion-label>
    <ion-buttons class="documentedMods__button-container" v-if="documentedModsFile || documentedModsUrl">
      <BaseButton name="View" @click="viewPDF"/>
      <BaseButton v-if="!showChoosePDF && !readOnly" name="Update" @click="toggleChoosePDF"/>
    </ion-buttons>
  </ion-item>
  <ion-item class="documentedModsFiles" slot="content">
    <ion-label class="custom-label documentedModsFiles__label" v-if="documentedModsFile || documentedModsUrl">
      <h3>Selected PDF Title:</h3>
      <p>{{pdfName}}</p>
    </ion-label>
    <ion-input
        v-if="!documentedModsUrl || showChoosePDF"
        label="Upload PDF"
        label-placement="stacked"
        type="file"
        accept="application/pdf"
        @change="emitNewPDF('update:documentedMods', $event)"
    />
    <pdf-viewer-modal
        :pdf-url="pdfUrl"
        :pdf-file="documentedModsFile"
        :pdf-name="documentedModsDocName"
        :is-open="isPdfModalOpen"
        @close:modal="toggleOnOff('isPdfModalOpen')"
    />
  </ion-item>
  <ion-item slot="content">
    <ion-input
        label="Location"
        :readonly="readOnly"
        :value="location"
        @input="emitInputChange('update:location', $event)"
        placeholder="Input address"
        label-placement="floating"
        type="text"
    />
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="modifiedBy"
                :disabled="readOnly"
                @ionChange="emitInputChange('update:modifiedBy', $event)"
                label="Modified by"
                placeholder="Select">
      <ion-select-option value="tenant">Tenant</ion-select-option>
      <ion-select-option value="contractor">Contractor</ion-select-option>
      <ion-select-option value="unknown">Unknown</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea
        label="Mod description"
        placeholder="Enter the mod description"
        :readonly="readOnly"
        :value="modDescription"
        @ionChange="emitInputChange('update:modDescription', $event)"
        label-placement="floating"
        :auto-grow="true"
    />
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="requiredAction"
                :disabled="readOnly"
                @ionChange="emitInputChange('update:requiredAction', $event)"
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
    <ion-textarea
        label="Comments"
        :value="comments"
        :readonly="readOnly"
        @ionChange="emitInputChange('update:comments', $event)"
        label-placement="floating"
        :auto-grow="true"
        placeholder="Enter your comments"
    />
  </ion-item>
  <ion-item slot="content" lines="none" class="last--item">
    <ion-label class="custom-label">Photos</ion-label>
    <ion-button
        name="takePhoto"
        v-if="!readOnly"
        @click="takePhotoAction"
        color="primary">Take Photo</ion-button>
    <PhotoViewer
        v-if="images.length > 0"
        :read-only="readOnly"
        :photos="images"
        @delete-event="emitInputChange('delete:image', $event)"
    />
  </ion-item>
  <BaseButton
      name="Reset Modification Inspection"
      v-if="useAsDataViewer && !readOnly"
      slot="content"
      @click="emitInputChange('reset:modifications')"
  />
</BaseAccordionLayout>
</template>

<style scoped lang="scss">
.documentedMods {
  height: 2.4em;
  .documentedMods__button-container {
    justify-content: center;
    align-items: center;
    column-gap: .2em;
    ion-button {
      margin: 0;
    }
  }
}
.documentedModsFiles__label {
  margin-bottom: 0;
}
.select-disabled, .item-select-disabled .custom-label {
  opacity: 1;
}
.last--item {
  padding-bottom: 1em;
}
</style>
