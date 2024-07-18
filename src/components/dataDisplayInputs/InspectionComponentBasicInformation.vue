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
    id: String,
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
      if(eventName === "cancel:updates" || eventName === "save:dataUpdates") {
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
    'update:date', 'update:address', 'save:data', 'save:allDataUpdates'
  ]
}
</script>

<template>
  <BaseButton
      name="Save Inspection"
      @click="emitInputChange('save:data')"
  />
  <base-accordion-layout header-name="Basic Information" :inspection-id="id" value-given="first">
    <ion-item slot="content" v-if="readOnly">
      <ion-input label="inspection ID" :value="id" readonly type="text" label-placement="floating"/>
    </ion-item>
    <ion-item slot="content">
      <ion-input
          label="Address"
          v-if="!readOnly"
          :readonly="readOnlyProp"
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
          :readonly="readOnlyProp"
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
