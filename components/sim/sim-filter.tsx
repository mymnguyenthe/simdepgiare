"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import type { Category } from "@/lib/api/sims";

interface SimFilterProps {
  categories: Category[];
  filterCounts: {
    carriers: {
      viettel: number;
      vinaphone: number;
      mobifone: number;
    };
    totalAvailable: number;
  };
  currentFilters: {
    carrier?: string[];
    categoryId?: string[];
    search?: string;
    sortBy?: string;
  };
}

export function SimFilter({ categories, filterCounts, currentFilters }: SimFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search || "");

  const carriers = [
    { value: "viettel", label: "Viettel", count: filterCounts.carriers.viettel },
    { value: "vinaphone", label: "VinaPhone", count: filterCounts.carriers.vinaphone },
    { value: "mobifone", label: "MobiFone", count: filterCounts.carriers.mobifone },
  ];

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
  ];

  function updateFilters(key: string, value: string | string[] | undefined) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }

    params.delete("page"); // Reset to page 1
    router.push(`/sims?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilters("search", search || undefined);
  }

  function clearFilters() {
    router.push("/sims");
    setSearch("");
  }

  const hasFilters =
    currentFilters.carrier || currentFilters.categoryId || currentFilters.search;

  return (
    <div className="neon-card rounded-lg p-6 space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo số sim..."
            className="w-full h-11 pl-10 pr-3 rounded-md border border-neon-cyan/30 bg-surface-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all"
          />
        </div>
      </form>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest neon-text-cyan mb-3">
          Sắp xếp
        </label>
        <select
          value={currentFilters.sortBy || "newest"}
          onChange={(e) => updateFilters("sort", e.target.value)}
          className="w-full h-11 px-3 rounded-md border border-neon-cyan/30 bg-surface-elevated text-sm text-text-primary focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Carriers */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest neon-text-magenta mb-3">
          Nhà mạng
        </label>
        <div className="space-y-2">
          {carriers.map((carrier) => {
            const isSelected = currentFilters.carrier?.includes(carrier.value);
            return (
              <button
                key={carrier.value}
                onClick={() => {
                  const current = currentFilters.carrier || [];
                  const next = isSelected
                    ? current.filter((c) => c !== carrier.value)
                    : [...current, carrier.value];
                  updateFilters("carrier", next.length > 0 ? next : undefined);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                  isSelected
                    ? "neon-border-magenta bg-neon-magenta/10 neon-text-magenta"
                    : "border-neon-cyan/30 bg-surface/50 text-text-secondary hover:neon-border-cyan hover:neon-text-cyan"
                }`}
              >
                <span>{carrier.label}</span>
                <span className="text-xs font-bold">{carrier.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest neon-text-purple mb-3">
          Loại sim
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {categories.map((category) => {
            const isSelected = currentFilters.categoryId?.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => {
                  const current = currentFilters.categoryId || [];
                  const next = isSelected
                    ? current.filter((c) => c !== category.id)
                    : [...current, category.id];
                  updateFilters("category", next.length > 0 ? next : undefined);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-left transition-all ${
                  isSelected
                    ? "neon-border-purple bg-neon-purple/10 neon-text-purple"
                    : "border-neon-cyan/30 bg-surface/50 text-text-secondary hover:neon-border-cyan hover:neon-text-cyan"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-3 rounded-md border-2 border-neon-magenta/50 text-neon-magenta font-bold uppercase tracking-wider hover:neon-border-magenta hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all"
        >
          <X className="inline h-4 w-4 mr-2" />
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
