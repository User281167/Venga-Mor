import { ApiResponse } from "@/lib/api-response";
import { PostData } from "@/types/post";
import { adminBucket, adminDb } from "@/lib/firebase-admin-connection";
import { PostListDto } from "@/dtos/post.dto";
import { getUserID } from "@/app/api/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    let { description } = await req.json();

    console.log("Descripción recibida para actualización:", description);

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return new Response(
        ApiResponse.failure(
          "La descripción debe ser texto y menor a 200 caracteres",
        ).toJSON(),
        {
          status: 400,
        },
      );
    }

    description = description?.trim().substring(0, 200); // Limita a 200 caracteres

    const postId = (await params).id;
    const postRef = adminDb.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      console.info(`Post con ID ${postId} no encontrado para actualización`);

      return new Response(ApiResponse.failure("Post no encontrado").toJSON(), {
        status: 404,
      });
    }

    if (postSnap.data()?.autorId !== uid) {
      console.info(
        `Usuario ${uid} no autorizado para actualizar post ${postId}`,
      );

      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 403,
      });
    }

    await adminDb.collection("posts").doc(postId).update({
      descripcion: description,
    });

    return new Response(
      ApiResponse.success("Descripción actualizada").toJSON(),
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("Error al obtener el colaborador:", error);

    return new Response(
      ApiResponse.failure("Error al actualizar post").toJSON(),
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: Request) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId"); // El ID del último post cargado
    const limitNum = 10;

    let query = adminDb
      .collection("posts")
      .where("autorId", "==", uid)
      .orderBy("creado", "desc") // Siempre ordena por fecha
      .limit(limitNum);

    // Si el cliente envía el ID del último post, empezamos después de ese
    if (lastId) {
      const lastDoc = await adminDb.collection("posts").doc(lastId).get();

      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviamos el ID del último para que el front sepa de dónde seguir
    const lastVisible =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    const data: PostListDto = {
      data: posts as PostData[],
      lastId: lastVisible,
      total: snapshot.size,
      hasMore: snapshot.docs.length === limitNum,
    };

    return new Response(ApiResponse.success<PostListDto>(data).toJSON(), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al actualizar el post:", error);

    return new Response(
      ApiResponse.failure("Error al actualizar el post").toJSON(),
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const uid = await getUserID();

    if (!uid) {
      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 401,
      });
    }

    const postId = (await params).id;
    const postRef = adminDb.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      return new Response(ApiResponse.failure("Post no encontrado").toJSON(), {
        status: 404,
      });
    }

    const postData = postSnap.data() as PostData;

    if (postData.autorId !== uid) {
      console.info(
        `Usuario ${uid} no autorizado para actualizar post ${postId}`,
      );

      return new Response(ApiResponse.failure("No autorizado").toJSON(), {
        status: 403,
      });
    }

    // Eliminar archivos de Storage en paralelo
    const filesToDelete: string[] = [];

    if (postData.media?.images) {
      postData.media.images.forEach((image) => {
        if (image.path) filesToDelete.push(image.path);
      });
    }

    if (postData.media?.video?.path) {
      filesToDelete.push(postData.media.video.path);
    }

    // Eliminar todos en paralelo, sin fallar si alguno no existe
    await Promise.allSettled(
      filesToDelete.map((path) => adminBucket.file(path).delete()),
    );

    // Eliminar doc de Firestore
    await postRef.delete();

    return new Response(ApiResponse.success("Post actualizado").toJSON(), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error al eliminar el colaborador:", error);

    return new Response(
      ApiResponse.failure("Error al eliminar el post").toJSON(),
      {
        status: 500,
      },
    );
  }
}
