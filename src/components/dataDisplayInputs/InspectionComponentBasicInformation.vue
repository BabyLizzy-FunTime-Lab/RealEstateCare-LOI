<script>
import {
  IonItem, IonLabel, IonInput
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  name: "AddressDate",
  components: {
    BaseButton, BaseAccordionLayout,
    VueDatePicker, IonItem, IonLabel, IonInput
  },
  data() {
    return {
      readOnly: false,
      dateSelected: null
    }
  },
  props: {
    inspectionId: String,
    address: String,
    date: null,
    resetDate: {
      type: Boolean,
      default: false
    },
    readOnlyProp: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitInputChange(eventName, data = null) {
      if(eventName === "cancel:allUpdates" || eventName === "save:allUpdates") {
        this.readOnlyToggle();
        this.$emit(eventName);
      } else {
        this.$emit(eventName, data);
      }
    },
    resetDatePicker() {
      this.dateSelected = null;
    },
    readOnlyToggle() {
      this.readOnly = !this.readOnly;
    },
    cancelAllUpdates() {
      this.resetDatePicker();
      this.emitInputChange('cancel:allUpdates');
    },
    pushAllUpdates() {
      this.resetDatePicker();
      this.emitInputChange('save:allUpdates');
    },
  },
  watch: {
    resetDate(newValue, oldValue) {
      if(newValue === true) {
        this.resetDatePicker()
        newValue = oldValue;
      }
    }
  },
  mounted() {
    this.readOnly = this.readOnlyProp
  },
  computed: {
    dateFilter() {
      return this.date.split('T')[0];
    },
  },
  emits: [
    'update:date', 'update:address', 'save:data',
    'save:allUpdates', 'cancel:updates', 'cancel:allUpdates'
  ]
}
</script>

<template>
  <BaseButton
      v-if="readOnlyProp && !readOnly"
      name="Cancel"
      button-color="danger"
      @click="cancelAllUpdates"
  />
  <BaseButton
      v-if="readOnlyProp && !readOnly"
      name="Save Updates"
      @click="pushAllUpdates"
  />
  <BaseButton
      v-if="readOnlyProp && readOnly"
      name="Update Information"
      @click="readOnlyToggle"
  />
  <BaseButton
      name="Save Inspection"
      v-if="!readOnlyProp && !readOnly"
      @click="emitInputChange('save:data')"
  />
  <base-accordion-layout header-name="Basic Information" value-given="first">
    <ion-item slot="content" v-if="readOnly">
      <ion-input
          label="inspection ID"
          :value="inspectionId"
          readonly
          type="text"
          label-placement="floating"
      />
    </ion-item>
    <ion-item slot="content">
      <ion-input
          label="Address"
          :readonly="readOnly"
          :value="address"
          @input="emitInputChange('update:address', $event)"
          type="text"
          label-placement="floating"
      />
    </ion-item>
    <ion-item class="last--item" slot="content" lines="none">
      <ion-input
          label="Date"
          v-if="readOnly"
          :readonly="readOnly"
          :value="dateFilter"
          type="text"
          label-placement="floating"
      />
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
  </base-accordion-layout>
</template>

<style scoped lang="scss">
.last--item {
  padding-bottom: 1em;
}
</style>
