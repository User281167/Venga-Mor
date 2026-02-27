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
    try {
      const collaboradorId = event.params.collaboradorId;
      const userRef = db.doc(`colaboradores/${collaboradorId}`);

      await userRef.update({
        seguidoresCount: admin.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error("Error inesperado al incrementar seguidoresCount:", error);
    }
  },
);

export const onFollowDeleted = onDocumentDeleted(
  "colaboradores/{collaboradorId}/seguidores/{seguidorId}",
  async (event) => {
    try {
      const collaboradorId = event.params.collaboradorId;
      const colabRef = db.doc(`colaboradores/${collaboradorId}`);

      await db.runTransaction(async (tx) => {
        const snap = await tx.get(colabRef);
        const actual = snap.data()?.seguidoresCount ?? 0;

        tx.update(colabRef, {
          seguidoresCount: Math.max(0, actual - 1),
        });
      });
    } catch (error) {
      console.error("Error inesperado al decrementar seguidoresCount:", error);
    }
  },
);

// Comentarios contador por perfil de colaborador
// Doc comentarios/id usar campo colaborador_id
export const onCommentCreated = onDocumentCreated(
  "comentarios/{comentarioId}",
  async (event) => {
    try {
      const snap = event.data;
      if (!snap) return;

      const { colaborador_id } = snap.data();
      const colabRef = db.doc(`colaboradores/${colaborador_id}`);

      await colabRef.update({
        comentariosCount: admin.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error("Error inesperado al incrementar comentariosCount:", error);
    }
  },
);

export const onCommentDeleted = onDocumentDeleted(
  "comentarios/{comentarioId}",
  async (event) => {
    try {
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
    } catch (error) {
      console.error("Error inesperado al decrementar comentariosCount:", error);
    }
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
    try {
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

        tx.set(
          colabRef,
          { rating, estrellas: rating.promedio },
          { merge: true },
        );
      });
    } catch (error) {
      console.error("Error inesperado al crear rating:", error);
    }
  },
);

export const onRatingUpdate = onDocumentUpdated(
  "ratings/{ratingId}",
  async (event) => {
    try {
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
    } catch (error) {
      console.error("Error inesperado al actualizar rating:", error);
    }
  },
);

export const onRatingDelete = onDocumentDeleted(
  "ratings/{ratingId}",
  async (event) => {
    try {
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
    } catch (error) {
      console.error("Error inesperado al eliminar rating:", error);
    }
  },
);

// /*
//   Actualizar nombre y appelido de colaborador agregar en todas las colecciones donde se repite el nombre y apellido del colaborador
//
// seguidores
//    colaboradores/{collaboradorId}/seguidores/{seguidorId} -> nombre
// siguiendo
//    usuarios/{uid}/siguiendo/{colaboradorId} -> nombre
// posts
//    posts/{postId} -> usuario_nombre
// comentarios
//    comentarios/{comentarioId} -> usuario_nombre
// colaboradores
//    colaboradores/{colaboradorId} -> nombre, apellido
// */
export const onUsuarioUpdated = onDocumentUpdated(
  "usuarios/{uid}",
  async (event) => {
    try {
      const before = event.data?.before.data();
      const after = event.data?.after.data();
      if (!before || !after) return;

      if (before.nombre === after.nombre && before.apellido === after.apellido)
        return;

      const uid = event.params.uid;
      const nombreCompleto = `${after.nombre} ${after.apellido}`.trim();

      const [comentariosSnap, postsSnap] = await Promise.all([
        db.collection("comentarios").where("usuario_id", "==", uid).get(),
        db.collection("posts").where("autorId", "==", uid).get(),
      ]);

      const batch = db.batch();

      comentariosSnap.forEach((doc) =>
        batch.update(doc.ref, { usuario_nombre: nombreCompleto }),
      );

      // set con merge crea el campo si no existe, actualiza si ya existe
      postsSnap.forEach((doc) =>
        batch.set(doc.ref, { autorNombre: nombreCompleto }, { merge: true }),
      );

      await batch.commit();
    } catch (error) {
      console.error("Error inesperado al actualizar nombre de usuario:", error);
    }
  },
);
