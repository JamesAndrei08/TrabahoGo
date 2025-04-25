import { FIREBASE_AUTH, FIRESTORE_DB } from "./FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register function with role and location
export async function registerUser({ email, password, firstName, lastName, phone, role, location }) {
  const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
  const user = userCredential.user;

  // Save into role-based collection
  await setDoc(doc(FIRESTORE_DB, `accounts_${role}`, user.uid), {
    uid: user.uid,
    email,
    firstName,
    lastName,
    phone,
    location,
    role,
    createdAt: new Date(),
  });

  return user;
}

export async function loginUser({ email, password }) {
  const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
  const user = userCredential.user;

  let docSnap;

  // Try fetching from accounts_worker
  let userRef = doc(FIRESTORE_DB, 'accounts_worker', user.uid);
  docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // If not in worker, try employer
    userRef = doc(FIRESTORE_DB, 'accounts_employer', user.uid);
    docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      throw new Error('No user document found in accounts_worker or accounts_employer');
    }
  }

  const userData = docSnap.data();

  return { user, userData };
}
