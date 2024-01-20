import { firestore, storage } from './firebase';
import { collection, addDoc, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { Spot } from '../app/types';

const createSpot = async (spotInfo: Spot) => {
    const location = new GeoPoint(spotInfo.latitude, spotInfo.longitude);
    const spotRef = await addDoc(collection(firestore, "spots"), {
        name: spotInfo.name,
        coordinates: location,
    });
    return spotRef.id;
};

const uploadSpotMedia = async (spotId: string, files: File[]) => {
    files.map(async (file: File) => {
        try {
            const storageRef = ref(storage, `images/${spotId}/${file.name}`);
            const fileSnapshot = await uploadBytes(storageRef, file);
            console.log(fileSnapshot.ref);
        } catch (e) {
            console.log(e);
            return "Fail";
        }
    });
    return "Success";
};

export { createSpot, uploadSpotMedia };