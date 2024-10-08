import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import {useNotificationStore} from "@/stores/NotificationStore.js";
import {dataBase} from "@/services/dataBase.js";
import cloneDeep from 'lodash/cloneDeep';
import clearViewData from "@/mixins/clearViewData.js";
import {sanitizer} from "@/services/sanitizer.js";

const {pushInspectionToDataBase} = dataBase();
const {inputSanitizer} = sanitizer();

export const useInspectionStore = defineStore('inspections', {
    state: () => {
        return {
            loadingStatus: false,
            damage_control_result: [],
            backlog_maintenance_result: [],
            technical_installation_inspections_result: [],
            inventory_of_changes_result: [],
            generalLocalPhotoStaging: [],
            basicInspectionViewData: {
                inspectionId: null,
                date: null,
                resetDate: false,
                address: null,
            },
            damageInspectionViewData: {
                location: "",
                newDamage: "",
                selectedDamageTypeOption: "",
                damageType: "",
                emergency: "",
                comments: "",
                images: []
            },
            backlogMaintenanceViewData: {
                location: "",
                emergency: "",
                maintenanceType: "",
                costIndication: "",
                images: []
            },
            technicalInstallationViewData: {
                location: "",
                installationType: "",
                clientStatement: "",
                approved: "",
                comments: "",
                images: []
            },
            modificationsViewData: {
                documentedModsFile: null,
                documentedModsDocName: null,
                documentedModsUrl: null,
                location: "",
                modifiedBy: "",
                modDescription: "",
                requiredAction: "",
                comments: "",
                images: []
            }
        }
    },
    actions: {
        fetchUserId() {
            // Lazy loading loginStore.
            const loginStore = useLoginStore();
            return loginStore.getUserInfo.id;
        },
        stageNewPhoto(newPhoto) {
            this.generalLocalPhotoStaging = [newPhoto, ...this.generalLocalPhotoStaging];
        },
        unStageNewPhoto(photoURI) {
            this.generalLocalPhotoStaging =
                this.generalLocalPhotoStaging.filter(photo => photo.webviewPath !== photoURI);
        },
        addPhotoToView(newPhoto, viewData) {
            viewData.images =
                [newPhoto.webviewPath, ...viewData.images];
        },
        deletePhotoFromView(photoURI, viewData) {
            let findPhoto = viewData.images.indexOf(photoURI);
            if(findPhoto !== -1) {
                viewData.images.splice(findPhoto, 1);
            }
        },
        clearViewInputs() {
            clearViewData.methods.clearViewData(
                [
                    this.getBasicInspectionViewData,
                    this.getDamageInspectionViewData,
                    this.getBacklogMaintenanceViewData,
                    this.getTechnicalInstallationViewData,
                    this.getModificationsViewData
                ]
            );
            console.log("clearing inputs.")
        },
        updateInputView(newData, viewData, propertyName) {
            // If it received an event object, it will seek the target.value
            // Text inputs are sanitized of special characters.
            if(typeof newData === 'object' && newData !== null && propertyName != "date") {
                viewData[propertyName] = inputSanitizer(newData.target.value);
            } else {
                viewData[propertyName] = inputSanitizer(newData);
            }
        },
        updateDateViewData(newData) {
            this.getBasicInspectionViewData.date = newData;
        },
        updateAddressViewData(newData) {
            // The address is sanitized of special characters.
            this.getBasicInspectionViewData.address = inputSanitizer(newData.target.value);
        },
        updateDamageInspectionViewData(data, inputName) {
            if(inputName === 'takePhoto' || inputName === 'deletePhoto' || inputName === 'selectedDamageTypeOption') {
                switch(inputName) {
                    case 'selectedDamageTypeOption':
                        this.updateInputView(data, this.getDamageInspectionViewData, 'selectedDamageTypeOption');
                        if (data.target.value === 'other') {
                            this.updateInputView('', this.getDamageInspectionViewData, 'damageType');
                        } else {
                            this.updateInputView(data, this.getDamageInspectionViewData, 'damageType');
                        }
                        break;
                    case 'takePhoto':
                        this.addPhotoToView(data, this.getDamageInspectionViewData);
                        this.stageNewPhoto(data);
                        break;
                    case 'deletePhoto':
                        this.deletePhotoFromView(data, this.getDamageInspectionViewData);
                        this.unStageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getDamageInspectionViewData, inputName);
            }
        },
        updateBacklogMaintenanceViewData(data, inputName) {
            if(inputName === 'takePhoto' || inputName === 'deletePhoto') {
                switch(inputName) {
                    case 'takePhoto':
                        this.addPhotoToView(data, this.getBacklogMaintenanceViewData);
                        this.stageNewPhoto(data);
                        break;
                    case 'deletePhoto':
                        this.deletePhotoFromView(data, this.getBacklogMaintenanceViewData);
                        this.unStageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getBacklogMaintenanceViewData, inputName);
            }
        },
        updateTechnicalInstallationViewData(data, inputName) {
            if(inputName === 'takePhoto' || inputName === 'deletePhoto') {
                switch(inputName) {
                    case 'takePhoto':
                        this.addPhotoToView(data, this.getTechnicalInstallationViewData);
                        this.stageNewPhoto(data);
                        break;
                    case 'deletePhoto':
                        this.deletePhotoFromView(data, this.getTechnicalInstallationViewData);
                        this.unStageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getTechnicalInstallationViewData, inputName);
            }
        },
        updateModificationsViewData(data, inputName) {
            if(inputName === 'takePhoto' || inputName === 'deletePhoto' || inputName === 'documentedModsFile') {
                switch (inputName) {
                    case 'documentedModsFile':
                        console.log('Staging pdf file in de state');
                        this.getModificationsViewData.documentedModsFile = data.file;
                        this.getModificationsViewData.documentedModsDocName = data.file.name;
                        this.getModificationsViewData.documentedModsUrl = data.url;
                        break;
                    case 'takePhoto':
                        this.addPhotoToView(data, this.getModificationsViewData);
                        this.stageNewPhoto(data);
                        break;
                    case 'deletePhoto':
                        this.deletePhotoFromView(data, this.getModificationsViewData);
                        this.unStageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getModificationsViewData, inputName);
            }
        },
        // Here we bring the data together and pass it to the uploadToDataBase method.
        pushInspectionViewData() {
            // Lazy loading stores.
            const loginStore = useLoginStore();
            const notificationStore = useNotificationStore();

            loginStore.setLoadingStatus(true);
            console.log("Pushing New Inspection.");
            // Remove documentedModsFile from modifications before push.
            const dataCopy = cloneDeep(this.getModificationsViewData);
            const {documentedModsFile, ...readyToSendModificationsData} = dataCopy;
            // The id is provided by the database when the data is received.
            const sendData = {
                "id": "",
                "inspectorId": this.fetchUserId(),
                "date": this.getBasicInspectionViewData.date,
                "address": this.getBasicInspectionViewData.address,
                "damage_inspection": this.getDamageInspectionViewData,
                "backlog_maintenance": this.getBacklogMaintenanceViewData,
                "technical_installation_inspection": this.getTechnicalInstallationViewData,
                "modifications": readyToSendModificationsData
            }
            // Push can't continue without address and date information.
            if(sendData.date && sendData.address) {
                pushInspectionToDataBase(sendData).then(result => {
                    if(result === 201) {
                        // End loading bar.
                        loginStore.setLoadingStatus(false);
                        // Once the push is complete, empty the inputs and notify success.
                        notificationStore.setNotification("Data save", "Success!");
                        this.clearViewInputs();
                    } else {
                        // End loading bar.
                        loginStore.setLoadingStatus(false);
                        notificationStore.setNotification("Save failed", result);
                        // Triggers alert, if no connection could be made to the db.
                        // In that case the data needs to be saved locally.
                    }
                })
                    .catch(err => {
                        loginStore.setLoadingStatus(false);
                        console.log("Error while pushing data to db", err);
                    })
            } else {
                // End loading bar.
                loginStore.setLoadingStatus(false);
                // Push can't continue without address and date information.
                notificationStore.setNotification(
                    "Missing data",
                    "Please enter Basic Information before saving."
                );
            }
        }
    },
    getters: {
        getBasicInspectionViewData(state) {
          return state.basicInspectionViewData;
        },
        getDamageInspectionViewData(state) {
            return state.damageInspectionViewData;
        },
        getGeneralLocalPhotoStaging(state) {
            return state.generalLocalPhotoStaging;
        },
        getBacklogMaintenanceViewData(state) {
            return state.backlogMaintenanceViewData;
        },
        getTechnicalInstallationViewData(state) {
            return state.technicalInstallationViewData;
        },
        getModificationsViewData(state) {
            return state.modificationsViewData;
        }
    }
})
