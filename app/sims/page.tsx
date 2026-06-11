import { SimFilter } from "@/components/sim/sim-filter";
import { SimGrid } from "@/components/sim/sim-grid";
import { Pagination } from "@/components/pagination";
import { getCategories, getFilterCounts, getSims } from "@/lib/api/sims";
import { Suspense } from "react";

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
    <div className="pt-16 min-h-screen overflow-x-hidden">
      {/* Hero section */}
      <div className="border-b border-gold-border-strong bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="font-montserrat text-6xl font-black neon-text-gold-strong mb-4 tracking-wider">
            KHO SIM SỐ
          </h1>
          <p className="text-xl text-text-secondary font-light">
            <span className="neon-text-gold font-bold">{filterCounts.totalAvailable}</span> sim đang có sẵn
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Filter Sidebar */}
          <Suspense fallback={<div className="h-96 gold-neon-card rounded-lg animate-pulse" />}>
            <SimFilter
              categories={categories}
              filterCounts={filterCounts}
              currentFilters={{ carrier, categoryId, search, sortBy }}
            />
          </Suspense>

          {/* Sim Grid + Pagination */}
          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-64 gold-neon-card rounded-lg animate-pulse" />
                  ))}
                </div>
              }
            >
              <SimGrid sims={simsResult.data} />
            </Suspense>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={simsResult.totalPages}
              baseUrl={`/sims${carrier ? `?carrier=${carrier.join(",")}` : ""}${categoryId ? `${carrier ? "&" : "?"}category=${categoryId.join(",")}` : ""}${search ? `${carrier || categoryId ? "&" : "?"}search=${search}` : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
