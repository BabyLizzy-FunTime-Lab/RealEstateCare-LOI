import axios from "axios";
import {useLoginStore} from "@/stores/LoginStore.js";
import {toRaw} from "vue";
const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    /**
     * Upload parsed data to the JSON server.
     * 4 inspection types: damage_inspection, backlog_maintenance, technical_installation_inspection, modifications
     * @param {string} data
     * @param {string} inspectionType
     * @returns
     */
    const uploadToDataBase = async (data, inspectionType) => {
        console.log(data);
        const rawData = toRaw(data);
        const parsedData = JSON.parse(JSON.stringify(rawData));
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
