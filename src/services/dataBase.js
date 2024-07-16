import axios from "axios";
import {useLoginStore} from "@/stores/LoginStore.js";
import clearViewData from "@/mixins/clearViewData.js";

const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    /**
     * Fetches all inspections for the current user.
     * @param user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchAllInspections = async (user_id) => {
        return axios.get( baseDbUrl + "/inspections?inspectorId=" + user_id)
            .then(result => {
                return result.data;
            }).catch(err => console.log(err));
    }
    /**
     * Fetches all inspections of type damage inspections.
     * @param user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchDamageInspections = async (user_id) => {
        return axios.get(baseDbUrl + "/damage_inspection?inspectorId=" + user_id)
            .then(result => {
                return result.data
            }).catch(err => console.log(err));
    }
    /**
     * Fetches all inspections of type backlog maintenance.
     * @param user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchBacklogMaintenance = async (user_id) => {
        return axios.get(baseDbUrl + "/backlog_maintenance?inspectorId=" + user_id)
            .then(result => {
                return result.data
            }).catch(err => console.log(err));
    }
    /**
     * Fetches all inspections of type modifications.
     * @param user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchModifications = async (user_id) => {
        return axios.get(baseDbUrl + "/modifications?inspectorId=" + user_id)
            .then(result => {
                return result.data
            }).catch(err => console.log(err));
    }
    /**
     * Fetches all inspections of type technical installations.
     * @param user_id
     * @returns {Promise<axios.AxiosResponse<any> | void>}
     */
    const fetchTechnicalInstallations = async (user_id) => {
        return axios.get(baseDbUrl + "/technical_installation_inspection?inspectorId=" + user_id)
            .then(result => {
                return result.data
            })
            .catch(err => console.log(err));
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
     * Upload parsed data to the JSON server.
     * Inspection types are: damage_inspection, backlog_maintenance, technical_installation_inspection, modifications
     * @param {object} sendData
     * @param {object || string} viewData
     * @param {string} inspectionType
     * @returns status
     */
    const uploadToDataBase = async (
        sendData,
        inspectionType,
        viewData = "Needed if sendData != viewData"
    ) => {
        // If there are images in the data, they must be converted to base64.
        let returnCode = "error";
        if(sendData.images.length > 0) {
            try {
                await convertImageArray(sendData.images).then(base64Array => {
                    sendData.images = base64Array;
                })
            } catch (err) {
                console.error('Error converting images: ', err);
                // throw err;
                returnCode = "error converting data";
                return returnCode;
            }
        }
        try {
            const result = await axios.post(`${baseDbUrl}/${inspectionType}`, sendData);
            console.log('Data uploaded: ', result);
            console.log(result.status);
            returnCode = result.status;
        } catch (err) {
            console.error('Error uploading: ', err);
            // throw err;
            returnCode = "error pushing data";
            return returnCode;
        }
        if(returnCode === 201 && typeof viewData != "string" ) {
            clearViewData.methods.clearViewData(viewData);
        } else if(returnCode === 201) {
            clearViewData.methods.clearViewData(sendData);
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
        uploadToDataBase,
        pushUpdatesToDataBase,
        fetchAllInspections,
        fetchDamageInspections,
        fetchBacklogMaintenance,
        fetchModifications,
        fetchTechnicalInstallations
    }
}
