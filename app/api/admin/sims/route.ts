import { getAdminSessionServer } from "@/lib/auth/admin";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify admin is logged in
  const session = await getAdminSessionServer();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone_number, price, carrier, category_id, description, feng_shui, is_featured } = body;

    // Validation
    if (!phone_number || !/^\d{10,11}$/.test(phone_number)) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ" },
        { status: 400 }
      );
    }

    if (!price || isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Giá không hợp lệ" },
        { status: 400 }
      );
    }

    const validCarriers = ["viettel", "vinaphone", "mobifone"];
    if (!carrier || !validCarriers.includes(carrier)) {
      return NextResponse.json(
        { error: "Nhà mạng không hợp lệ" },
        { status: 400 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO sims (
        id,
        phone_number,
        price,
        carrier,
        category_id,
        description,
        feng_shui,
        is_featured,
        is_sold
      )
      VALUES (
        gen_random_uuid()::text,
        ${phone_number},
        ${price},
        ${carrier},
        ${category_id || null},
        ${description || null},
        ${feng_shui || null},
        ${is_featured || false},
        false
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    console.error("API error:", err);
    const pgError = err as { code?: string; message?: string };
    if (pgError?.code === "23505") {
      return NextResponse.json(
        { error: "Số điện thoại đã tồn tại" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
