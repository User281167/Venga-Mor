import { setGlobalOptions } from "firebase-functions";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

admin.initializeApp();
setGlobalOptions({
  maxInstances: 3,
  memory: "256MiB", // mínimo, tus funciones son ligeras
  timeoutSeconds: 60,
});
const db = getFirestore();

export const onFollowCreated = onDocumentCreated(
  "colaboradores/{collaboradorId}/seguidores/{seguidorId}",
  async (event) => {
    const collaboradorId = event.params.collaboradorId;
    const userRef = db.doc(`colaboradores/${collaboradorId}`);

    await userRef.update({
      seguidoresCount: admin.firestore.FieldValue.increment(1),
    });
  },
);

export const onFollowDeleted = onDocumentDeleted(
  "colaboradores/{collaboradorId}/seguidores/{seguidorId}",
  async (event) => {
    const collaboradorId = event.params.collaboradorId;
    const colabRef = db.doc(`colaboradores/${collaboradorId}`);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(colabRef);
      const actual = snap.data()?.seguidoresCount ?? 0;

      tx.update(colabRef, {
        seguidoresCount: Math.max(0, actual - 1),
      });
    });
  },
);

// Comentarios contador por perfil de colaborador
// Doc comentarios/id usar campo colaborador_id
export const onCommentCreated = onDocumentCreated(
  "comentarios/{comentarioId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const { colaborador_id } = snap.data();
    const colabRef = db.doc(`colaboradores/${colaborador_id}`);

    await colabRef.update({
      comentariosCount: admin.firestore.FieldValue.increment(1),
    });
  },
);

export const onCommentDeleted = onDocumentDeleted(
  "comentarios/{comentarioId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const { colaborador_id } = snap.data();
    const colabRef = db.doc(`colaboradores/${colaborador_id}`);

    await db.runTransaction(async (tx) => {
      const colabSnap = await tx.get(colabRef);
      const actual = colabSnap.data()?.comentariosCount ?? 0;

      tx.update(colabRef, {
        comentariosCount: Math.max(0, actual - 1),
      });
    });
  },
);

// Raiting calcular estrellas y media de estrellas
/*
En colabroadores

rating: {
  promedio: number
  total: number
  conteo: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
*/
function calcularPromedio(total, conteo) {
  let suma = 0;

  for (let i = 1; i <= 5; i++) {
    suma += (conteo[i] || 0) * i;
  }

  return total === 0 ? 0 : Number((suma / total).toFixed(1));
}

export const onRatingCreate = onDocumentCreated(
  "ratings/{ratingId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const { colaboradorId, valor } = snap.data();

    const colabRef = admin
      .firestore()
      .collection("colaboradores")
      .doc(colaboradorId);

    await admin.firestore().runTransaction(async (tx) => {
      const colabSnap = await tx.get(colabRef);

      const rating = colabSnap.data()?.rating ?? {
        total: 0,
        promedio: 0,
        conteo: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };

      rating.total += 1;
      rating.conteo[valor] += 1;
      rating.promedio = calcularPromedio(rating.total, rating.conteo);

      tx.set(colabRef, { rating, estrellas: rating.promedio }, { merge: true });
    });
  },
);

export const onRatingUpdate = onDocumentUpdated(
  "ratings/{ratingId}",
  async (event) => {
    const beforeSnap = event.data?.before;
    const afterSnap = event.data?.after;
    if (!beforeSnap || !afterSnap) return;

    const before = beforeSnap.data();
    const after = afterSnap.data();

    if (before.valor === after.valor) return;

    const colabRef = admin
      .firestore()
      .collection("colaboradores")
      .doc(after.colaboradorId);

    await admin.firestore().runTransaction(async (tx) => {
      const colabSnap = await tx.get(colabRef);
      const rating = colabSnap.data()?.rating;
      if (!rating) return;

      rating.conteo[before.valor] = Math.max(
        0,
        rating.conteo[before.valor] - 1,
      );
      rating.conteo[after.valor] += 1;
      rating.promedio = calcularPromedio(rating.total, rating.conteo);

      tx.update(colabRef, { rating, estrellas: rating.promedio });
    });
  },
);

