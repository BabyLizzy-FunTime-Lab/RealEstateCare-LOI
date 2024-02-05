<script>
import {
  IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonDatetimeButton, IonModal,
  IonRadioGroup, IonRadio, IonSelect, IonSelectOption, IonButton
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import BaseButton from "@/components/base/BaseButton.vue";


export default {
  name: "DamageInspection",
  components: {
    IonButton, BaseAccordionLayout, IonLabel, IonInput, IonItem, IonTextarea,
    IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, IonSelect,
    IonSelectOption, BaseButton
  },
  data() {
    return {
      inspectionInputData: {
        id: "",
        inspectorId: "",
        location: "",
        new_damage: "",
        complete_date: new Date().toISOString(),
        selected_damage_category: "",
        damage_category: "",
        emergency: "",
        description: "",
        images: []
      }
    }
  },
  props: {
    location: {
      type: String,
    },
    new_damage: {
      type: String,
    },
    complete_date: {
      type: String,
    },
    selected_damage_category: {
      type: String,
    },
    damage_category: {
      type: String,
    },
    emergency: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      default: [],
      required: false
    },
    saveData: {
      type: Function,
    },
    setDamageType: {
      type: Function
    }
  },
  methods: {
    emitInputChange($event, inputName) {
      this.$emit(inputName, $event);
    }
  },
  emits: ['location-change']
}
</script>

<template>
  <base-accordion-layout header-name="Damage Inspection" accordion-value="first">
  <ion-item slot="content">
    <ion-input label="Location"
               :value="location"
               @input="emitInputChange($event, 'location-change')"
               placeholder="Input address"
               label-placement="floating"
               type="text" />
  </ion-item>
  <ion-item slot="content">
    <ion-label>New Damage?</ion-label>
    <ion-radio-group :value="new_damage"
                     name="newDamage">
        <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>
        <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>
    </ion-radio-group>
  </ion-item>
<!--  <ion-item slot="content">-->
<!--    <ion-label>Date</ion-label>-->
<!--    <ion-datetime-button aria-label="Date" presentation="date" datetime="date"></ion-datetime-button>-->
<!--    <ion-modal :keep-contents-mounted="true">-->
<!--      <ion-datetime v-bind="complete_date"-->
<!--                    displayFormat="MMM D, YYYY"-->
<!--                    pickerFormat="MMM D YYYY"-->
<!--                    presentation="date" id="date"></ion-datetime>-->
<!--    </ion-modal>-->
<!--  </ion-item>-->
<!--  <ion-item slot="content">-->
<!--    <ion-select v-bind="selected_damage_category"-->
<!--                label="Damage Type" placeholder="Select" :ioChange="setDamageType">-->
<!--      <ion-select-option value="deliberately">Deliberately</ion-select-option>-->
<!--      <ion-select-option value="wear">Wear</ion-select-option>-->
<!--      <ion-select-option value="violence">Violence</ion-select-option>-->
<!--      <ion-select-option value="normal use">Normal Use</ion-select-option>-->
<!--      <ion-select-option value="calamity">Calamity</ion-select-option>-->
<!--      <ion-select-option value="other">Other</ion-select-option>-->
<!--    </ion-select>-->
<!--  </ion-item>-->
<!--  <ion-item slot="content" v-if="selected_damage_category === 'other'">-->
<!--    <ion-input v-bind="damage_category" label="Input damage type"-->
<!--               label-placement="floating" placeholder="Here" type="text"></ion-input>-->
<!--  </ion-item>-->
<!--  <ion-item slot="content">-->
<!--    <ion-label>Emergency Action needed?</ion-label>-->
<!--    <ion-radio-group v-bind="emergency"-->
<!--                     name="emergency">-->
<!--      <ion-radio aria-label="Yes" label-placement="start" justify="end" value="yes">Yes</ion-radio>-->
<!--      <ion-radio aria-label="No" label-placement="start" justify="end" value="no">No</ion-radio>-->
<!--    </ion-radio-group>-->
<!--  </ion-item>-->
<!--  <ion-item slot="content">-->
<!--    <ion-textarea label="Comments"-->
<!--                  v-bind="description"-->
<!--                  label-placement="floating"-->
<!--                  :auto-grow="true"-->
<!--                  placeholder="Enter your comments"></ion-textarea>-->
<!--  </ion-item>-->
<!--  <ion-item slot="content">-->
<!--    <ion-label>Photos</ion-label>-->
<!--    <ion-button color="primary">Take Photo</ion-button>-->
<!--  </ion-item>-->
  <BaseButton slot="content" name="Save" @click="saveData"/>
</base-accordion-layout>
</template>

<style scoped lang="scss">

</style>
