import { api } from "@/lib/apiHelper";
import { ApiResponse } from "@/lib/api-response";
import { PaypalOrderDto } from "@/dtos/paypalOder.dto";

export async function createJewelryPaypal(
  quantity: number,
): Promise<ApiResponse<PaypalOrderDto>> {
  return await api.post<PaypalOrderDto>("/api/paypal/jewelry/create-order", {
    quantity,
  });
}

export async function captureJewelryPaypal(
  orderId: string,
): Promise<ApiResponse> {
  return await api.post(`/api/paypal/jewelry/capture-order/${orderId}`);
}
