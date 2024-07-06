
import { ref } from 'vue';
// import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Camera, CameraResultType, CameraSource, } from '@capacitor/camera';

export const usePhotoCamera = () => {
    const photos = ref([]);
    const newPhoto= ref();

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = Date.now() + '.jpeg';
        const savedFileImage = {
            filepath: fileName,
            file: photo,
            webviewPath: photo.webPath,
        };

        photos.value = [savedFileImage, ...photos.value];
        newPhoto.value = savedFileImage;
        return newPhoto
    };

    return {
        newPhoto,
        photos,
        takePhoto,
    };
};

