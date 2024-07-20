import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import {useNotificationStore} from "@/stores/NotificationStore.js";
import {dataBase} from "@/services/dataBase.js";

const loginStore = useLoginStore();
const notificationStore = useNotificationStore();

const {
    pushUpdatesToDataBase,
    fetchAllInspections,
} = dataBase();

export const useCompletedTasksStore = defineStore('CompletedTasks', {
    state: () => {
        return {
            allInspections: Array,
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
        updateInspectionData(inspectionType, inspectionId, propertyName, newValue) {
            // This is needed to update the state.
            let allInspectionsOfType = this.getAllInspections[inspectionType];
            allInspectionsOfType.forEach(inspection => {
                // If propertyName is image we push the new image
                if(inspection.id === inspectionId) {
                    switch (propertyName) {
                        case "images":
                            inspection[propertyName].push(newValue);
                            break;
                        case "delete:image":
                            // If the image is found it is deleted.
                            if(inspection["images"].indexOf(newValue) !== -1) {
                                inspection["images"].splice(inspection["images"].indexOf(newValue), 1);
                            }
                            break;
                        case "documentedModsFile":
                            inspection['documentedModsDocName'] = newValue.file.name;
                            inspection['documentedModsUrl'] = newValue.url;
                            break;
                        default:
                            inspection[propertyName] = newValue;
                    }
                }
            })
            console.log(allInspectionsOfType);
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
