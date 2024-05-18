import { ref } from 'vue';

export const uploaderToCloudinary = () => {
    const responseOfUploaderToCloudinary = ref([]);

    const fileUploaderToCloudinary = async (fileArray, fileType) => {
        console.log(fileArray + " " + fileType);
    }

    return {
        fileUploaderToCloudinary,
        responseOfUploaderToCloudinary
    }
}
