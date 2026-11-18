import { getDb, getConnectionString } from "@/lib/db";

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
  if (!getConnectionString()) {
    console.log("Database not configured, logging order:", orderData);
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

  try {
    const sql = getDb();
    const rows = await sql`
      INSERT INTO orders (customer_name, phone, email, address, sim_id, total, notes, status)
      VALUES (
        ${orderData.customer_name},
        ${orderData.phone},
        ${orderData.email || null},
        ${orderData.address || null},
        ${orderData.sim_id || null},
        ${orderData.total},
        ${orderData.notes || null},
        'pending'
      )
      RETURNING *
    `;

    return {
      data: rows[0],
      error: null,
    };
  } catch (error) {
    console.error("createOrder error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}
