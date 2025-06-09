import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvsEeB5cCnyjfDGvn7VvO-_PUbTnsZZpI",
  authDomain: "signpost4jobs-e758b.firebaseapp.com",
  projectId: "signpost4jobs-e758b",
  storageBucket: "signpost4jobs-e758b.firebasestorage.app",
  messagingSenderId: "1021676723626",
  appId: "1:1021676723626:web:3388f5234317164464dfd3",
  measurementId: "G-VP72LWRGWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage };
export default app;