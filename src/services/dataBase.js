import axios from "axios";
import _ from 'lodash';
import {useLoginStore} from "@/stores/LoginStore.js";
const loginStore = useLoginStore();

const baseDbUrl = loginStore.fetchBaseDbUrl();

export const dataBase = () => {
    /**
     * Upload parsed data to the JSON server.
     * 4 inspection types: damage_inspection, backlog_maintenance, technical_installation_inspection, modifications
     * @param {object} data
     * @param {string} inspectionType
     * @returns
     */
    const uploadToDataBase = async (data, inspectionType) => {
        // Data arrives well.
        console.log(data);
        console.log(data.images);

        const rawData = _.cloneDeep(data);
        const rawImages = _.clone(data.images);
        rawData.images = rawImages;
        console.log(rawData);

        const parsedData = JSON.parse(JSON.stringify(rawData));
        // But in the stringify proses, the array with image urls turns out empty.
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
