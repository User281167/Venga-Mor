/*
Agregar valores a cero en los campos donde el colaborador no tiene definido seguidoresCount | comentariosCount
Esto para agregar el filtro completo en el ranking
*/

import "dotenv/config";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldPath, getFirestore } from "firebase-admin/firestore";

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

const db = getFirestore();
const pageSize = 200;

type UpdateTarget = {
  seguidoresCount?: number;
  comentariosCount?: number;
};

async function run() {
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let scanned = 0;
  let updated = 0;
  let page = 0;

  while (true) {
    let query = db
      .collection("colaboradores")
      .orderBy(FieldPath.documentId())
      .limit(pageSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    if (snapshot.empty) break;

    page += 1;
    const batch = db.batch();
    let batchChanges = 0;

    for (const doc of snapshot.docs) {
      scanned += 1;

      const data = doc.data() as Record<string, unknown>;
      const updates: UpdateTarget = {};

      if (!Object.prototype.hasOwnProperty.call(data, "seguidoresCount")) {
        updates.seguidoresCount = 0;
      }

      if (!Object.prototype.hasOwnProperty.call(data, "comentariosCount")) {
        updates.comentariosCount = 0;
      }

      if (Object.keys(updates).length > 0) {
        batch.update(doc.ref, updates);
        batchChanges += 1;
        updated += 1;
      }
    }

    if (batchChanges > 0) {
      await batch.commit();
    }

    console.log(
      `Page ${page}: scanned ${snapshot.size}, updated ${batchChanges}, total updated ${updated}`,
    );

    lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
    if (snapshot.size < pageSize) break;
  }

  console.log(`Done. Scanned ${scanned}, updated ${updated}.`);
}

run().catch((error) => {
  console.error("Backfill failed:", error);
  process.exitCode = 1;
});
