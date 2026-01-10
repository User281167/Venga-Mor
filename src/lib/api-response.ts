export class ApiResponse<T> {
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
}
