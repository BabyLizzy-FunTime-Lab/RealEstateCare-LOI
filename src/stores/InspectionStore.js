import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import axios from "axios";

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
            damageInspectionStagingData: {
                inspectorId: "",
                locationInput: "",
                newDamageInput: "",
                dateInput: new Date().toISOString(),
                selectedDamageTypeOption: "",
                damageTypeInput: "",
                emergencyInput: "",
                commentsInput: "",
                images: [
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1692352694/work-demos/island-house.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1692352694/work-demos/island-house.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1700140252/CV-images/real-estate-care.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1692352694/work-demos/island-house.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1692352694/work-demos/island-house.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1700140252/CV-images/real-estate-care.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1692352694/work-demos/island-house.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1692352694/work-demos/island-house.jpg",
                    "https://res.cloudinary.com/babylizzyevee/image/upload/v1700140252/CV-images/real-estate-care.jpg",
                ]
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
        updateDamageInspectionStagingData(data, inputName) {
            switch (inputName) {
                case 'location':
                    this.getDamageInspectionStagingData.locationInput = data;
                    break;
                case 'newDamage':
                    this.getDamageInspectionStagingData.newDamageInput = data;
                    break;
                case 'completeDate':
                    this.getDamageInspectionStagingData.dateInput = data;
                    break;
                case 'selectedDamageCategory':
                    this.getDamageInspectionStagingData.selectedDamageTypeOption = data;
                    if (data === 'other') {
                        this.getDamageInspectionStagingData.damageTypeInput = '';
                    } else {
                        this.getDamageInspectionStagingData.damageTypeInput = data;
                    }
                    break;
                case 'damageCategory':
                    this.getDamageInspectionStagingData.damageTypeInput = data;
                    break;
                case 'emergency':
                    this.getDamageInspectionStagingData.emergencyInput = data;
                    break;
                case 'description':
                    this.getDamageInspectionStagingData.commentsInput = data;
                    break;
                case 'image':
                    this.getDamageInspectionStagingData.images =
                        [data, ...this.getDamageInspectionStagingData.images];
                    console.log(this.getDamageInspectionStagingData.images);
                    break;
                default:
                    console.log("State variable not found");
            }
        },
       pushDamageInspectionStagingData() {
            // Images are saved with another function that returns the nessasery
            // medialinks on success. These links need to be added to the push data
            // before they go to the db.
            console.log("Pushing Damage Inspection data to database");
            // Adding user id to the data.
            this.getDamageInspectionStagingData.inspectorId = this.fetchUserId();
            console.log(this.getDamageInspectionStagingData);
            // Triggers alert, if no connection could be made to the db.
            // In that case the data needs to be saved localy.
           // seperate store for local saves.
       }
    },
    getters: {
        getDamageInspectionStagingData(state) {
            return state.damageInspectionStagingData;
        }
    }
})
