<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal,
  IonRadioGroup, IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PhotoViewer from "@/components/mediaViewers/PhotoViewer.vue";
import { modalController } from "@ionic/vue";
import { usePhotoCamera } from '@/services/usePhotoCamera.js';

const { takePhoto, newPhoto } = usePhotoCamera();

export default {
  name: "DamageInspection",
  components: {
    IonButton, BaseAccordionLayout, IonLabel, IonInput, IonItem, IonTextarea,
    IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, IonSelect,
    IonSelectOption, BaseButton, PhotoViewer, VueDatePicker
  },
  data() {
    return {
      newPhoto,
      takePhoto,
      readOnly: false,
      dateVue: null
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
        console.log(this.inspectionId);
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
    dateOnly() {
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
    <ion-input label="Date Vue" :readonly="readOnly" v-if="readOnly" :value="date" type="text" label-placement="floating"/>
    <ion-input label="Date Vue" v-if="!readOnly" :readonly="readOnly" :value="dateVue" type="text" label-placement="floating"/>
      <VueDatePicker
          v-model="dateVue" v-if="!readOnly" :teleport="true" @update:model-value="emitInputChange('update:date', dateVue)"
      />
<!--    <input type="date" v-model="dateVue"/>-->
  </ion-item>
<!--  <ion-item slot="content" lines="inset">-->
<!--    <ion-input label="Date" :readonly="readOnly" :value="dateOnly" v-if="readOnly" type="text" label-placement="floating"/>-->
<!--    <ion-label v-if="!readOnly">Date</ion-label>-->
<!--    <ion-datetime-button aria-label="Date" presentation="date" datetime="date" :disabled="readOnly" v-if="!readOnly"/>-->
<!--    <ion-modal :keep-contents-mounted="true">-->
<!--      <ion-datetime :value="date"-->
<!--                    @ionChange="emitInputChange('update:date', $event)"-->
<!--                    displayFormat="MMM D, YYYY"-->
<!--                    pickerFormat="MMM D YYYY"-->
<!--                    presentation="date"-->
<!--                    id="date"-->
<!--      />-->
<!--      <ion-button @click="dismissModal" >OK</ion-button>-->
<!--    </ion-modal>-->
<!--  </ion-item>-->
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
  <BaseButton
      v-if="!readOnlyProp && !readOnly"
      slot="content"
      name="Save"
      @click="emitInputChange('save:data')"
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
