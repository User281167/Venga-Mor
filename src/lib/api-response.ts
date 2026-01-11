export class ApiResponse<T = undefined> {
  data?: T;
  message: string = "";
  success: boolean = false;
  errors?: string[];

  constructor(init?: Partial<ApiResponse<T>>) {
    Object.assign(this, init);
  }

  static success<U>(
    data: U,
    message: string = "Operation successful",
    errors?: string[],
  ): ApiResponse<U> {
    return new ApiResponse<U>({ data, message, success: true, errors });
  }

  static failure<U>(
    message: string = "Operation failed",
    errors?: string[],
  ): ApiResponse<U> {
    return new ApiResponse<U>({ message, success: false, errors });
  }

  toJSON(): string {
    return JSON.stringify({
      data: this.data,
      message: this.message,
      success: this.success,
      errors: this.errors,
    });
  }

  /** Crear una instancia a partir de JSON */
  static fromJSON<U>(json: string): ApiResponse<U> {
    try {
      const obj = JSON.parse(json);
      return new ApiResponse<U>({
        data: obj.data,
        message: obj.message,
        success: obj.success,
        errors: obj.errors,
      });
    } catch (e) {
      return ApiResponse.failure<U>("Error al parsear la respuesta");
    }
  }
}
