<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import {
  IonItem, IonInput, IonSelect, IonSelectOption, IonRadioGroup,
  IonLabel, IonRadio, IonButton,
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, newPhoto } = usePhotoCamera();

export default {
  name: "BacklogMaintenance",
  components: {
    IonButton, BaseButton, IonRadio, IonLabel, IonRadioGroup,
    BaseAccordionLayout, IonItem, IonInput, IonSelect, IonSelectOption, PhotoViewer
  },
  data() {
    return {
      inspectionStore: useInspectionStore(),
      newPhoto,
      takePhoto,
      readOnly: false
    }
  },
  props: {
    headerName: {
      type: String,
      default: "Backlog Maintenance"
    },
    inspectionId: String,
    location: String,
    emergency: String,
    maintenanceType: String,
    costIndication: String,
    images: {
      value: Array,
      default: []
    },
    readOnlyProp: {
      type: Boolean,
      default: false
    },
    saveDataRequest: {
      type: Function
    },
  },
  methods: {
    emitInputChange(data, eventName) {
      this.$emit(eventName, data);
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
      console.log("test")
    }
  },
  watch: {
    newPhoto() {
      this.$emit('update:images', newPhoto.value);
    }
  },
  mounted() {
    this.readOnly = this.readOnlyProp
  },
  emits: [
      'update:images', 'delete:image', 'update:location', 'update:emergency',
      'update:maintenanceType', 'update:costIndication',
  ]
}
</script>

<template>
<BaseAccordionLayout :header-name="headerName" :inspection-id="inspectionId">
  <ion-item slot="content">
    <ion-input label="Location"
               :readonly="readOnly"
               :value="location"
               @input="emitInputChange($event, 'update:location')"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Emergency Action needed?</ion-label>
    <ion-radio-group :value="emergency"
                     @ionChange="emitInputChange($event, 'update:emergency')"
                     name="emergency">
      <ion-radio :disabled="readOnly" aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly" aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="maintenanceType"
                :disabled="readOnly"
                @ionChange="emitInputChange($event, 'update:maintenanceType')"
                label="Maintenance Type"
                placeholder="Select">
      <ion-select-option value="paint">Paint</ion-select-option>
      <ion-select-option value="wood">Wood Rot</ion-select-option>
      <ion-select-option value="electric">Electric</ion-select-option>
      <ion-select-option value="pipping">Pipping</ion-select-option>
      <ion-select-option value="glass">Glass</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="costIndication"
                :disabled="readOnly"
                @ionChange="emitInputChange($event, 'update:costIndication')"
                label="Cost Prediction"
                placeholder="Select">
      <ion-select-option value="0-500">0-500</ion-select-option>
      <ion-select-option value="500-1500">500-1500</ion-select-option>
      <ion-select-option value="1500+">1500+</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content" lines="none">
    <ion-label>Photos</ion-label>
    <ion-button v-if="!readOnly" name="takePhoto" @click="takePhoto" color="primary">Take Photo</ion-button>
  </ion-item>
  <ion-item  slot="content" v-if="images.length > 0">
    <PhotoViewer :read-only="readOnly" :photos="images" @delete-event="emitInputChange($event, 'delete:image')"/>
  </ion-item>
  <BaseButton v-if="readOnlyProp && !readOnly" slot="content" name="Cancel" button-color="danger" @click="readOnlyToggle"/>
  <BaseButton v-if="readOnlyProp && readOnly" slot="content" name="Update Information" @click="readOnlyToggle"/>
  <BaseButton v-if="!readOnly" slot="content" name="Save" @click="saveDataRequest"/>
</BaseAccordionLayout>
</template>

<style scoped lang="scss">
.select-disabled, .item-select-disabled ion-label {
  opacity: 1;
}
</style>
