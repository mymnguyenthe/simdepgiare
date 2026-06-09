export interface OrderData {
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  sim_id?: string;
  total: number;
  notes?: string;
}

export async function createOrder(orderData: OrderData) {
  // For now, just log the order (Supabase not configured)
  console.log("Order created:", orderData);

  return {
    data: {
      id: "mock-order-" + Date.now(),
      ...orderData,
      status: "pending",
      created_at: new Date().toISOString(),
    },
    error: null,
  };
}
