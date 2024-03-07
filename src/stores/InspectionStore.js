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
            backlogMaintenance: {
                inspectorId: "",
                locationInput: "",
                maintenanceTypeInput: "",
                costIndication: ""
            },
            technicalInstallation: {
                inspectorId: "",
                locationInput: "",
                installationTypeInput: "",
                reportedFaultInput: "",
                testProcedureInput: "",
                approvedInput: "",
                commentsInput: ""
            },
            modifications: {
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
        updateDamageInspectionViewData(data, inputName) {
            console.log("Processing request: " + inputName);
            switch (inputName) {
                case 'location':
                    this.getDamageInspectionViewData.locationInput = data.target.value;
                    break;
                case 'newDamage':
                    this.getDamageInspectionViewData.newDamageInput = data.target.value;
                    break;
                case 'completeDate':
                    this.getDamageInspectionViewData.dateInput = data.target.value;
                    break;
                case 'selectedDamageCategory':
                    this.getDamageInspectionViewData.selectedDamageTypeOption = data.target.value;
                    if (data.target.value === 'other') {
                        this.getDamageInspectionViewData.damageTypeInput = '';
                    } else {
                        this.getDamageInspectionViewData.damageTypeInput = data.target.value;
                    }
                    break;
                case 'damageCategory':
                    this.getDamageInspectionViewData.damageTypeInput =data.target.value;
                    break;
                case 'emergency':
                    this.getDamageInspectionViewData.emergencyInput = data.target.value;
                    break;
                case 'description':
                    this.getDamageInspectionViewData.commentsInput = data.target.value;
                    break;
                case 'takePhoto':
                    this.getDamageInspectionViewData.images =
                        [data.webviewPath, ...this.getDamageInspectionViewData.images];
                    this.stageNewPhoto(data);
                    break;
                case 'deletePhoto':
                    let findPhoto = this.getDamageInspectionViewData.images.indexOf(data);
                    if(findPhoto !== -1) {
                        this.getDamageInspectionViewData.images.splice(findPhoto, 1);
                    }
                    this.unstageNewPhoto(data);
                    break;
                default:
                    console.log("State variable not found");
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
        }
    }
})
