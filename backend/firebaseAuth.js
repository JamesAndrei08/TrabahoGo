import { FIREBASE_AUTH, FIRESTORE_DB } from "./FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register function
export async function registerUser({ email, password, firstName, lastName, phone }) {
  const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
  const user = userCredential.user;

  await setDoc(doc(FIRESTORE_DB, "accounts", user.uid), {
    uid: user.uid,
    email,
    firstName,
    lastName,
    phone,
    createdAt: new Date(),
  });

  return user;
}

// Login function
export async function loginUser({ email, password }) {
  const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
  const user = userCredential.user;

  // Optional: Fetch Firestore profile data
  const userDoc = await getDoc(doc(FIRESTORE_DB, "accounts", user.uid));
  const userData = userDoc.exists() ? userDoc.data() : null;

  return { user, userData };
}
