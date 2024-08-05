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
    useAsDataViewer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitInputChange(eventName, data = null) {
      switch(eventName) {
        case "cancel:allUpdates":
          case "save:allUpdates":
            case "update:readOnlyToggle":
          this.readOnlyToggle();
          this.$emit(eventName);
          break;
        case "reset:basicInformation":
          this.$emit(eventName);
          break;
        default:
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
      this.emitInputChange('push:allUpdates');
    },
    reset() {
      this.resetDatePicker();
      this.emitInputChange('reset:basicInformation');
    }
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
    this.readOnly = this.useAsDataViewer
  },
  computed: {
    dateFilter() {
      return this.date.split('T')[0];
    },
  },
  emits: [
    'update:date', 'update:address', 'save:data', 'update:readOnlyToggle',
    'push:allUpdates', 'cancel:updates', 'cancel:allUpdates', 'reset:basicInformation'
  ]
}
</script>

<template>
  <BaseButton
      v-if="useAsDataViewer && !readOnly"
      name="Cancel"
      button-color="danger"
      @click="cancelAllUpdates"
  />
  <BaseButton
      v-if="useAsDataViewer && !readOnly"
      name="Save Updates"
      @click="pushAllUpdates"
  />
  <BaseButton
      v-if="useAsDataViewer && readOnly"
      name="Update Information"
      @click="emitInputChange('update:readOnlyToggle')"
  />
  <BaseButton
      name="Save Inspection"
      v-if="!useAsDataViewer && !readOnly"
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
    <BaseButton
        v-if="useAsDataViewer && !readOnly"
        slot="content"
        name="Reset Basic Information"
        @click="reset"
    />
  </base-accordion-layout>
</template>

<style scoped lang="scss">
.last--item {
  padding-bottom: 1em;
}
</style>
