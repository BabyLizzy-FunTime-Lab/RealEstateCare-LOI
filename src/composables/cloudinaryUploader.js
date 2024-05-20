import { ref } from 'vue';
import axios from "axios";

export const cloudinaryUploader = () => {
    const cloudinaryResponse = ref([]);

    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });

    const cloudinaryFileUploader = async (fileArray, fileType) => {
        // Let's try the auto file type. This will have to process images and pdf's.
        const baseCloudinaryURL = "https://api.cloudinary.com/v1_1/babylizzyevee/image/upload";
        const uploadPreset = "lzahfxba";

        const uploadPromises = fileArray.map((file, index) => {
            convertBlobToBase64(file).then(res => {
                const formData = new FormData();
                console.log(res);
                formData.append('file', res.data);
                formData.append('upload_preset', uploadPreset);
                return axios.post(baseCloudinaryURL, formData);
            })

        })

        try {
            console.log("Pushing " + fileType + " array.");
            const responses = await Promise.all(uploadPromises);
            cloudinaryResponse.value = responses.map(response => response.data.secure_url);
        } catch (err) {
            console.error('Error uploading images to cloudinary: ', err);
        }

        // cloudinaryResponse.value = fileArray;
    }

    return {
        cloudinaryFileUploader,
        cloudinaryResponse
    }
}
