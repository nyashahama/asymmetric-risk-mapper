import apiClient from "../apiClient";

export interface CreateCheckoutRequest {
  email: string;
}

export interface CreateCheckoutResponse {
  clientSecret: string;
  isExisting: boolean;
}

class CheckoutService {
  private readonly baseUrl = "/session/:sessionID/checkout";

  async createCheckout(
    createCheckoutRequest: CreateCheckoutRequest,
  ): Promise<CreateCheckoutResponse> {
    const response = await apiClient.post<CreateCheckoutResponse>(
      `${this.baseUrl}`,
      createCheckoutRequest,
    );
    return response.data;
  }
}

export const checkoutService = new CheckoutService();
