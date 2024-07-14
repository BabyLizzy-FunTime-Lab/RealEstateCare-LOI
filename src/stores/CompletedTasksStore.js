import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import {useNotificationStore} from "@/stores/NotificationStore.js";
import {dataBase} from "@/services/dataBase.js";

const loginStore = useLoginStore();
const notificationStore = useNotificationStore();

const {
    pushUpdatesToDataBase,
    fetchDamageInspections,
    fetchBacklogMaintenance,
    fetchModifications,
    fetchTechnicalInstallations
} = dataBase();

export const useCompletedTasksStore = defineStore('CompletedTasks', {
    state: () => {
        return {
            allInspections: Object,
        }
    },
    actions: {
        fetchUserId() {
            return loginStore.getUserInfo.id;
        },
        async fetchCompletedTasks() {
            let user_id = this.fetchUserId();
            if (user_id) {
                loginStore.setLoadingStatus(true);
                try {
                    let damageInspectionsPromise = new Promise((resolve, reject) => {
                        let result = fetchDamageInspections(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch damage inspections data."));
                        }
                    });
                    let backlogMaintenancePromise = new Promise((resolve, reject) => {
                        let result = fetchBacklogMaintenance(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch backlog maintenance data."));
                        }
                    });
                    let modificationsPromise = new Promise((resolve, reject) => {
                        let result = fetchModifications(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch backlog maintenance data."));
                        }
                    });
                    let technicalInstallationsPromise = new Promise((resolve, reject) => {
                        let result = fetchTechnicalInstallations(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch backlog maintenance data."));
                        }
                    });
                    let [
                        damageInspections,
                        backlogMaintenance,
                        modifications,
                        technicalInstallations
                    ] = await Promise.all([
                        damageInspectionsPromise,
                        backlogMaintenancePromise,
                        modificationsPromise,
                        technicalInstallationsPromise
                    ]);

                    let inspections = {
                        damageInspections,
                        backlogMaintenance,
                        modifications,
                        technicalInstallations
                    };
                    console.log("Fetched completed tasks of userId:" + user_id);
                    loginStore.setLoadingStatus(false);
                    this.allInspections = inspections;
                } catch (err) {
                    console.error("Error fetching completed tasks:", err);
                    loginStore.setLoadingStatus(false);
                    throw err; // Propagate the error
                }
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
