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
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Cache categories slug -> id
    const categoryRows = (await sql`SELECT id, slug FROM categories`) as unknown as {
      id: string;
      slug: string;
    }[];
    const categoryMap = new Map<string, string>();
    for (const cat of categoryRows) {
      categoryMap.set(cat.slug, cat.id);
    }

    const errors: { row: number; message: string }[] = [];
    let successCount = 0;

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        const category_id = row.loai_sim ? categoryMap.get(row.loai_sim) || null : null;

        await sql`
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
            ${row.so_dien_thoai},
            ${row.gia},
            ${row.nha_mang},
            ${category_id},
            ${row.mo_ta || null},
            ${row.phong_thuy || null},
            ${row.noi_bat || false},
            false
          )
        `;

        successCount++;
      } catch (err: unknown) {
        const pgError = err as { code?: string; message?: string };
        if (pgError?.code === "23505") {
          errors.push({ row: i + 1, message: "Số điện thoại đã tồn tại" });
        } else {
          errors.push({
            row: i + 1,
            message: err instanceof Error ? err.message : "Lỗi không xác định",
          });
        }
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
