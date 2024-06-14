import axios from "axios";
import {useLoginStore} from "@/stores/LoginStore.js";
import {cloudinaryUploader} from "@/services/cloudinaryUploader.js";
import {toRaw} from "vue";
const loginStore = useLoginStore();
const {
    cloudinaryFileUploader,
    updateViewDataImageURls,
    cloudinaryResponse
} = cloudinaryUploader();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        // const rawData = toRaw(data);
        // const parsedData = JSON.parse(JSON.stringify(rawData));
        // console.log(parsedData.images);
        // await delay(4000);
        await cloudinaryFileUploader(data.images, "image").then(uploadedImages => {
            data.images = uploadedImages;
            console.log(data);
        });
        await axios.post(`${baseDbUrl}/${inspectionType}`, data).then(result => {
            console.log('Data uploaded: ', result);
            return result;
        }).catch(err => {
            console.error('Error uploading: ', err);
            throw err;
        })
    }

    return {
        uploadToDataBase
    }
}
