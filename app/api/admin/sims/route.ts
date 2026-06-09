import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify admin is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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

    // Insert using admin client (bypasses RLS)
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("sims")
      .insert({
        phone_number,
        price,
        carrier,
        category_id: category_id || null,
        description: description || null,
        feng_shui: feng_shui || null,
        is_featured: is_featured || false,
        is_sold: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert sim error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Số điện thoại đã tồn tại" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Không thể thêm sim" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
