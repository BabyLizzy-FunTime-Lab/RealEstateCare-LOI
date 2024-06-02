import { ref } from 'vue';
import axios from "axios";

export const cloudinaryUploader = () => {
    const cloudinaryResponse = ref({
        sendImageCount: 0,
        responseUrls: []
    });
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

    /**
     * Returns the viewData updated with the given Array.
     * @param {Object} viewData
     * @param {Array} uploadedImagesToCloudinary
     * @returns {Promise<Object>}
     */
    const updateViewDataImageURls = async (viewData, uploadedImagesToCloudinary) => {
        viewData.images = uploadedImagesToCloudinary;
        return viewData;
    }

    /**
     * Uploads images or pdfs to cloudinary.
     * fileTypes are: image (for image upload) or raw (for pdf upload).
     * @param {Array} fileArray
     * @param {String} fileType
     */
    const cloudinaryFileUploader = async (fileArray, fileType) => {
        // Let's try the auto file type. This will have to process images and pdf's.
        const baseCloudinaryURL = "https://api.cloudinary.com/v1_1/babylizzyevee/" + fileType + "/upload";
        const uploadPresetImage = "lzahfxba";
        cloudinaryResponse.value.sendImageCount = fileArray.length;
        let responseUrls = [];

        const uploadPromises = fileArray.map((file) => {
            fetchBlobFromUrl(file)
                .then(res => convertBlobToBase64(res)
                    .then(result => {
                        const base64String = result.substr(result.indexOf(',')+1);
                        const formData = new FormData();
                        formData.append('file', `data:image/png;base64,${base64String}`);
                        formData.append('upload_preset', uploadPresetImage);
                        // axios.post(baseCloudinaryURL, formData).then((res) => {
                        //     console.log(res);
                        //     cloudinaryResponse.value.responseUrls.push(res.data.secure_url)
                        //     responseUrls.push(res.data.secure_url);
                        // });
                        return axios.post(baseCloudinaryURL, formData);
                    }))
                .catch(err => console.error(err));
        })
        // I'll return all the promises in an array and run them in the dataBase script.
        return uploadPromises;

        // try {
        //     console.log("Pushing " + fileType + " array.");
        //     // await Promise.all(uploadPromises).then(() => {
        //     //     console.log(responseUrls);
        //     //     return responseUrls;
        //     // })
        //     Promise.allSettled(uploadPromises).then((results) => {
        //         results.forEach((result) => {
        //             responseUrls.push(result.data.secure_url);
        //         })
        //         console.log(responseUrls);
        //         return responseUrls;
        //     })
        //     // console.log(cloudinaryResponse.value);
        //     // return cloudinaryResponse.value.responseUrls;
        // } catch (err) {
        //     console.error('Error uploading images to cloudinary: ', err);
        // }
    }

    return {
        cloudinaryFileUploader,
        updateViewDataImageURls
    }
}
