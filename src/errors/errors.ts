export class NetworkError extends Error {
  code = "NETWORK_ERROR";
  message = "Error de red, inténtalo de nuevo más tarde";
}

export class ServerError extends Error {
  code = "SERVER_ERROR";
  message = "Error del servidor, inténtalo de nuevo más tarde";
}
