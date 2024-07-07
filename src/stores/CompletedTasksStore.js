import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import axios from "axios";
import {useNotificationStore} from "@/stores/NotificationStore.js";
import {dataBase} from "@/services/dataBase.js";

const loginStore = useLoginStore();
const notificationStore = useNotificationStore();

const {pushUpdatesToDataBase} = dataBase()

// Default variables
const baseDbUrl = loginStore.fetchBaseDbUrl();

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
                        let result = this.fetchDamageInspections(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch damage inspections data."));
                        }
                    });
                    let backlogMaintenancePromise = new Promise((resolve, reject) => {
                        let result = this.fetchBacklogMaintenance(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch backlog maintenance data."));
                        }
                    });
                    let modificationsPromise = new Promise((resolve, reject) => {
                        let result = this.fetchModifications(user_id);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error("Failed to fetch backlog maintenance data."));
                        }
                    });
                    let technicalInstallationsPromise = new Promise((resolve, reject) => {
                        let result = this.fetchTechnicalInstallations(user_id);
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
        fetchDamageInspections(user_id) {
            return axios.get(baseDbUrl + "/damage_inspection?inspectorId=" + user_id)
                .then(result => {
                    return result.data
                }).catch(err => console.log(err));
        },
        fetchBacklogMaintenance(user_id) {
            return axios.get(baseDbUrl + "/backlog_maintenance?inspectorId=" + user_id)
                .then(result => {
                    return result.data
                }).catch(err => console.log(err));
        },
        fetchModifications(user_id) {
            return axios.get(baseDbUrl + "/modifications?inspectorId=" + user_id)
                .then(result => {
                    return result.data
                }).catch(err => console.log(err));
        },
        fetchTechnicalInstallations(user_id) {
            return axios.get(baseDbUrl + "/technical_installation_inspection?inspectorId=" + user_id)
                .then(result => {
                    return result.data
                }).catch(err => console.log(err));
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
                        case "date":
                            // Date must be accessed directly so it can be referenced properly.
                            this.allInspections.damageInspections[inspectionId].date = newValue;
                            break;
                        default:
                            inspection[propertyName] = newValue;
                    }
                }
            })
            console.log(allInspectionsOfType);
        },
        pushUpdatedData(inspectionId, inspectionType) {
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
                    notificationStore.setNotification(
                        `Data Update`,
                        `Message: ${response.statusText} (${response.status})`
                    )
                })
                .catch(err => {
                    console.log("Error while pushing update data to db", err);
                })
        },
        pushUpdatedDamageInspection(inspectionId) {
            // This should run to make the push to the database.
            let dataToSend = null;
            this.getAllInspections["damageInspections"].forEach(inspection => {
                if(inspection.id === inspectionId) {
                    dataToSend = inspection;
                }
            });
            pushUpdatesToDataBase("damage_inspection", inspectionId, dataToSend)
                .then(response => {
                    notificationStore.setNotification(
                                `Data Update`,
                                `Message: ${response.statusText} (${response.status})`
                            )
                })
                .catch(err => {
                    console.log("Error while pushing update data to db", err);
                })
        }
    },
    getters: {
        getAllInspections(state) {
            return state.allInspections;
        }
    }
})
