<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonRadioGroup,
  IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import VueDatePicker from '@vuepic/vue-datepicker';
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
    IonSelectOption, BaseButton, PhotoViewer, VueDatePicker
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
      type: String,
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
    readOnlyProp: {
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
    saveAndResetDatePicker() {
      this.dateSelected = null;
      this.emitInputChange('save:data');
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
    this.readOnly = this.readOnlyProp
  },
  computed: {
    damageTypeBorder() {
      if (this.selectedDamageTypeOption === 'other') {
        return "none"
      } else {
        return "inset"
      }
    },
    dateFilter() {
      return  this.date.split('T')[0];
    }
  },
  watch: {

  },
  emits: [
      'update:location', 'update:newDamage', 'update:date',
      'update:selectedDamageTypeOption', 'update:damageType',
      'update:emergency', 'update:comments', 'update:images',
      'delete:image', 'cancel:updates', 'save:data', 'save:dataUpdates'
  ]
}
</script>

<template>
  <base-accordion-layout :header-name="headerName" :inspection-id="inspectionId">
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
    <ion-input label="Date" v-if="readOnly" :readonly="!readOnly" :value="dateFilter" type="text" label-placement="floating"/>
    <ion-label v-if="!readOnly" label-placement="floating">Date</ion-label>
    <VueDatePicker
        placeholder="Click to pick a date."
        v-model="dateSelected"
        utc
        v-if="!readOnly"
        :teleport="true"
        @update:model-value="emitInputChange('update:date', dateSelected)"
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
      <ion-radio :disabled="readOnly" aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly" aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
  <ion-item slot="content">
    <ion-label>Emergency Action needed?</ion-label>
    <ion-radio-group :value="emergency"
                     @ionChange="emitInputChange('update:emergency', $event)"
                     name="emergency">
      <ion-radio :disabled="readOnly" aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly" aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
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
  <ion-item slot="content" lines="none">
    <ion-label>Photos</ion-label>
    <ion-button v-if="!readOnly" name="takePhoto" @click="takePhotoAction" color="primary">Take Photo</ion-button>
  </ion-item>
  <ion-item  slot="content" v-if="images.length > 0">
    <PhotoViewer
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
      @click="cancelUpdatesAndResetDatePicker"
  />
  <BaseButton
      v-if="readOnlyProp && !readOnly"
      slot="content"
      name="Save Updates"
      @click="updateDataAndResetDatePicker"
  />
  <BaseButton
      v-if="readOnlyProp && readOnly"
      slot="content"
      name="Update Information"
      @click="readOnlyToggle"
  />
  <BaseButton
      v-if="!readOnlyProp && !readOnly"
      slot="content"
      name="Save"
      @click="saveAndResetDatePicker"
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

</style>
