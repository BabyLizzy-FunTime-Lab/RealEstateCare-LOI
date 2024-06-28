import {defineStore} from "pinia";
import {useLoginStore} from "@/stores/LoginStore.js";
import axios from "axios";
const loginStore = useLoginStore();

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
                    console.log(result.data);
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
        updateDamageInspection(newData) {
          // This is needed to update the state.
        },
        pushUpdatedDamageInspection(stateData) {
            // This should run to make the push to the database.
            return axios.put(baseDbUrl + "/damage_inspection?id=" + data.id, data).then(result => {
                console.log(result);
            })
        }
    },
    getters: {
        getAllInspections(state) {
            return state.allInspections;
        }
    }
})
