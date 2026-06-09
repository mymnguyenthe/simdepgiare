import { MOCK_SIMS, MOCK_CATEGORIES } from "@/lib/mock-data";

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

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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

  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    let filtered = [...MOCK_SIMS].filter((s) => !s.is_sold);

    if (carrier && carrier.length > 0) {
      filtered = filtered.filter((s) => carrier.includes(s.carrier));
    }

    if (categoryId && categoryId.length > 0) {
      filtered = filtered.filter((s) => s.category_id && categoryId.includes(s.category_id));
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((s) => s.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((s) => s.price <= maxPrice);
    }

    if (search && search.trim()) {
      filtered = filtered.filter((s) => s.phone_number.includes(search.trim()));
    }

    if (isFeatured !== undefined) {
      filtered = filtered.filter((s) => s.is_featured === isFeatured);
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // newest — keep original order
        break;
    }

    const count = filtered.length;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const data = filtered.slice(from, to);

    return {
      data,
      count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  // Supabase implementation
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("sims")
    .select("*, categories(name, slug, icon)", { count: "exact" })
    .eq("is_sold", false);

  if (carrier && carrier.length > 0) {
    query = query.in("carrier", carrier);
  }

  if (categoryId && categoryId.length > 0) {
    query = query.in("category_id", categoryId);
  }

  if (minPrice !== undefined) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice);
  }

  if (search && search.trim()) {
    query = query.ilike("phone_number", `%${search.trim()}%`);
  }

  if (isFeatured !== undefined) {
    query = query.eq("is_featured", isFeatured);
  }

  switch (sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getSims error:", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  // Map category_name from nested categories
  const mapped = (data || []).map((item: Record<string, unknown>) => ({
    ...item,
    category_name: (item.categories as Record<string, unknown>)?.name as string | undefined,
  }));

  return {
    data: mapped as Sim[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getSimById(id: string): Promise<Sim | null> {
  if (!isSupabaseConfigured()) {
    const sim = MOCK_SIMS.find((s) => s.id === id);
    return sim || null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sims")
    .select("*, categories(name, slug, icon)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    category_name: (data.categories as Record<string, unknown>)?.name as string | undefined,
  } as Sim;
}

export async function getFeaturedSims(limit = 8): Promise<Sim[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_SIMS.filter((s) => s.is_featured && !s.is_sold).slice(0, limit);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sims")
    .select("*, categories(name, slug, icon)")
    .eq("is_sold", false)
    .eq("is_featured", true)
    .order("price", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data || []).map((item: Record<string, unknown>) => ({
    ...item,
    category_name: (item.categories as Record<string, unknown>)?.name as string | undefined,
  })) as Sim[];
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES as Category[];
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data || []) as Category[];
}

export async function getFilterCounts() {
  if (!isSupabaseConfigured()) {
    const available = MOCK_SIMS.filter((s) => !s.is_sold);
    return {
      carriers: {
        viettel: available.filter((s) => s.carrier === "viettel").length,
        vinaphone: available.filter((s) => s.carrier === "vinaphone").length,
        mobifone: available.filter((s) => s.carrier === "mobifone").length,
      },
      totalAvailable: available.length,
    };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [viettelCount, vinaphoneCount, mobifoneCount, totalAvailable] = await Promise.all([
    supabase.from("sims").select("*", { count: "exact", head: true }).eq("carrier", "viettel").eq("is_sold", false),
    supabase.from("sims").select("*", { count: "exact", head: true }).eq("carrier", "vinaphone").eq("is_sold", false),
    supabase.from("sims").select("*", { count: "exact", head: true }).eq("carrier", "mobifone").eq("is_sold", false),
    supabase.from("sims").select("*", { count: "exact", head: true }).eq("is_sold", false),
  ]);

  return {
    carriers: {
      viettel: viettelCount.count || 0,
      vinaphone: vinaphoneCount.count || 0,
      mobifone: mobifoneCount.count || 0,
    },
    totalAvailable: totalAvailable.count || 0,
  };
}

export async function getRelatedSims(simId: string, limit = 8): Promise<Sim[]> {
  if (!isSupabaseConfigured()) {
    const currentSim = MOCK_SIMS.find((s) => s.id === simId);
    if (!currentSim) return [];
    return MOCK_SIMS.filter(
      (s) => s.id !== simId && !s.is_sold && s.carrier === currentSim.carrier && s.category_id === currentSim.category_id
    ).slice(0, limit);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: currentSim } = await supabase
    .from("sims")
    .select("category_id, carrier")
    .eq("id", simId)
    .single();

  if (!currentSim) return [];

  const { data } = await supabase
    .from("sims")
    .select("*, categories(name, slug)")
    .eq("is_sold", false)
    .neq("id", simId)
    .eq("carrier", currentSim.carrier)
    .eq("category_id", currentSim.category_id)
    .limit(limit);

  return (data || []).map((item: Record<string, unknown>) => ({
    ...item,
    category_name: (item.categories as Record<string, unknown>)?.name as string | undefined,
  })) as Sim[];
}
