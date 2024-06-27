import axios from "axios";
import {useLoginStore} from "@/stores/LoginStore.js";
import clearViewData from "@/mixins/clearViewData.js";

const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
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
    const uploadToDataBase = async (sendData, inspectionType, viewData = "Needed if sendData != viewData") => {
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

    return {
        uploadToDataBase
    }
}
