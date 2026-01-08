export class ApiResponse<T> {
  data?: T;
  message: string = "";
  success: boolean = false;

  constructor(init?: Partial<ApiResponse<T>>) {
    Object.assign(this, init);
  }

  static success<U>(
    data: U,
    message: string = "Operation successful",
  ): ApiResponse<U> {
    return new ApiResponse<U>({ data, message, success: true });
  }

  static failure<U>(message: string = "Operation failed"): ApiResponse<U> {
    return new ApiResponse<U>({ message, success: false });
  }
}
