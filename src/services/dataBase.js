import axios from "axios";
import { ref } from 'vue';
import {useLoginStore} from "@/stores/LoginStore.js";

const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    // allInspectionsBackup is a copy of the latest all inspections fetch results.
    const allInspectionsBackup = ref();
    /**
     * Fetches all inspections for the current user.
     * @param user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchAllInspections = async (user_id) => {
        return axios.get( baseDbUrl + "/inspections?inspectorId=" + user_id)
            .then(result => {
                allInspectionsBackup.value = result.data;
                return result.data;
            }).catch(err => console.log(err));
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
        let returnCode = "error";
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
            returnCode = result.status;
        } catch (err) {
            console.error('Error uploading: ', err);
            // throw err;
            returnCode = "error pushing data";
            return returnCode;
        }

        return returnCode;
    }
    /**
     * Pushes updates to a specific inspection entry.
     * @param {string} inspectionType
     * @param {string} inspectionId
     * @param {object} dataToSend
     * @return {object}
     */
    const pushUpdatesToDataBase = async (inspectionType, inspectionId, dataToSend) => {
    if(dataToSend.images.length > 0) {
        try {
            await convertImageArray(dataToSend.images).then(base64Array => {
                dataToSend.images = base64Array;
            })
        } catch (err) {
            console.error('Error converting images: ', err);
        }
    }
    try {
        const result = await axios.put(baseDbUrl + `/${inspectionType}/${inspectionId}`, dataToSend);
        console.log(result);
        return result;
    } catch (err) {
        console.error(err);
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
