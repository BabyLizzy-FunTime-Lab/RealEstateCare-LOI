import axios from "axios";
import {useLoginStore} from "@/stores/LoginStore.js";
import {toRaw} from "vue";
const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    /**
     * This promise pauses the function for the given time.
     * @param {int} ms
     * @return {Promise<unknown>}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Fetch blob from blob:URL obtained from useCamera.
     * @param {String} blobUrl
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
     * 4 inspection types: damage_inspection, backlog_maintenance, technical_installation_inspection, modifications
     * @param {object} data
     * @param {array} imageArray
     * @param {string} inspectionType
     * @returns
     */
    const uploadToDataBase = async (data, inspectionType) => {
        // If there are images in the data, they must be converted to base64.
        if(data.images.length > 0) {
            await convertImageArray(data.images).then(base64Array => {
                data.images = base64Array;
            }).catch(err => {
                console.error('Error converting images: ', err);
                throw err;
            })
        }
        // await delay(4000);
        await console.log(data);
        await axios.post(`${baseDbUrl}/${inspectionType}`, data).then(result => {
            console.log('Data uploaded: ', result);
            return result;
        }).catch(err => {
            console.error('Error uploading: ', err);
            throw err;
        })
        // try {
        //     await delay(3000);
        //     await axios.post(`${baseDbUrl}/${inspectionType}`, data).then(result => {
        //         console.log('Data uploaded: ', result);
        //         return result;
        //     });
        // } catch (err) {
        //     console.error('Error uploading: ', err);
        //     throw err;
        // }
    }

    return {
        uploadToDataBase
    }
}
