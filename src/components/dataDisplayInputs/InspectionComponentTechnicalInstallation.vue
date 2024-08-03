<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonButton, IonInput, IonItem, IonLabel, IonRadio, IonRadioGroup,
  IonSelect, IonSelectOption, IonTextarea,
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import DocumentViewer from "@/components/mediaViewers/DocumentViewer.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import {useLoginStore} from "@/stores/LoginStore.js";
import { usePhotoCamera } from '@/services/usePhotoCamera.js';

const { takePhoto } = usePhotoCamera();

export default {
  name: "TechnicalInstallationInspection",
  components: {
    IonButton, IonTextarea, IonRadio, IonRadioGroup,
    IonSelectOption, IonSelect, IonInput, BaseButton, BaseAccordionLayout,
    IonItem, IonLabel, DocumentViewer, PhotoViewer
  },
  data() {
    return {
      inspectionStore: useInspectionStore(),
      loginStore: useLoginStore(),
      procedure: {
        default: {
          name: "Procedure Test",
          url: "https://res.cloudinary.com/babylizzyevee/image/upload/v1710855728/CV-images/LOI-cursus/pdf/Emergency_Procedure.pdf"
        }
      },
      takePhoto,
      readOnly: false,
    }
  },
  props: {
    headerName: {
      type: String,
      default: "Technical Installation Inspection"
    },
    inspectionId: String,
    location: String,
    installationType: String,
    clientStatement: String,
    approved: String,
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
        case "reset:technicalInstallationInspection":
          this.$emit(eventName);
          break;
        default:
          this.$emit(eventName, data);
      }
      // if(eventName === "cancel:updates" || eventName === "save:dataUpdates") {
      //   this.readOnlyToggle();
      //   this.$emit(eventName);
      // } else {
      //   this.$emit(eventName, data);
      // }
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
    },
    takePhotoAction() {
      takePhoto().then(newImage => {
        this.$emit('update:images', newImage.value);
      })
    }
  },
  mounted() {
    this.readOnly = this.useAsDataViewer;
    // Here we fetch the 'Test Procedure' pdf document.
    this.loginStore.fetchBaseDocument("Test Procedure")
        .then(document => {
              this.procedure = document
            }
        )
        .catch(error => {
              console.log(error);
            }
        )
  },
  watch: {
    readOnlyTrigger(newValue) {
      this.readOnly = newValue;
    }
  },
  emits: [
    'update:images', 'delete:image', 'update:location', 'update:installationType',
    'update:clientStatement', 'update:approved', 'update:comments',
    'reset:technicalInstallationInspection'
  ]
}
</script>

<template>
<BaseAccordionLayout :header-name="headerName" :inspection-id="inspectionId">
  <ion-item slot="content">
    <ion-input label="Location"
               :value="location"
               :readonly="readOnly"
               @input="emitInputChange('update:location', $event)"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-select label="Installation type"
                :value="installationType"
                :disabled="readOnly"
                @ionChange="emitInputChange('update:installationType', $event)"
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
                  :readonly="readOnly"
                  @ionChange="emitInputChange('update:clientStatement', $event)"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter statement"/>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Approved</ion-label>
    <ion-radio-group :value="approved"
                     @ionChange="emitInputChange('update:approved', $event)"
                     name="newDamage">
      <ion-radio
          :disabled="readOnly"
          aria-label="Yes"
          label-placement="start"
          justify="end"
          value="yes">Yes</ion-radio>
      <ion-radio
          :disabled="readOnly"
          aria-label="No"
          label-placement="start"
          justify="end"
          value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <DocumentViewer slot="content" :document-info="procedure" />
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
      v-if="useAsDataViewer && !readOnly"
      slot="content"
      name="Reset Damage Inspection"
      @click="emitInputChange('reset:technicalInstallationInspection')"
  />
</BaseAccordionLayout>
</template>

<style scoped lang="scss">
.select-disabled, .item-select-disabled ion-label {
  opacity: 1;
}
.last--item {
  padding-bottom: 1em;
}
</style>
