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
    <div className="pt-16">
      <div className="border-b border-gold-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-cormorant text-5xl font-bold text-text-primary">
            Kho Sim Số
          </h1>
          <p className="mt-4 text-text-secondary">
            {filterCounts.totalAvailable} sim đang có sẵn
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Filter Sidebar */}
          <Suspense fallback={<div className="h-96 bg-surface rounded-sm animate-pulse" />}>
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
                    <div key={i} className="h-64 bg-surface rounded-sm animate-pulse" />
                  ))}
                </div>
              }
            >
              <SimGrid sims={simsResult.data} />
            </Suspense>

            {/* Pagination */}
            {simsResult.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: simsResult.totalPages }).map((_, i) => (
                  <a
                    key={i}
                    href={`/sims?page=${i + 1}${carrier ? `&carrier=${carrier.join(",")}` : ""}${categoryId ? `&category=${categoryId.join(",")}` : ""}${search ? `&search=${search}` : ""}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-sm border transition-all ${
                      page === i + 1
                        ? "border-gold-primary bg-gold-primary/10 text-gold-primary"
                        : "border-gold-border bg-surface text-text-secondary hover:border-gold-primary hover:text-gold-primary"
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
