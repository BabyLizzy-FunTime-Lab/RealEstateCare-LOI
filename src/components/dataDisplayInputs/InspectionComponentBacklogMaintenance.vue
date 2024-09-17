<script>
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import {
  IonItem, IonInput, IonSelect, IonSelectOption, IonRadioGroup,
  IonLabel, IonRadio, IonButton,
} from "@ionic/vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import {useInspectionStore} from "@/stores/InspectionStore.js";
import { usePhotoCamera } from '@/services/usePhotoCamera.js';

const { takePhoto } = usePhotoCamera();

export default {
  name: "BacklogMaintenance",
  components: {
    IonButton, BaseButton, IonRadio, IonLabel, IonRadioGroup,
    BaseAccordionLayout, IonItem, IonInput, IonSelect, IonSelectOption, PhotoViewer
  },
  data() {
    return {
      inspectionStore: useInspectionStore(),
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
      if(eventName === "cancel:updates" || eventName === "save:dataUpdates") {
        this.readOnlyToggle();
        this.$emit(eventName);
      } else {
        this.$emit(eventName, data);
      }
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
    this.readOnly = this.useAsDataViewer
  },
  watch: {
    readOnlyTrigger(newValue) {
      this.readOnly = newValue;
    }
  },
  emits: [
    'update:images', 'delete:image', 'update:location', 'update:emergency',
    'update:maintenanceType', 'update:costIndication', 'reset:backlogMaintenance'
  ]
}
</script>

<template>
<BaseAccordionLayout :header-name="headerName" :inspection-id="inspectionId">
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
    <ion-label class="custom-label">Emergency Action needed?</ion-label>
    <ion-radio-group :value="emergency"
                     @ionChange="emitInputChange('update:emergency', $event)"
                     name="emergency">
      <ion-radio :disabled="readOnly" aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly" aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-select :value="maintenanceType"
                :disabled="readOnly"
                @ionChange="emitInputChange('update:maintenanceType', $event)"
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
                @ionChange="emitInputChange('update:costIndication', $event)"
                label="Cost Prediction"
                placeholder="Select">
      <ion-select-option value="0-500">0-500</ion-select-option>
      <ion-select-option value="500-1500">500-1500</ion-select-option>
      <ion-select-option value="1500+">1500+</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content" lines="none" class="last--item">
    <ion-label class="custom-label">Photos</ion-label>
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
      name="Reset Backlog Maintenance"
      @click="emitInputChange('reset:backlogMaintenance')"
  />
</BaseAccordionLayout>
</template>

<style scoped lang="scss">
.select-disabled, .item-select-disabled .custom-label {
  opacity: 1;
}
.last--item {
  padding-bottom: 1em;
}
</style>
