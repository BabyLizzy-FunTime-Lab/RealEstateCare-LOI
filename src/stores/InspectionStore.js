import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import axios from "axios";
import { usePhotoCamera} from "@/composables/usePhotoCamera.js";

const { photos } = usePhotoCamera();

// Default variables.
const baseDbUrl = "https://real-estate-care-json-1205608aa6ef.herokuapp.com";
const loginStore = useLoginStore();

export const useInspectionStore = defineStore('inspections', {
    state: () => {
        return {
            loadingStatus: false,
            damage_control_result: [],
            backlog_maintenance_result: [],
            technical_installation_inspections_result: [],
            inventory_of_changes_result: [],
            generalLocalPhotoStaging: [],
            damageInspectionViewData: {
                inspectorId: "",
                locationInput: "",
                newDamageInput: "",
                dateInput: new Date().toISOString(),
                selectedDamageTypeOption: "",
                damageTypeInput: "",
                emergencyInput: "",
                commentsInput: "",
                images: []
            },
            backlogMaintenanceViewData: {
                inspectorId: "",
                locationInput: "",
                emergencyInput: "",
                maintenanceTypeInput: "",
                costIndicationInput: "",
                images: []
            },
            technicalInstallationViewData: {
                inspectorId: "",
                locationInput: "",
                installationTypeInput: "",
                reportedFaultInput: "",
                testProcedureInput: "",
                approvedInput: "",
                commentsInput: ""
            },
            modificationsViewData: {
                inspectorId: "",
                historyRecordLink: "",
                locationInput: "",
                modifiedByInput: "",
                descriptionInput: "",
                necessaryActionInput: "",
                commentsInput: ""
            }
        }
    },
    actions: {
        fetchUserId() {
            return loginStore.getUserInfo.id;
        },
        fetchInspections() {
                this.loadingStatus = true;
                let user_id = this.fetchUserId();
                // call the independent fetch functions.
                this.fetchDamageInspections(user_id);
                this.fetchBacklogMaintenance(user_id);
                this.fetchModifications(user_id);
                this.fetchTechnicalInstallations(user_id);
                this.loadingStatus = false
            },
        fetchDamageInspections(user_id) {
            this.loadingStatus = true;
            axios.get(baseDbUrl + "/damage_inspection?inspectorId=" + user_id)
                .then(result => {
                    console.log("damage");
                    console.log(result.data);
                    this.loadingStatus = false
                })
        },
        fetchBacklogMaintenance(user_id) {
            this.loadingStatus = true;
            axios.get(baseDbUrl + "/backlog_maintenance?inspectorId=" + user_id)
                .then(result => {
                    console.log("backlog");
                    console.log(result.data);
                    this.loadingStatus = false
                })
        },
        fetchModifications(user_id) {
            this.loadingStatus = true;
            axios.get(baseDbUrl + "/modifications?inspectorId=" + user_id)
                .then(result => {
                    console.log("modifications");
                    console.log(result.data);
                    this.loadingStatus = false
                })
        },
        fetchTechnicalInstallations(user_id) {
            this.loadingStatus = true;
            axios.get(baseDbUrl + "/technical_installation_inspection?inspectorId=" + user_id)
                .then(result => {
                    console.log("technical installations");
                    console.log(result.data);
                    this.loadingStatus = false
                })
        },
        stageNewPhoto(newPhoto) {
            this.generalLocalPhotoStaging = [newPhoto, ...this.generalLocalPhotoStaging];
        },
        unstageNewPhoto(photoURI) {
            this.generalLocalPhotoStaging =
                this.generalLocalPhotoStaging.filter(photo => photo.webviewPath !== photoURI);
        },
        addPhotoToView(newPhoto, viewData) {
            viewData.images =
                [newPhoto.webviewPath, ...viewData.images];
        },
        updateInputView(newData, viewData, propertyName) {
            // This is a good spot to implement input validation.
            // If it recieved an event object, it will seek the target.value
            if(typeof newData === 'object' && newData !== null ) {
                viewData[propertyName] = newData.target.value
            } else {
                viewData[propertyName] = newData
            }
        },
        deletePhotoFromView(photoURI, viewData) {
            let findPhoto = viewData.images.indexOf(photoURI);
            if(findPhoto !== -1) {
                viewData.images.splice(findPhoto, 1);
            }
        },
        updateDamageInspectionViewData(data, inputName) {
            console.log("Processing request: " + inputName);
            switch (inputName) {
                case 'location':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'locationInput');
                    break;
                case 'newDamage':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'newDamageInput');
                    break;
                case 'completeDate':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'dateInput');
                    break;
                case 'selectedDamageCategory':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'selectedDamageTypeOption');
                    if (data.target.value === 'other') {
                        this.updateInputView('', this.getDamageInspectionViewData, 'damageTypeInput');
                    } else {
                        this.updateInputView(data, this.getDamageInspectionViewData, 'damageTypeInput');
                    }
                    break;
                case 'damageCategory':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'damagetypeInput');
                    break;
                case 'emergency':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'emergencyInput');
                    break;
                case 'description':
                    this.updateInputView(data, this.getDamageInspectionViewData, 'commentsInput');
                    break;
                case 'takePhoto':
                    this.addPhotoToView(data, this.getDamageInspectionViewData);
                    this.stageNewPhoto(data);
                    break;
                case 'deletePhoto':
                    this.deletePhotoFromView(data, this.getDamageInspectionViewData);
                    this.unstageNewPhoto(data);
                    break;
                default:
                    console.log("Invalid DamageInspection input");
            }
        },
        updateBacklogMaintenanceViewData(data, inputName) {
          console.log('Processing request: ' + inputName);
          switch (inputName) {
              case 'location':
                  this.updateInputView(data, this.getBacklogMaintenanceViewData, 'locationInput');
                  break;
              case 'emergency':
                  this.updateInputView(data, this.getBacklogMaintenanceViewData, 'emergencyInput');
                  break;
              case 'maintenanceType':
                  this.updateInputView(data, this.getBacklogMaintenanceViewData, 'maintenanceTypeInput');
                  break;
              case 'costIndication':
                  this.updateInputView(data, this.getBacklogMaintenanceViewData, 'costIndicationInput');
                  break;
              case 'takePhoto':
                  this.addPhotoToView(data, this.getBacklogMaintenanceViewData);
                  this.stageNewPhoto(data);
                  break;
              case 'deletePhoto':
                  this.deletePhotoFromView(data, this.getBacklogMaintenanceViewData);
                  this.unstageNewPhoto(data);
                  break;
              default:
                  console.log("Invalid Backlog input")
          }
        },
       pushdamageInspectionViewData() {
            // Images are saved with another function that returns the nessasery
            // medialinks on success. These links need to be added to the push data
            // before they go to the db. Images are only saved locally if no contact could be made
           // with the DB. So we will need a try and catch.
            console.log("Pushing Damage Inspection data to database");
            // Adding user id to the data.
            this.getDamageInspectionViewData.inspectorId = this.fetchUserId();
            console.log(this.getDamageInspectionViewData);
            // Triggers alert, if no connection could be made to the db.
            // In that case the data needs to be saved localy.
           // seperate store for local saves.
       }
    },
    getters: {
        getDamageInspectionViewData(state) {
            return state.damageInspectionViewData;
        },
        getGeneralLocalPhotoStaging(state) {
            return state.generalLocalPhotoStaging;
        },
        getBacklogMaintenanceViewData(state) {
            return state.backlogMaintenanceViewData;
        }
    }
})
