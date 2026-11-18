import { getDb, getConnectionString } from "@/lib/db";

// Types
export interface Sim {
  id: string;
  phone_number: string;
  price: number;
  carrier: string;
  category_id: string | null;
  category_name?: string;
  description: string | null;
  feng_shui: string | null;
  is_sold: boolean;
  is_featured: boolean;
  image_url?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
}

export interface SimsFilter {
  carrier?: string[];
  categoryId?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "price_asc" | "price_desc" | "newest";
}

export interface SimsResult {
  data: Sim[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Get sims with filters
export async function getSims(filters: SimsFilter = {}): Promise<SimsResult> {
  const {
    carrier,
    categoryId,
    minPrice,
    maxPrice,
    search,
    isFeatured,
    page = 1,
    pageSize = 24,
    sortBy = "newest",
  } = filters;

  if (!getConnectionString()) {
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  try {
    const sql = getDb();
    const whereClauses: string[] = ["s.is_sold = FALSE"];
    const params: unknown[] = [];

    if (carrier && carrier.length > 0) {
      params.push(carrier);
      whereClauses.push(`s.carrier = ANY($${params.length})`);
    }

    if (categoryId && categoryId.length > 0) {
      params.push(categoryId);
      whereClauses.push(`s.category_id = ANY($${params.length})`);
    }

    if (minPrice !== undefined) {
      params.push(minPrice);
      whereClauses.push(`s.price >= $${params.length}`);
    }

    if (maxPrice !== undefined) {
      params.push(maxPrice);
      whereClauses.push(`s.price <= $${params.length}`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      whereClauses.push(`s.phone_number ILIKE $${params.length}`);
    }

    if (isFeatured !== undefined) {
      params.push(isFeatured);
      whereClauses.push(`s.is_featured = $${params.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    let orderBy = "s.created_at DESC";
    if (sortBy === "price_asc") {
      orderBy = "s.price ASC";
    } else if (sortBy === "price_desc") {
      orderBy = "s.price DESC";
    }

    const offset = (page - 1) * pageSize;

    // Count total query
    const countQuery = `SELECT COUNT(*)::int AS count FROM sims s ${whereSql}`;
    const countResult = (await sql.query(countQuery, params)) as unknown as { count: number }[];
    const totalCount = countResult[0]?.count || 0;

    // Data query
    const dataParams = [...params, pageSize, offset];
    const dataQuery = `
      SELECT
        s.*,
        c.name AS category_name
      FROM sims s
      LEFT JOIN categories c ON s.category_id = c.id
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const rows = (await sql.query(dataQuery, dataParams)) as unknown as Sim[];

    return {
      data: rows,
      count: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("getSims error:", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }
}

export async function getSimById(id: string): Promise<Sim | null> {
  if (!getConnectionString()) return null;

  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT
        s.*,
        c.name AS category_name
      FROM sims s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = ${id}
      LIMIT 1
    `) as unknown as Sim[];

    return rows[0] || null;
  } catch (error) {
    console.error("getSimById error:", error);
    return null;
  }
}

export async function getFeaturedSims(limit = 8): Promise<Sim[]> {
  if (!getConnectionString()) return [];

  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT
        s.*,
        c.name AS category_name
      FROM sims s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.is_sold = FALSE
      ORDER BY s.price DESC
      LIMIT ${limit}
    `) as unknown as Sim[];

    return rows;
  } catch (error) {
    console.error("getFeaturedSims error:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!getConnectionString()) return [];

  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT *
      FROM categories
      ORDER BY sort_order ASC
    `) as unknown as Category[];

    return rows;
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
}

export async function getFilterCounts() {
  if (!getConnectionString()) {
    return {
      carriers: { viettel: 0, vinaphone: 0, mobifone: 0, vietnamobile: 0, itelecom: 0 },
      totalAvailable: 0,
    };
  }

  try {
    const sql = getDb();
    const result = (await sql`
      SELECT
        COUNT(*) FILTER (WHERE carrier = 'viettel' AND is_sold = FALSE)::int AS viettel,
        COUNT(*) FILTER (WHERE carrier = 'vinaphone' AND is_sold = FALSE)::int AS vinaphone,
        COUNT(*) FILTER (WHERE carrier = 'mobifone' AND is_sold = FALSE)::int AS mobifone,
        COUNT(*) FILTER (WHERE carrier = 'vietnamobile' AND is_sold = FALSE)::int AS vietnamobile,
        COUNT(*) FILTER (WHERE carrier = 'itelecom' AND is_sold = FALSE)::int AS itelecom,
        COUNT(*) FILTER (WHERE is_sold = FALSE)::int AS total
      FROM sims;
    `) as unknown as {
      viettel: number;
      vinaphone: number;
      mobifone: number;
      vietnamobile: number;
      itelecom: number;
      total: number;
    }[];

    const row = result[0];
    return {
      carriers: {
        viettel: row?.viettel || 0,
        vinaphone: row?.vinaphone || 0,
        mobifone: row?.mobifone || 0,
        vietnamobile: row?.vietnamobile || 0,
        itelecom: row?.itelecom || 0,
      },
      totalAvailable: row?.total || 0,
    };
  } catch (error) {
    console.error("getFilterCounts error:", error);
    return {
      carriers: { viettel: 0, vinaphone: 0, mobifone: 0, vietnamobile: 0, itelecom: 0 },
      totalAvailable: 0,
    };
  }
}

export async function getRelatedSims(simId: string, limit = 8): Promise<Sim[]> {
  if (!getConnectionString()) return [];

  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT
        s.*,
        c.name AS category_name
      FROM sims s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.is_sold = FALSE
        AND s.id != ${simId}
        AND s.carrier = (SELECT carrier FROM sims WHERE id = ${simId})
      LIMIT ${limit}
    `) as unknown as Sim[];

    return rows;
  } catch (error) {
    console.error("getRelatedSims error:", error);
    return [];
  }
}
