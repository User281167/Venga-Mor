import { NextRequest, NextResponse } from "next/server";
import { serializePost, validateQueryParams } from "./postFeedUtils";
import { adminDb } from "@/lib/firebase-admin-connection";
import { FeedResponse } from "@/types/post";
import { getUserID } from "../../utils";
import { ApiResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const userID = await getUserID();

  if (!userID) {
    return new Response(
      ApiResponse.failure(
        "No autorizado, Inicia sesión para ver posts de colaboradores",
      ).toJSON(),
      {
        status: 401,
      },
    );
  }

  const startTime = Date.now();

  try {
    // 1. VALIDAR PARÁMETROS
    const searchParams = request.nextUrl.searchParams;
    const validation = validateQueryParams(searchParams);

    if (!validation.valid) {
      return new Response(
        ApiResponse.failure("Parametros invalidos").toJSON(),
        {
          status: 400,
        },
      );
    }

    const { limit, cursor, seedStart, autorId, mediaType } = validation.data!;

    // 2. CONSTRUIR QUERY BASE
    let query = adminDb
      .collection("posts")
      .where("randomSeed", "!=", null)
      .orderBy("randomSeed", "asc")
      .orderBy("creado", "desc");

    // 3. APLICAR FILTROS OPCIONALES
    if (autorId) {
      query = query.where("autorId", "==", autorId);
    }

    // Nota: Firestore no permite filtros complejos en arrays/nested objects
    // Para filtrar por media type, lo haremos después de la query

    // 4. APLICAR PAGINACIÓN
    if (cursor) {
      const cursorValue = parseFloat(cursor);
      query = query.startAfter(cursorValue);
    } else {
      query = query.startAt(seedStart);
    }

    // Pedir +1 para saber si hay más
    query = query.limit(limit + 1);

    // 5. EJECUTAR QUERY
    const snapshot = await query.get();

    // 6. MANEJAR CASO DE WRAP-AROUND
    let posts: any[] = [];
    let needsWrapAround = false;

    if (snapshot.empty && !cursor) {
      // No hay posts desde seedStart, empezar desde 0
      const wrapQuery = adminDb
        .collection("posts")
        .where("randomSeed", "!=", null)
        .orderBy("randomSeed", "asc")
        .orderBy("creado", "desc")
        .limit(limit + 1);

      const wrapSnapshot = await wrapQuery.get();
      posts = wrapSnapshot.docs;
      needsWrapAround = true;
    } else {
      posts = snapshot.docs;
    }

    // 7. FILTRAR POR MEDIA TYPE (si es necesario)
    if (mediaType && mediaType !== "all") {
      posts = posts.filter((doc) => {
        const data = doc.data();

        if (mediaType === "video") {
          return data.media?.video != null;
        } else if (mediaType === "images") {
          return data.media?.images != null && data.media.images.length > 0;
        }

        return true;
      });
    }

    // 8. DETERMINAR SI HAY MÁS POSTS
    const hasMore = posts.length > limit;
    const postsToReturn = hasMore ? posts.slice(0, limit) : posts;

    // 9. SERIALIZAR POSTS
    const serializedPosts = postsToReturn.map(serializePost);

    // 10. CALCULAR METADATA
    const videoCount = serializedPosts.filter(
      (p) => p.media.video != null,
    ).length;
    const imagesCount = serializedPosts.filter(
      (p) => p.media.images != null && p.media.images.length > 0,
    ).length;

    // 11. GENERAR NEXT CURSOR
    const nextCursor =
      hasMore && postsToReturn.length > 0
        ? postsToReturn[postsToReturn.length - 1].data().randomSeed.toString()
        : null;

    // 12. CONSTRUIR RESPUESTA
    const response: FeedResponse = {
      posts: serializedPosts,
      nextCursor,
      hasMore,
      seedStart: needsWrapAround ? 0 : seedStart,
      metadata: {
        totalReturned: serializedPosts.length,
        requestedLimit: limit,
        hasVideo: videoCount,
        hasImages: imagesCount,
      },
    };

    // 13. AGREGAR HEADERS DE CACHE
    const headers = new Headers();
    headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
    headers.set("X-Response-Time", `${Date.now() - startTime}ms`);

    return new Response(
      ApiResponse.success(response, "Post obtenidos exitosamente").toJSON(),
      { status: 200, headers },
    );
  } catch (error: any) {
    console.error("Error fetching posts feed:", error);

    // Manejo específico de errores de Firebase
    if (error.code === "failed-precondition") {
      return new Response(
        ApiResponse.failure(
          "Índice de Firestore faltante. Por favor crear índice compuesto.",
          ["Crear índice: randomSeed (ASC), creado (DESC)", error.message],
        ).toJSON(),
        { status: 500 },
      );
    }

    return new Response(
      ApiResponse.failure(
        "Error al obtener los posts",
        process.env.NODE_ENV === "development" ? [error.message] : undefined,
      ).toJSON(),
      { status: 500 },
    );
  }
}

// ==================== HEADERS OPTIONS ====================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/**
 * ==================== EJEMPLOS DE USO ====================
 *
 * # Feed básico (primera carga)
 * GET /api/posts/feed
 *
 * # Feed con límite específico
 * GET /api/posts/feed?limit=20
 *
 * # Página siguiente
 * GET /api/posts/feed?cursor=0.7234567&seedStart=0.123456&limit=10
 *
 * # Filtrar por autor
 * GET /api/posts/feed?autorId=user123
 *
 * # Solo posts con video
 * GET /api/posts/feed?mediaType=video
 *
 * # Solo posts con imágenes
 * GET /api/posts/feed?mediaType=images
 *
 * # Combinación de filtros
 * GET /api/posts/feed?autorId=user123&mediaType=video&limit=15
 *
 * ==================== RESPUESTA EJEMPLO ====================
 *
 * {
 *   "posts": [
 *     {
 *       "id": "post123",
 *       "actualizado": "2026-02-15T10:30:00.000Z",
 *       "autorId": "user456",
 *       "creado": "2026-02-14T15:20:00.000Z",
 *       "descripcion": "Un post increíble",
 *       "media": {
 *         "images": [
 *           {
 *             "name": "photo.jpg",
 *             "path": "posts/post123/photo.jpg",
 *             "url": "https://storage.googleapis.com/..."
 *           }
 *         ],
 *         "video": null
 *       },
 *       "randomSeed": 0.7234567
 *     }
 *   ],
 *   "nextCursor": "0.8456789",
 *   "hasMore": true,
 *   "seedStart": 0.123456,
 *   "metadata": {
 *     "totalReturned": 10,
 *     "requestedLimit": 10,
 *     "hasVideo": 3,
 *     "hasImages": 7
 *   }
 * }
 */