export const onRatingDelete = onDocumentDeleted(
  "ratings/{ratingId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const { colaboradorId, valor } = snap.data();

    const colabRef = admin
      .firestore()
      .collection("colaboradores")
      .doc(colaboradorId);

    await admin.firestore().runTransaction(async (tx) => {
      const colabSnap = await tx.get(colabRef);
      const rating = colabSnap.data()?.rating;
      if (!rating) return;

      rating.total = Math.max(0, rating.total - 1);
      rating.conteo[valor] = Math.max(0, rating.conteo[valor] - 1);
      rating.promedio = calcularPromedio(rating.total, rating.conteo);

      tx.update(colabRef, { rating, estrellas: rating.promedio });
    });
  },
);

// /*
//   Actualizar nombre y appelido de colaborador agregar en todas las colecciones donde se repite el nombre y apellido del colaborador
// */
// export const onUsuarioUpdated = onDocumentUpdated(
//   "usuarios/{uid}",
//   async (event) => {
//     const before = event.data?.before.data();
//     const after = event.data?.after.data();

//     if (!before || !after) return;

//     // Solo si cambió nombre o apellido
//     if (before.nombre === after.nombre && before.apellido === after.apellido)
//       return;

//     const uid = event.params.uid;
//     const nombreCompleto = `${after.nombre} ${after.apellido}`;
//     const esColaborador = after.tipo === "colaborador";

//     // Consultas en paralelo
//     const [postsSnap, comentariosSnap, siguiendoSnap, seguidoresSnap] =
//       await Promise.all([
//         db.collection("posts").where("autorId", "==", uid).get(),
//         db.collection("comentarios").where("usuario_id", "==", uid).get(),
//         db.collection("siguiendo").doc(uid).collection("colaboradores").get(),
//         // Seguidores: docs donde este uid aparece como seguidor
//         db.collectionGroup("usuarios").where("usuarioId", "==", uid).get(),
//       ]);

//     // Dividir en batches de 500
//     const allOps = [];

//     // 1. Posts y colaborador
//     if (esColaborador) {
//       postsSnap.forEach((doc) =>
//         allOps.push({ ref: doc.ref, data: { autorNombre: nombreCompleto } }),
//       );

//       const colabRef = db.collection("colaboradores").doc(uid);
//       allOps.push({
//         ref: colabRef,
//         data: { nombre: after.nombre, apellido: after.apellido },
//       });
//     }

//     // 2. Comentarios
//     comentariosSnap.forEach((doc) =>
//       allOps.push({ ref: doc.ref, data: { autorNombre: nombreCompleto } }),
//     );

//     // 3. Siguiendo (subdocs donde este usuario sigue a colaboradores)
//     siguiendoSnap.forEach((doc) =>
//       allOps.push({ ref: doc.ref, data: { nombre: nombreCompleto } }),
//     );

//     // 4. Seguidores (subdocs en colaboradores/seguidores/usuarios/{uid})
//     seguidoresSnap.forEach((doc) =>
//       allOps.push({ ref: doc.ref, data: { nombre: nombreCompleto } }),
//     );

//     // 5. Chat participants
//     const chatParticipantsSnap = await db
//       .collectionGroup("members")
//       .where("userId", "==", uid)
//       .get();

//     chatParticipantsSnap.forEach((doc) =>
//       allOps.push({ ref: doc.ref, data: { nombre: nombreCompleto } }),
//     );

//     // Ejecutar en batches de 500
//     const BATCH_LIMIT = 500;
//     for (let i = 0; i < allOps.length; i += BATCH_LIMIT) {
//       const batch = db.batch();
//       const chunk = allOps.slice(i, i + BATCH_LIMIT);
//       chunk.forEach(({ ref, data }) => batch.update(ref, data));
//       await batch.commit();
//     }

//     console.log(
//       `[onUsuarioUpdated] uid=${uid} | nombre="${nombreCompleto}" | ops=${allOps.length}`,
//     );
//   },
// );
