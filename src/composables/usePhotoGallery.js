
import { ref, onMounted, watch } from 'vue';
// import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Camera, CameraResultType, CameraSource, } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export const usePhotoGallery = () => {
    const photos = ref([]);
    let photo = Object;
    const takePhoto = async () => {
        photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
        });
    };
    const fileName = Date.now() + '.jpeg';
    const savedFileImage = {
        filepath: fileName,
        webviewPath: photo.webPath,
    };

    photos.value = [savedFileImage, ...photos.value];
    return {
        photos,
        takePhoto,
    };
};

// export let UserPhoto = {
//     filepath: String,
//     webviewPath: String
// }
