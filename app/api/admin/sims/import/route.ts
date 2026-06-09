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
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const errors: { row: number; message: string }[] = [];
    let successCount = 0;

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        // Get category_id from slug
        let category_id: string | null = null;
        if (row.loai_sim) {
          const { data: category } = await adminClient
            .from("categories")
            .select("id")
            .eq("slug", row.loai_sim)
            .single();

          if (category) {
            category_id = category.id;
          }
        }

        const { error } = await adminClient.from("sims").insert({
          phone_number: row.so_dien_thoai,
          price: row.gia,
          carrier: row.nha_mang,
          category_id,
          description: row.mo_ta || null,
          feng_shui: row.phong_thuy || null,
          is_featured: row.noi_bat || false,
          is_sold: false,
        });

        if (error) {
          if (error.code === "23505") {
            errors.push({ row: i + 1, message: "Số điện thoại đã tồn tại" });
          } else {
            errors.push({ row: i + 1, message: error.message });
          }
        } else {
          successCount++;
        }
      } catch (err) {
        errors.push({
          row: i + 1,
          message: err instanceof Error ? err.message : "Lỗi không xác định",
        });
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: errors.length,
      errors,
    });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
