<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonRadioGroup,
  IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import { modalController } from "@ionic/vue";
import { usePhotoCamera } from '@/services/usePhotoCamera.js';

const { takePhoto } = usePhotoCamera();

export default {
  name: "DamageInspection",
  components: {
    IonButton, BaseAccordionLayout, IonLabel, IonInput,
    IonItem, IonTextarea, IonRadioGroup, IonRadio, IonSelect,
    IonSelectOption, BaseButton, PhotoViewer
  },
  data() {
    return {
      takePhoto,
      readOnly: false,
      dateSelected: null
    }
  },
  props: {
    headerName: {
      default: "Damage Inspection"
    },
    inspectionId: {
      type: String,
      default: ""
    },
    location: String,
    newDamage: String,
    date: null,
    selectedDamageTypeOption: String,
    damageType: String,
    emergency: String,
    comments: String,
    images: {
      value: Array,
      default: [],
      required: false
    },
    saveDataRequest: {
      type: Function,
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
        case "reset:damageInspection":
          this.$emit(eventName);
          break;
        default:
          this.$emit(eventName, data);
      }
    },
    async dismissModal() {
      await modalController.dismiss();
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
    },
    takePhotoAction() {
      takePhoto().then(newImage => {
        this.$emit('update:images', newImage.value);
      })
    },
    updateDataAndResetDatePicker() {
      this.dateSelected = null;
      this.emitInputChange('save:dataUpdates');
    },
    cancelUpdatesAndResetDatePicker() {
      this.dateSelected = null;
      this.emitInputChange('cancel:updates');
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
  computed: {
    damageTypeBorder() {
      if (this.selectedDamageTypeOption === 'other') {
        return "none"
      } else {
        return "inset"
      }
    },
    headerNameFilter() {
      if(this.headerName !== "Damage Inspections") {
        return this.headerName.split('T')[0];
      } else {
        return this.headerName;
      }
    }
  },
  emits: [
      'update:location', 'update:newDamage', 'update:date',
      'update:selectedDamageTypeOption', 'update:damageType',
      'update:emergency', 'update:comments', 'update:images',
      'delete:image', 'cancel:updates', 'save:data', 'save:dataUpdates',
      'reset:damageInspection'
  ]
}
</script>

<template>
  <base-accordion-layout :header-name="headerNameFilter" :inspection-id="inspectionId">
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
  <ion-item slot="content" :lines="damageTypeBorder">
    <ion-select :value="selectedDamageTypeOption"
                :disabled="readOnly"
                label="Damage Type"
                placeholder="Select"
                @ionChange="emitInputChange('update:selectedDamageTypeOption', $event)">
      <ion-select-option value="deliberately">Deliberately</ion-select-option>
      <ion-select-option value="wear">Wear</ion-select-option>
      <ion-select-option value="violence">Violence</ion-select-option>
      <ion-select-option value="normal use">Normal Use</ion-select-option>
      <ion-select-option value="calamity">Calamity</ion-select-option>
      <ion-select-option value="other">Other</ion-select-option>
    </ion-select>
  </ion-item>
  <ion-item slot="content" v-if="selectedDamageTypeOption === 'other'" lines="inset">
    <ion-input
        :value="damageType"
        :readonly="readOnly"
        @input="emitInputChange('update:damageType', $event)"
        aria-label="Input damage type"
        class="custom-placeholder"
        placeholder="Input damage type"
        type="text" slot="end"
    />
  </ion-item>
  <ion-item slot="content" class="newDamage-border" lines="inset">
    <ion-label>New Damage?</ion-label>
    <ion-radio-group :value="newDamage"
                     @ionChange="emitInputChange('update:newDamage', $event)"
                     name="newDamage">
      <ion-radio :disabled="readOnly"
                 aria-label="Yes"
                 label-placement="start"
                 justify="end"
                 value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly"
                 aria-label="No"
                 label-placement="start"
                 justify="end"
                 value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Emergency Action needed?</ion-label>
    <ion-radio-group :value="emergency"
                     @ionChange="emitInputChange('update:emergency', $event)"
                     name="emergency">
      <ion-radio :disabled="readOnly"
                 aria-label="Yes"
                 label-placement="start"
                 justify="end"
                 value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly"
                 aria-label="No"
                 label-placement="start"
                 justify="end"
                 value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-textarea label="Comments"
                  :readonly="readOnly"
                  :value="comments"
                  @ionChange="emitInputChange('update:comments', $event)"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter your comments"></ion-textarea>
  </ion-item>
  <ion-item slot="content" lines="none" class="last--item">
    <ion-label>Photos</ion-label>
    <ion-button v-if="!readOnly"
                name="takePhoto"
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
      v-if="useAsDataViewer && !readOnly"
      slot="content"
      name="Reset Damage Inspection"
      @click="emitInputChange('reset:damageInspection')"
  />
</base-accordion-layout>
</template>

<style scoped lang="scss">
.select-disabled, .item-select-disabled ion-label {
  opacity: 1;
}
.custom-placeholder {
  text-align: right;
}
.last--item {
  padding-bottom: 1em;
}
</style>
