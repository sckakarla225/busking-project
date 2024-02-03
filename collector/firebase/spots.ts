import { firestore, storage } from './firebase';
import { collection, addDoc, GeoPoint, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { Spot, MediaFile } from '../app/types';

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

const getSpotMedia = async (spotId: string) => {
    const mediaRef = ref(storage, `images/${spotId}/`);
    const mediaUrls: MediaFile[] = [];

    const { items } = await listAll(mediaRef);
    for (const item of items) {
        const url = await getDownloadURL(item);
        const decodedUrl = decodeURIComponent(url);
        const parts = decodedUrl.split('.');
        const lastPart = parts.pop();
        const extension = lastPart ? lastPart.split('?')[0] : '';
        const type = extension === 'mov' ? 'video' : 'image';
        mediaUrls.push({ url, type });
    }
    return mediaUrls;
};

const getAllSpots = async () => {
    const spots: Spot[] = [];
    const querySnapshot = await getDocs(collection(firestore, "spots"));
    querySnapshot.forEach(async (doc) => {
        const spotMediaUrls = await getSpotMedia(doc.id);
        const spot: Spot = {
            id: doc.id,
            name: doc.data().name,
            latitude: doc.data().coordinates._lat,
            longitude: doc.data().coordinates._long,
            mediaUrls: spotMediaUrls,
        };
        spots.push(spot);
    });
    console.log(spots);
    return spots;
};

const addSpotToList = async (spotInfo: Spot) => {};

export { 
    createSpot, 
    uploadSpotMedia, 
    getAllSpots, 
    getSpotMedia,
    addSpotToList,
};