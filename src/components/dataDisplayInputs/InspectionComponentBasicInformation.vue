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
      dateSelected: null,
      dynamicDatePickerHeight: 'inherit',
      dynamicDatePickerPadding: '1em'
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
    },
    pushSuccess: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitInputChange(eventName, data = null) {
      switch(eventName) {
        case "cancel:allUpdates":
            case "update:readOnlyToggle":
          this.readOnlyToggle();
          this.$emit(eventName);
          break;
        case "push:allUpdates":
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
      this.emitInputChange('push:allUpdates');
    },
    reset() {
      this.resetDatePicker();
      this.emitInputChange('reset:basicInformation');
    },
    setDatePickerStyleOpen() {
      if(this.useAsDataViewer) {
        console.log('setOpen')
        this.dynamicDatePickerHeight = '25em';
        this.dynamicDatePickerPadding = '0em';
        console.log(this.dynamicDatePickerHeight)
      } else {
        this.dynamicDatePickerHeight = '37em';
        this.dynamicDatePickerPadding = '0em';
      }
    },
    setDatePickerStyleClosed() {
      this.dynamicDatePickerHeight = '6em';
      this.dynamicDatePickerPadding = '1em';
    }
  },
  computed: {
    dateFilter() {
      return this.date.split('T')[0];
    },
    dynamicDatePickerStyles() {
      return {
        '--custom-datepicker-height': this.dynamicDatePickerHeight,
        '--custom-datepicker-padding': this.dynamicDatePickerPadding
      };
    },
  },
  watch: {
    resetDate(newValue, oldValue) {
      if(newValue === true) {
        this.resetDatePicker()
        newValue = oldValue;
      }
    },
    pushSuccess(newValue, oldValue) {
      if(newValue === true) {
        this.readOnlyToggle();
        this.$emit('reset:pushSuccess');
        newValue = oldValue;
      }
    }
  },
  mounted() {
    this.readOnly = this.useAsDataViewer
  },
  emits: [
    'update:date', 'update:address', 'save:data', 'update:readOnlyToggle',
    'push:allUpdates', 'cancel:updates', 'cancel:allUpdates', 'reset:basicInformation',
    'reset:pushSuccess'
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
    <ion-item class="datePicker--item" slot="content" lines="none" :style="dynamicDatePickerStyles">
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
          class="datePicker"
          placeholder="Click to pick a date."
          v-model="dateSelected"
          utc
          v-if="!readOnly"
          teleport-center
          @update:model-value="emitInputChange('update:date', dateSelected)"
          @open="setDatePickerStyleOpen"
          @closed="setDatePickerStyleClosed"
      />
    </ion-item>
    <BaseButton
        class="reset--button"
        v-if="useAsDataViewer && !readOnly"
        slot="content"
        name="Reset Basic Information"
        @click="reset"
    />
  </base-accordion-layout>
</template>

<style scoped lang="scss">
.datePicker--item {
  padding-bottom: var(--custom-datepicker-padding);
  height: var(--custom-datepicker-height);
  z-index: 1001;
}
.reset--button {
  margin-top: 1em;
}
</style>
