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
    readOnlyProp: {
      type: Boolean,
      default: false
    },
    saveDataRequest: {
      type: Function,
    },
  },
  methods: {
    emitInputChange(eventName, data = null) {
      if(eventName === "cancel:updates" || eventName === "save:dataUpdates") {
        this.readOnlyToggle();
        this.$emit(eventName);
      } else {
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
    this.readOnly = this.readOnlyProp;
  },
  emits: [
    'update:location', 'update:documentedMods', 'update:modDescription',
    'update:requiredAction', 'update:comments', 'update:modifiedBy',
    'update:images', 'delete:image', 'save:data', 'cancel:updates',
    'save:dataUpdates'
  ]
}
</script>

<template>
<BaseAccordionLayout :header-name="headerName" :inspection-id="inspectionId">
  <ion-item id="documentedMods" slot="content" lines="none">
    <ion-label >Documented mods</ion-label>
    <ion-buttons v-if="documentedModsFile || documentedModsUrl">
      <BaseButton name="View" @click="viewPDF()"/>
      <BaseButton v-if="!showChoosePDF && !readOnly" name="Update" @click="toggleChoosePDF"/>
    </ion-buttons>
  </ion-item>
  <ion-item id="documentedModsFiles" slot="content">
    <ion-label v-if="documentedModsFile || documentedModsUrl">
      <h3>Selected PDF Title:</h3>
      <p>{{pdfName}}</p>
    </ion-label>
    <ion-input  v-if="!documentedModsUrl || showChoosePDF"
        label="Upload PDF" label-placement="stacked"
        type="file" accept="application/pdf"
        @change="emitNewPDF('update:documentedMods', $event)"
    />
    <pdf-viewer-modal
        :pdf-url="pdfUrl" :pdf-file="documentedModsFile" :pdf-name="documentedModsDocName"
        :is-open="isPdfModalOpen" @close:modal="toggleOnOff('isPdfModalOpen')"
    />
  </ion-item>
  <ion-item slot="content">
    <ion-input label="Location"
               :readonly="readOnly"
               :value="location"
               @input="emitInputChange('update:location', $event)"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
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
    <ion-textarea label="Mod description"
                  :readonly="readOnly"
                  :value="modDescription"
                  @ionChange="emitInputChange('update:modDescription', $event)"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter the mod description"></ion-textarea>
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
    <ion-textarea label="Comments"
                  :value="comments"
                  :readonly="readOnly"
                  @ionChange="emitInputChange('update:comments', $event)"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter your comments"></ion-textarea>
  </ion-item>
  <ion-item slot="content" lines="none" class="last--item">
    <ion-label>Photos</ion-label>
    <ion-button v-if="!readOnly" name="takePhoto" @click="takePhotoAction" color="primary">Take Photo</ion-button>
    <PhotoViewer
        v-if="images.length > 0"
        :read-only="readOnly"
        :photos="images"
        @delete-event="emitInputChange('delete:image', $event)"
    />
  </ion-item>
  <BaseButton
      v-if="readOnlyProp && !readOnly"
      slot="content"
      name="Cancel"
      button-color="danger"
      @click="emitInputChange('cancel:updates')"
  />
  <BaseButton
      v-if="readOnlyProp && !readOnly"
      slot="content"
      name="Save Updates"
      @click="emitInputChange('save:dataUpdates')"
  />
  <BaseButton
      v-if="readOnlyProp && readOnly"
      slot="content"
      name="Update Information"
      @click="readOnlyToggle"
  />
<!--  <BaseButton-->
<!--      v-if="!readOnlyProp && !readOnly"-->
<!--      slot="content"-->
<!--      name="Save"-->
<!--      @click="emitInputChange('save:data')"-->
<!--  />-->
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
.select-disabled, .item-select-disabled ion-label {
  opacity: 1;
}
.last--item {
  padding-bottom: 1em;
}
</style>
