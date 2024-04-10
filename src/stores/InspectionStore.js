import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import axios from "axios";
const loginStore = useLoginStore();

// Default variables.
// These should have a table in the data base and a fetch function in the loginStore.
// const baseDbUrl = loginStore.fetchBaseDbUrl();

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
                location: "",
                newDamage: "",
                date: new Date().toISOString(),
                selectedDamageTypeOption: "",
                damageType: "",
                emergency: "",
                comments: "",
                images: []
            },
            backlogMaintenanceViewData: {
                inspectorId: "",
                location: "",
                emergency: "",
                maintenanceType: "",
                costIndication: "",
                images: []
            },
            technicalInstallationViewData: {
                inspectorId: "",
                location: "",
                installationType: "",
                clientStatement: "",
                approved: "",
                comments: "",
                images: []
            },
            modificationsViewData: {
                inspectorId: "",
                documentedModsFile: null,
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
            return loginStore.getUserInfo.id;
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
        deletePhotoFromView(photoURI, viewData) {
            let findPhoto = viewData.images.indexOf(photoURI);
            if(findPhoto !== -1) {
                viewData.images.splice(findPhoto, 1);
            }
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
        updatePdfDocumentView(newDoc, viewData, propertyName) {
          // viewData[propertyName] = newDoc.target.files[0];
            viewData[propertyName] = newDoc;
        },
        updateDamageInspectionViewData(data, inputName) {
            console.log("Processing request: " + inputName);
            if(inputName === 'takePhoto' || inputName === 'deletePhoto' || inputName === 'selectedDamageCategory') {
                switch(inputName) {
                    case 'selectedDamageCategory':
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
                        this.unstageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getDamageInspectionViewData, inputName);
            }
        },
        updateBacklogMaintenanceViewData(data, inputName) {
            console.log('Processing request: ' + inputName);
            if(inputName === 'takePhoto' || inputName === 'deletePhoto') {
                switch(inputName) {
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
            } else {
                this.updateInputView(data, this.getBacklogMaintenanceViewData, inputName);
            }
        },
        updateTechnicalInstallationViewData(data, inputName) {
            console.log('Processing request: ' + inputName);
            if(inputName === 'takePhoto' || inputName === 'deletePhoto') {
                switch(inputName) {
                    case 'takePhoto':
                        this.addPhotoToView(data, this.getTechnicalInstallationViewData);
                        this.stageNewPhoto(data);
                        break;
                    case 'deletePhoto':
                        this.deletePhotoFromView(data, this.getTechnicalInstallationViewData);
                        this.unstageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getTechnicalInstallationViewData, inputName);
            }
        },
        updateModificationsViewData(data, inputName) {
            // I made the input names match the state names so I could experiment with
            // calling updateInputView in the ScheduledView parent component.
            console.log('Processing request: ' + inputName);
            if(inputName === 'takePhoto' || inputName === 'deletePhoto' || inputName === 'documentedModsFile') {
                switch (inputName) {
                    case 'documentedModsFile':
                        console.log('Staging pdf file in de state');
                        this.getModificationsViewData.documentedModsFile = data.file;
                        this.getModificationsViewData.documentedModsUrl = data.url;
                        break;
                    case 'takePhoto':
                        this.addPhotoToView(data, this.getModificationsViewData);
                        this.stageNewPhoto(data);
                        break;
                    case 'deletePhoto':
                        this.deletePhotoFromView(data, this.getModificationsViewData);
                        this.unstageNewPhoto(data);
                        break;
                    default:
                        console.log("Invalid Backlog input")
                }
            } else {
                this.updateInputView(data, this.getModificationsViewData, inputName);
            }
        },
       pushdamageInspectionViewData() {
            // Don't forget to fix the spelling of the method name.
            // Images are saved with another function that returns the nessasery cloudinary
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
        },
        getTechnicalInstallationViewData(state) {
            return state.technicalInstallationViewData;
        },
        getModificationsViewData(state) {
            return state.modificationsViewData;
        }
    }
})
