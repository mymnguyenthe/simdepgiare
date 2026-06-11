"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/sims?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/sims");
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-primary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm sim theo số (VD: 0987, 6868, 9999...)"
          className="w-full h-14 pl-12 pr-32 rounded-md border border-gold-border-strong bg-surface-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-neon focus:shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 gold-neon-btn px-6 py-3 rounded-md text-sm font-bold"
        >
          Tìm Kiếm
        </button>
      </div>
    </form>
  );
}
