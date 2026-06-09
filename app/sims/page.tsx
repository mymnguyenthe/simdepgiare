import { Suspense } from "react";
import { SimGrid } from "@/components/sim/sim-grid";
import { SimFilter } from "@/components/sim/sim-filter";
import { getSims, getCategories, getFilterCounts } from "@/lib/api/sims";

interface SimsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SimsPage({ searchParams }: SimsPageProps) {
  const params = await searchParams;

  const carrier = params.carrier
    ? Array.isArray(params.carrier)
      ? params.carrier
      : [params.carrier]
    : undefined;

  const categoryId = params.category
    ? Array.isArray(params.category)
      ? params.category
      : [params.category]
    : undefined;

  const search = typeof params.search === "string" ? params.search : undefined;
  const sortBy = (typeof params.sort === "string" ? params.sort : "newest") as "price_asc" | "price_desc" | "newest";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const [simsResult, categories, filterCounts] = await Promise.all([
    getSims({ carrier, categoryId, search, sortBy, page, pageSize: 24 }),
    getCategories(),
    getFilterCounts(),
  ]);

  return (
    <div className="pt-16 min-h-screen relative">
      {/* Neon grid background */}
      <div className="absolute inset-0 neon-grid-bg opacity-20 pointer-events-none" />

      {/* Hero section */}
      <div className="relative border-b border-neon-cyan/30 bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-orbitron text-6xl font-black neon-text-cyan mb-4 tracking-wider">
            KHO SIM SỐ
          </h1>
          <p className="text-xl text-text-secondary font-light">
            <span className="neon-text-magenta font-bold">{filterCounts.totalAvailable}</span> sim đang có sẵn
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Filter Sidebar */}
          <Suspense fallback={<div className="h-96 neon-card rounded-lg animate-pulse" />}>
            <SimFilter
              categories={categories}
              filterCounts={filterCounts}
              currentFilters={{ carrier, categoryId, search, sortBy }}
            />
          </Suspense>

          {/* Sim Grid */}
          <div>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-64 neon-card rounded-lg animate-pulse" />
                  ))}
                </div>
              }
            >
              <SimGrid sims={simsResult.data} />
            </Suspense>

            {/* Pagination */}
            {simsResult.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-3">
                {Array.from({ length: simsResult.totalPages }).map((_, i) => (
                  <a
                    key={i}
                    href={`/sims?page=${i + 1}${carrier ? `&carrier=${carrier.join(",")}` : ""}${categoryId ? `&category=${categoryId.join(",")}` : ""}${search ? `&search=${search}` : ""}`}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                      page === i + 1
                        ? "neon-border-cyan bg-neon-cyan/10 neon-text-cyan"
                        : "border-neon-cyan/30 bg-surface/50 text-text-secondary hover:neon-border-magenta hover:neon-text-magenta"
                    }`}
                  >
                    {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
