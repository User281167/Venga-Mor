// Tanstack query result para saber cuando ocuure un error de red, de negocio o de exito
// No confudir con ApiResponse que simplemente es para que todo los endpoints retorne un formato

export type QueryResult<T> =
  | { status: "success"; data: T }
  | { status: "business-error"; message: string }
  | { status: "empty" };

export const QueryResult = {
  success<T>(data: T): QueryResult<T> {
    return { status: "success", data };
  },

  businessError<T = never>(message: string): QueryResult<T> {
    return { status: "business-error", message };
  },

  empty<T = never>(): QueryResult<T> {
    return { status: "empty" };
  },
};
