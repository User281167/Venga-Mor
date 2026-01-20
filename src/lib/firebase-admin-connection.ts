import admin from "firebase-admin";

const bucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: bucket,
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminBucket = admin.storage().bucket(bucket);
