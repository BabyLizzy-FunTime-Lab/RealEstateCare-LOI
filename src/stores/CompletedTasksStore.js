import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import {useNotificationStore} from "@/stores/NotificationStore.js";
import {dataBase} from "@/services/dataBase.js";
import {sanitizer} from "@/services/sanitizer.js";
import cloneDeep from 'lodash/cloneDeep';

const loginStore = useLoginStore();
const notificationStore = useNotificationStore();

const {
    allInspectionsBackup,
    pushUpdatesToDataBase,
    fetchAllInspections,
} = dataBase();

const {inputSanitizer} = sanitizer();

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
            try {
                if(loginStore.loginStatus) {
                  console.log("Fetching all inspections.");
                  loginStore.setLoadingStatus(true);
                  let user_id = this.fetchUserId();
                  let result = await fetchAllInspections(user_id);
                  loginStore.setLoadingStatus(false);
                  this.allInspectionsBackup = cloneDeep(allInspectionsBackup);
                  // Sorts all data in descending date order.
                  result.sort((a, b) => new Date(b.date) - new Date(a.date));
                  this.allInspections = result;
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
                newValue = newValue.target.value
                // Implement input sanitation.
                newValue = inputSanitizer(newValue);
            }
            if(typeof  newValue === 'string'
                && propertyName != 'delete:image') {
                // Implement input sanitation.
                console.log(newValue);
                newValue = inputSanitizer(newValue);
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
        },
        resetViewData(inspectionId, inspectionType) {
            const backupDataObject = this.allInspectionsBackup.find(( {id} ) => id === inspectionId);
            this.getAllInspections.forEach((inspection, index) => {
                if(inspection.id === inspectionId) {
                    console.log("Resetting Information");
                    switch (inspectionType) {
                        case 'all_data':
                            this.getAllInspections[index] = cloneDeep(backupDataObject);
                            break;
                        case 'basic_information':
                            inspection.date = backupDataObject.date;
                            inspection.address = backupDataObject.address;
                            break;
                        default:
                            inspection[inspectionType] = cloneDeep(backupDataObject[inspectionType]);
                    }
                }
            })
        },
        async pushUpdatedData(inspectionId) {
            // Start loading bar.
            loginStore.setLoadingStatus(true);
            // Getting the inspection that was updated.
            const dataToSend = this.getAllInspections.find(( {id} ) => id === inspectionId);
            let returnMessage = "";
            console.log("Pushing Inspection Updates.");
            // Starting push.
            await pushUpdatesToDataBase(inspectionId, dataToSend)
                .then(response => {
                    // Axios returns a different object when errors happen.
                    if(response.name === "AxiosError") {
                        // console.log(response);
                        returnMessage = "error";
                        // End loading bar.
                        loginStore.setLoadingStatus(false);
                        // Notify user.
                        notificationStore.setNotification(
                            `Inspection Update Failed`,
                            `Message: Images are too large`
                        )
                    }
                    if(response.status === 200) {
                        // console.log(response);
                        returnMessage = "success";
                        // End loading bar.
                        loginStore.setLoadingStatus(false);
                        // Notify user.
                        notificationStore.setNotification(
                            `Inspection Updated`,
                            `Message: ${response.statusText} (${response.status})`
                        )
                    }
                })
                .catch(err => {
                    returnMessage = "error";
                    // End loading bar.
                    loginStore.setLoadingStatus(false);
                    console.error("Error while pushing update data to db", err);
                    notificationStore.setNotification(
                        `Inspection Update Failed`,
                        'Problems connecting with database.'
                    )
                })
            return returnMessage;
        },
    },
    getters: {
        getAllInspections(state) {
            return state.allInspections;
        }
    }
})
