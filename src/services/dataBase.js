import axios from "axios";
import { ref } from 'vue';
import {useLoginStore} from "@/stores/LoginStore.js";

const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    // allInspectionsBackup is a copy of the latest all inspections fetch results.
    const allInspectionsBackup = ref();
    const allInspections = ref([]);

    /**
     * Creates an array of inspection objects.
     * @param {array} db_data
     * @return {Promise|array}
     */
    const allInspectionsConstructor = async (db_data) => {
        class Inspection {
            constructor(
                id, inspectorId, date, address,
                damageInspection, backlogMaintenance, technicalInstallationInspection, modifications
            ) {
                this.id = id;
                this.inspectorId = inspectorId;
                this.date = date;
                this.address = address;
                this.damage_inspection = new DamageInspection(
                    damageInspection.location, damageInspection.newDamage, damageInspection.selectedDamageTypeOption,
                    damageInspection.damageType, damageInspection.emergency, damageInspection.comments,
                    damageInspection.images
                );
                this.backlog_maintenance = new BacklogMaintenance(
                    backlogMaintenance.location, backlogMaintenance.maintenanceType, backlogMaintenance.emergency,
                    backlogMaintenance.costIndication, backlogMaintenance.images
                );
                this.technical_installation_inspection = new TechnicalInstallationInspection(
                    technicalInstallationInspection.location, technicalInstallationInspection.installationType,
                    technicalInstallationInspection.clientStatement, technicalInstallationInspection.approved,
                    technicalInstallationInspection.comments, technicalInstallationInspection.images
                );
                this.modifications = new Modifications(
                    modifications.location, modifications.documentedModsDocName, modifications.documentedModsUrl,
                    modifications.modifiedBy, modifications.modDescription, modifications.requiredAction,
                    modifications.comments, modifications.images
                );
            }

        }

        class DamageInspection {
            constructor(location, newDamage, selectedDamageTypeOption, damageType, emergency, comments, images) {
                this.location = location;
                this.newDamage = newDamage;
                this.selectedDamageTypeOption = selectedDamageTypeOption;
                this.damageType = damageType;
                this.emergency = emergency;
                this.comments = comments;
                this.images = images;
            }
        }

        class BacklogMaintenance {
            constructor(location, maintenanceType, emergency, costIndication, images) {
                this.location = location;
                this.maintenanceType = maintenanceType;
                this.emergency = emergency;
                this.costIndication = costIndication;
                this.images = images;
            }
        }

        class TechnicalInstallationInspection {
            constructor(location, installationType, clientStatement, approved, comments, images) {
                this.location = location;
                this.installationType = installationType;
                this.clientStatement = clientStatement;
                this.approved = approved;
                this.comments = comments;
                this.images = images;
            }
        }

        class Modifications {
            constructor(location, documentedModsDocName, documentedModsUrl, modifiedBy, modDescription, requiredAction, comments, images) {
                this.location = location;
                this.documentedModsDocName = documentedModsDocName;
                this.documentedModsUrl = documentedModsUrl;
                this.modifiedBy = modifiedBy;
                this.modDescription = modDescription;
                this.requiredAction = requiredAction;
                this.comments = comments;
                this.images = images;
            }
        }
        db_data.forEach(dataObject => {
            let inspection = new Inspection (
                dataObject.id, dataObject.inspectorId, dataObject.date, dataObject.address,
                dataObject.damage_inspection, dataObject.backlog_maintenance,
                dataObject.technical_installation_inspection, dataObject.modifications
            )
            allInspections.value.push(inspection);
        })
        return allInspections.value;
    }
    /**
     * Fetches all inspections for the current user.
     * @param {string} user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchAllInspections = async (user_id) => {
        let inspectionsFromDB = await axios.get( baseDbUrl + "/inspections?inspectorId=" + user_id)
            .then(result => {
                // Here we reset the variables that will carry the information and return the fetched inspections
                // so they can be processed by the allInspectionsConstructor.
                allInspectionsBackup.value = result.data;
                allInspections.value = [];
                return result.data;
            }).catch(err => console.error("Inspection fetch failed", err));

        // Domain class constructor function.
        return await allInspectionsConstructor(inspectionsFromDB).then(inspections => {
            return inspections
        });
    }
    /**
     * Fetch blob from blob:URL obtained from useCamera.
     * @param {string} blobUrl
     * @returns {blob}
     */
    const fetchBlobFromUrl = async (blobUrl) => {
        const response = await fetch(blobUrl);
        if(!response.ok) {
            throw new Error('Failed to get blob from blob URL');
        }
        return await response.blob();
    }
    /**
     * Converts blob to a Base64 string
     * @param blob
     * @returns {Promise<unknown>}
     */
    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    /**
     * Converts an array of images into an array of base64 encoded images.
     * @param {array} rawImageArray
     * @return {Promise<*[]>}
     */
    const convertImageArray = async (rawImageArray) => {
        let base64Array = [];
        for await (const rawImage of rawImageArray) {
            let blob = await fetchBlobFromUrl(rawImage);
            // base64Array.push(await convertBlobToBase64(blob))
            await convertBlobToBase64(blob).then(base64Raw => {
                let filteredBase64String = base64Raw.substr(base64Raw.indexOf(',')+1);
                base64Array.push(`data:image/png;base64,${filteredBase64String}`);
            })
        }
        return base64Array;
    }
    /**
     * Check if data has images and starts the base64 conversion if images are found.
     * @param sendData
     * @param imageType
     * @returns {Promise<void>}
     */
    const processImages = async (sendData, imageType) => {
        if(sendData[imageType].images.length > 0) {
            try {
                await convertImageArray(sendData[imageType].images).then(base64Array => {
                    sendData[imageType].images = base64Array;
                })
            } catch (err) {
                console.error('Error converting images: ', err);
            }
        }
    }
    /**
     * Pushes the new inspection data to the database.
     * @param sendData
     * @returns {Promise<number|string>}
     */
    const pushInspectionToDataBase = async (sendData) => {
        // Process images.
        await processImages(sendData, "damage_inspection");
        await processImages(sendData, "backlog_maintenance");
        await processImages(sendData, "technical_installation_inspection");
        await processImages(sendData, "modifications");

        // Push data.
        try {
            const result = await axios.post(`${baseDbUrl}/inspections`, sendData);
            console.log('Data uploaded: ', result);
            console.log(result.status);
            return result.status;
        } catch (err) {
            console.error(`Error uploading, ${err.message}`, err);
            if(err.message === 'Request failed with status code 500') {
                return 'Too much data, please use smaller pictures.'
            } else {
                return err.message;
            }
        }
    }
    /**
     * Pushes updates to a specific inspection entry.
     * @param {string} inspectionId
     * @param {object} dataToSend
     * @return {object}
     */
    const pushUpdatesToDataBase = async (inspectionId, dataToSend) => {
        // Processing images.
        await processImages(dataToSend, "damage_inspection");
        await processImages(dataToSend, "backlog_maintenance");
        await processImages(dataToSend, "technical_installation_inspection");
        await processImages(dataToSend, "modifications");
        // Sending data.
        try {
            return await axios.put(baseDbUrl + `/inspections/${inspectionId}`, dataToSend);
        } catch (err) {
            console.error(`There was a problem while pushing to db, ${err.message}`,err);
            return err;
        }
    }
    return {
        allInspectionsBackup,
        pushUpdatesToDataBase,
        pushInspectionToDataBase,
        fetchAllInspections,
    }
}
