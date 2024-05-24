import { ref } from 'vue';
import axios from "axios";

export const cloudinaryUploader = () => {
    const cloudinaryResponse = ref([]);

    const fetchBlobFromUrl = async (blobUrl) => {
        const response = await fetch(blobUrl);
        if(!response.ok) {
            throw new Error('Failed to get blob from blob URL');
        }
        return await response.blob();
    }

    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });

    const cloudinaryFileUploader = async (fileArray, fileType) => {
        // Let's try the auto file type. This will have to process images and pdf's.
        const baseCloudinaryURL = "https://api.cloudinary.com/v1_1/babylizzyevee/" + fileType + "/upload";
        const uploadPresetImage = "lzahfxba";

        const uploadPromises = fileArray.map((file, index) => {
            fetchBlobFromUrl(file)
                .then(res => convertBlobToBase64(res)
                    .then(result => {
                        // console.log(result);
                        // console.log( result.substr(result.indexOf(',')+1) );
                        const base64String = result.substr(result.indexOf(',')+1);
                        const formData = new FormData();
                        formData.append('file', `data:image/png;base64,${base64String}`);
                        formData.append('upload_preset', uploadPresetImage);
                        axios.post(baseCloudinaryURL, formData).then((res) => {
                            cloudinaryResponse.value.push(res.data.secure_url)
                        });
                    }))
                .catch(err => console.error(err));
        })

        try {
            console.log("Pushing " + fileType + " array.");
            await Promise.all(uploadPromises);
            // console.log(cloudinaryResponse.value);
            return cloudinaryResponse.value;
        } catch (err) {
            console.error('Error uploading images to cloudinary: ', err);
        }
    }

    return {
        cloudinaryFileUploader,
        cloudinaryResponse
    }
}
