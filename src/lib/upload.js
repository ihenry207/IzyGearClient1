import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { useUserStore } from "./userStore"; // Import useUserStore hook

const upload = async (file, chatId, onProgress) => {
  const date = new Date();
  const currentUser = useUserStore.getState().currentUser;
  const firebaseUid = currentUser?.id;
  
  if (!chatId) {
    throw new Error("Chat ID is required");
  }

  const storageRef = ref(storage, `${chatId}/${date +"_"+ file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject("Something went wrong!" + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default upload;