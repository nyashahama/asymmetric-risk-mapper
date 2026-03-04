import apiClient from "../apiClient";

export interface CreateCheckoutRequest {
  email: string;
}

// Matches the JSON returned by the Go handler:
// - client_secret (snake_case, not camelCase)
// - is_existing is omitted when false, so we mark it optional
export interface CreateCheckoutResponse {
  client_secret: string;
  is_existing?: boolean;
}

class CheckoutService {
  // NOTE: apiClient already has /api as its baseURL, so do NOT repeat it here.
  private readonly baseUrl = "/session/:sessionID/checkout";

  /**
   * Creates a Stripe checkout PaymentIntent for a session.
   * @param sessionID - UUID of the session
   * @param createCheckoutRequest - contains the customer's email
   * @returns Promise with the client_secret and an optional is_existing flag
   */
  async createCheckout(
    sessionID: string,
    createCheckoutRequest: CreateCheckoutRequest,
  ): Promise<CreateCheckoutResponse> {
    const url = this.baseUrl.replace(":sessionID", sessionID);

    const response = await apiClient.post<CreateCheckoutResponse>(
      url,
      createCheckoutRequest,
    );

    return response.data;
  }
}

export const checkoutService = new CheckoutService();
