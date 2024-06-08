import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const loginOrRegister = async (email, password, profileImage, username) => {
  console.log(`Entering loginOrRegister ${email, password, profileImage, username}`, );
  try {
    console.log("Checking if user is already logged in");
    if (auth.currentUser) {
      // User is already logged in
      toast.info("User already logged in.");
      console.log("User already logged in.");
      return;
    }

    // Check if the user exists in Firestore by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // User exists, log them in
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } else {
      // User doesn't exist, register them
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(usersRef, userCredential.user.uid);
      await setDoc(userRef, {
        username,
        email,
        avatar: profileImage, // Using profileImage as the avatar URL
        id: userCredential.user.uid,
        blocked: [],
      });
      toast.success("User registered successfully!");

      await setDoc(doc(db, "userchats", userCredential.user.uid), {
        chats: [],
      });
    }
  } catch (error) {
    console.error("Error logging in or registering user:", error);
    toast.error("An error occurred. Please try again.");
  }
};

export { loginOrRegister };
