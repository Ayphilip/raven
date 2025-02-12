import { getDownloadURL, ref, storage, uploadBytes } from "../Components/firebaseConfig";


export const uploadMedia = async (file) => {
  const storageRef = ref(storage, `tweets/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};