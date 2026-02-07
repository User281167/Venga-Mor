import { Raiting } from "@/app/models/raiting.model";
import { BusinessError } from "@/errors/errors";
import { ApiResponse } from "@/lib/api-response";

/*
Obtener la calificación que el usuario ha dado a un colaborador específico.
Si el usuario no ha calificado al colaborador, se devuelve null.
*/
export default async function getMyRaiting(
  collaboratorId: string,
): Promise<Raiting | null> {
  try {
    const res = await fetch(`/api/me/raiting/${collaboratorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    // no se ha realizado la calificación por parte del usuario
    if (!res.ok && res.status === 404) {
      return null;
    }

    const data = (await res.json()) as ApiResponse<Raiting>;

    if (!data.success) {
      throw new BusinessError(data.message);
    }

    return data.data as Raiting;
  } catch (error) {
    throw new Error("Error al obtener la calificación");
  }
}
