import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import {useNotificationStore} from "@/stores/NotificationStore.js";
import {dataBase} from "@/services/dataBase.js";
import cloneDeep from 'lodash/cloneDeep';

const loginStore = useLoginStore();
const notificationStore = useNotificationStore();

const {
    allInspectionsBackup,
    pushUpdatesToDataBase,
    fetchAllInspections,
} = dataBase();

export const useCompletedTasksStore = defineStore('CompletedTasks', {
    state: () => {
        return {
            allInspections: Array,
            allInspectionsBackup: Array
        }
    },
    actions: {
        fetchUserId() {
            return loginStore.getUserInfo.id;
        },
        async fetchAllCompletedTasks() {
            let user_id = this.fetchUserId();
            loginStore.setLoadingStatus(true);
            try {
              let result = await fetchAllInspections(user_id);
              if(user_id && result) {
                  loginStore.setLoadingStatus(false);
                  this.allInspectionsBackup = cloneDeep(allInspectionsBackup);
                  // Sorts all data in descending date order.
                  result.sort((a, b) => new Date(b.date) - new Date(a.date));
                  this.allInspections = result;
                  console.log(this.allInspections);
                  return result;
              } else {
                  loginStore.setLoadingStatus(false);
              }
            } catch (err) {
                console.error("Error fetching completed tasks:", err);
                loginStore.setLoadingStatus(false);
                throw err; // Propagate the error
            }
        },
        updateInspectionData(inspectionId, propertyName, newValue, inspectionType = null ) {
            // This is a good spot to implement input validation.
            // If it got an event object, it will seek the target.value
            if(typeof newValue === 'object'
                && propertyName != 'date'
                && propertyName != 'images'
                && propertyName != 'documentedModsFile') {
                console.log(newValue);
                newValue = newValue.target.value
            }
            // This is needed to update the state.
            console.log(newValue);
            let inspectionFound = false;
            let allInspectionsArray = this.getAllInspections;
            allInspectionsArray.forEach(inspection => {
                // If propertyName is image we push the new image
                if(inspection.id === inspectionId) {
                    inspectionFound = true;
                    if(inspectionType) {
                        switch (propertyName) {
                            case "images":
                                inspection[inspectionType][propertyName].push(newValue.webviewPath);
                                break;
                            case "delete:image":
                                // If the image is found it is deleted.
                                if(inspection[inspectionType]["images"].indexOf(newValue) !== -1) {
                                    inspection[inspectionType]["images"]
                                        .splice(inspection[inspectionType]["images"].indexOf(newValue), 1);
                                }
                                break;
                            case "documentedModsFile":
                                inspection[inspectionType]['documentedModsDocName'] = newValue.file.name;
                                inspection[inspectionType]['documentedModsUrl'] = newValue.url;
                                break;
                            default:
                                inspection[inspectionType][propertyName] = newValue;
                        }
                    } else {
                        inspection[propertyName] = newValue;
                    }
                }
            })
            if(!inspectionFound) {
                console.error("No inspection was found with id: " + inspectionId);
            }
            console.log(allInspectionsArray);
        },
        resetViewData(inspectionId, inspectionType) {
            const backupDataObject = this.allInspectionsBackup.find(( {id} ) => id === inspectionId);
            this.getAllInspections.forEach((inspection, index) => {
                if(inspection.id === inspectionId) {
                    switch (inspectionType) {
                        case 'all_data':
                            this.getAllInspections[index] = cloneDeep(backupDataObject);
                            // inspection = backupDataObject;
                            console.log(this.getAllInspections[index]);
                            break;
                        case 'basic_information':
                            console.log(backupDataObject);
                            inspection.date = backupDataObject.date;
                            inspection.address = backupDataObject.address;
                            break;
                        default:
                            inspection[inspectionType] = cloneDeep(backupDataObject[inspectionType]) ;
                            // Object.assign(inspection[inspectionType], backupDataObject[inspectionType])
                            console.log(inspection);
                    }
                }
            })
        },
        pushUpdatedData(inspectionId, inspectionType) {
            // Start loading bar.
            loginStore.setLoadingStatus(true);
            const dbInspectionTypes = {
                damageInspections: "damage_inspection",
                backlogMaintenance: "backlog_maintenance",
                modifications: "modifications",
                technicalInstallations: "technical_installation_inspection"
            }
            // This should run to make the push to the database.
            let dataToSend = null;
            this.getAllInspections[inspectionType].forEach(inspection => {
                if(inspection.id === inspectionId) {
                    dataToSend = inspection;
                }
            });
            pushUpdatesToDataBase(dbInspectionTypes[inspectionType], inspectionId, dataToSend)
                .then(response => {
                    // End loading bar.
                    loginStore.setLoadingStatus(false);
                    // Notify user.
                    notificationStore.setNotification(
                        `Data Update`,
                        `Message: ${response.statusText} (${response.status})`
                    )
                })
                .catch(err => {
                    // End loading bar.
                    loginStore.setLoadingStatus(false);
                    console.log("Error while pushing update data to db", err);
                })
        },
    },
    getters: {
        getAllInspections(state) {
            return state.allInspections;
        }
    }
})
