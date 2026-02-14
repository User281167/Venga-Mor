import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!getApps().length) {
  if (!projectId || !clientEmail || !privateKey || !databaseURL) {
    throw new Error("Firebase Admin env vars missing");
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
    databaseURL,
    storageBucket,
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminRealtime = getDatabase();
export const adminBucket = getStorage().bucket();
