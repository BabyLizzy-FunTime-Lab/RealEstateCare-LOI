// We stage all taken pictures in the store before we save them locally or
// push them to the DB.
// Because this is a picture heavy app (we use pictures as evidence) we should
// minimize the amount of images that get stored locally.
// So we will only save images locally if no contact can be made with cloudinary.
// Once the images do get pushed, we will delete them locally.

import {Preferences} from "@capacitor/preferences";
import {watch} from "vue";
import {Directory, Filesystem} from "@capacitor/filesystem";

export const useLocalPhotoStorage = () => {
    // Could pass the state in like this with the help of an argument.
    const PHOTOS_STORAGE = 'photos';

    const cachePhotos = async () => {
        await Preferences.set({
            key: PHOTOS_STORAGE,
            value: JSON.stringify(photos.value),
        })
        const cache = await checkCache();
        console.log(cache.value);
    }

    const checkCache = async () => {
        const { value } = await Preferences.get({ key: PHOTOS_STORAGE });
        return {
            value
        }
    }

    const loadSaved = async () => {
        const photoList = await Preferences.get({ key: PHOTOS_STORAGE });
        const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

        for (const photo of photosInPreferences) {
            const file = await Filesystem.readFile({
                path: photo.filepath,
                directory: Directory.Data,
            });
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }

        photos.value = photosInPreferences;
    };

    // Not sure if I need this. But we could use this to watch the state for changes.
    // watch(photos, cachePhotos);

    // We should call the safe function like this within an async function.
    // const savedFileImage = await savePicture(photo, fileName);

    // Before the data can be saved, it needs to be converted to a Base64 format.
    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });

    // Then we can start the saving process.
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
        // Each photo is saved automatically when the const is created.
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory.
        // As long as savePhoto returns filename and photo.webPath the app will keep working
        // but it won't save locally.
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    };
}
