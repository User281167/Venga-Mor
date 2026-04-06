import { api } from "@/lib/apiHelper";
import { ApiResponse } from "@/lib/api-response";
import { PaypalOrderDto } from "@/dtos/paypalOder.dto";

export async function createVerifyProfilePaypal(): Promise<
  ApiResponse<PaypalOrderDto>
> {
  return await api.post<PaypalOrderDto>(
    "/api/paypal/verify-profile/create-order",
  );
}

export async function captureVerifyProfilePaypal(
  orderId: string,
): Promise<ApiResponse> {
  return await api.post(`/api/paypal/verify-profile/capture-order/${orderId}`);
}
