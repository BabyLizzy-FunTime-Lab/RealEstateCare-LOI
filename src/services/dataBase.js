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
    /**
     * Upload parsed data to the JSON server.
     * 4 inspection types: damage_inspection, backlog_maintenance, technical_installation_inspection, modifications
     * @param {string} viewData
     * @param {string} inspectionType
     * @returns
     */
    const uploadToDataBase = async (viewData, inspectionType) => {
        console.log(viewData);
        const cloudinaryUrls = await cloudinaryFileUploader(viewData.images, "image").then(res => {
            console.log(res);
        });
        const dataToSend = await updateViewDataImageURls(viewData, cloudinaryUrls);
        // const rawData = toRaw(data);
        const parsedData = JSON.parse(JSON.stringify(dataToSend));
        console.log(parsedData.images);
        try {
            await axios.post(`${baseDbUrl}/${inspectionType}`, parsedData).then(result => {
                console.log('Data uploaded: ', result);
                return result;
            });
        } catch (err) {
            console.error('Error uploading: ', err);
            throw err;
        }
    }

    return {
        uploadToDataBase
    }
}
