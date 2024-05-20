<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal,
  IonRadioGroup, IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import { modalController } from "@ionic/vue";
import { usePhotoCamera } from '@/composables/usePhotoCamera.js';

const { takePhoto, newPhoto } = usePhotoCamera();

export default {
  name: "DamageInspection",
  components: {
    IonButton, BaseAccordionLayout, IonLabel, IonInput, IonItem, IonTextarea,
    IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, IonSelect,
    IonSelectOption, BaseButton, PhotoViewer
  },
  data() {
    return {
      newPhoto,
      takePhoto,
      readOnly: false
    }
  },
  props: {
    headerName: {
      type: String,
      default: "Damage Inspection"
    },
    inspectionId: String,
    location: String,
    newDamage: String,
    date: String,
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
    emitInputChange(data, eventName) {
      this.$emit(eventName, data);
    },
    async dismissModal() {
      await modalController.dismiss();
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
  computed: {
    damageTypeBorder() {
      if (this.selectedDamageTypeOption === 'other') {
        return "none"
      } else {
        return "inset"
      }
    }
  },
  emits: [
      'update:location', 'update:newDamage', 'update:date',
      'update:selectedDamageTypeOption', 'update:damageType',
      'update:emergency', 'update:comments', 'update:images', 'delete:image'
  ]
}
</script>

<template>
  <base-accordion-layout :header-name="headerName" :inspection-id="inspectionId">
  <ion-item slot="content">
    <ion-input label="Location"
               :readonly="readOnly"
               :value="location"
               @input="emitInputChange($event, 'update:location')"
               placeholder="Input address"
               label-placement="floating"
               type="text"/>
  </ion-item>
  <ion-item slot="content" lines="inset">
    <ion-label>Date</ion-label>
    <ion-datetime-button aria-label="Date" presentation="date" datetime="date"></ion-datetime-button>
    <ion-modal :keep-contents-mounted="true">
      <ion-datetime :value="date"
                    :readonly="readOnly"
                    @ionChange="emitInputChange($event, 'update:date')"
                    displayFormat="MMM D, YYYY"
                    pickerFormat="MMM D YYYY"
                    presentation="date" id="date"></ion-datetime>
      <ion-button @click="dismissModal" >OK</ion-button>
    </ion-modal>
  </ion-item>
  <ion-item slot="content" :lines="damageTypeBorder">
    <ion-select :value="selectedDamageTypeOption"
                :disabled="readOnly"
                label="Damage Type"
                placeholder="Select"
                @ionChange="emitInputChange($event, 'update:selectedDamageTypeOption')">
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
        @input="emitInputChange($event, 'update:damageType')"
        aria-label="Input damage type"
        class="custom-placeholder"
        placeholder="Input damage type"
        type="text" slot="end"
    />
  </ion-item>
  <ion-item slot="content" class="newDamage-border" lines="inset">
    <ion-label>New Damage?</ion-label>
    <ion-radio-group :value="newDamage"
                     @ionChange="emitInputChange($event, 'update:newDamage')"
                     name="newDamage">
      <ion-radio :disabled="readOnly" aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
      <ion-radio :disabled="readOnly" aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
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
    <ion-textarea label="Comments"
                  :readonly="readOnly"
                  :value="comments"
                  @ionChange="emitInputChange($event, 'update:comments')"
                  label-placement="floating"
                  :auto-grow="true"
                  placeholder="Enter your comments"></ion-textarea>
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
