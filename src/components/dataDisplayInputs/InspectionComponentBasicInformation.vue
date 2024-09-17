<script>
import {
  IonItem, IonModal, IonContent, IonInput, IonTitle, IonButton, IonHeader, IonToolbar, IonButtons
} from "@ionic/vue";
import BaseAccordionLayout from "@/components/base/BaseAccordionLayout.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  name: "AddressDate",
  components: {
    IonButtons, IonToolbar, IonHeader, IonButton, IonTitle,
    BaseButton, BaseAccordionLayout, IonModal,
    VueDatePicker, IonItem, IonContent, IonInput
  },
  data() {
    return {
      readOnly: false,
      dateSelected: null,
      dynamicDatePickerHeight: 'inherit',
      dynamicDatePickerPadding: '1em',
      openCloseDatePicker: false,
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
    toggleDatePicker() {
      this.openCloseDatePicker = !this.openCloseDatePicker;
    },
    closeDatePicker() {
      this.openCloseDatePicker = false;
    }
  },
  computed: {
    dateFilter() {
      if(this.date) {
        return this.date.split('T')[0];
      } else {
        return null;
      }
    },
    datePickerModalButton() {
      if(this.date) {
        return "Ready";
      } else {
        return "Close";
      }
    }
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
    <ion-item class="datePicker--item" slot="content" lines="none">
      <ion-input
          label="Date"
          :readonly="true"
          :value="dateFilter"
          type="text"
          label-placement="floating"
      />
      <BaseButton v-if="!readOnly" name="Pick a Date" @click="toggleDatePicker"/>
      <ion-modal :is-open="openCloseDatePicker" can-dismiss="true" @did-dismiss="closeDatePicker">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title slot="start">Date select</ion-title>
            <ion-buttons slot="end">
              <ion-button
                  fill="solid"
                  color="secondary"
                  @click="toggleDatePicker">{{ datePickerModalButton }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <VueDatePicker
              text-input auto-apply
              :enable-time-picker="false"
              class="datePicker"
              :inline="{input:true}"
              v-model="dateSelected"
              utc
              @update:model-value="emitInputChange('update:date', dateSelected)"
              @closed="toggleDatePicker"
          />
        </ion-content>
      </ion-modal>
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
.dp__flex_display {
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 100%;
  row-gap: 1em;
}
.reset--button {
  margin-top: 1em;
}
</style>
