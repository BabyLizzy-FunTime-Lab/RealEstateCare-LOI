
import { ref, onMounted, watch } from 'vue';
// import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Camera, CameraResultType, CameraSource, } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export const usePhotoCamera = () => {
    const PHOTOS_STORAGE = 'photos';
    const photos = ref([]);
    const newPhoto= ref();

    const cachePhotos = () => {
        Preferences.set({
            key: PHOTOS_STORAGE,
            value: JSON.stringify(photos.value),
        })
    }
    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = Date.now() + '.jpeg';
        // const savedFileImage = {
        //     filepath: fileName,
        //     webviewPath: photo.webPath,
        // };
        const savedFileImage = await savePicture(photo, fileName);

        photos.value = [savedFileImage, ...photos.value];
        newPhoto.value = savedFileImage;
    };
    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    const savePicture = async (photo, fileName) => {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        const base64Data = await convertBlobToBase64(blob);

        // This should save the image to the specified Directory.
        // On windows, it saves the image to the IndexedDB of the browser.
        // try {
        //     await Filesystem.writeFile({
        //         path: fileName,
        //         data: base64Data,
        //         directory: Directory.Data,
        //     });
        // } catch (err) {
        //     console.error('Error saving file to Documents directory:', err);
        // }
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    };

    return {
        newPhoto,
        photos,
        takePhoto,
    };
};

