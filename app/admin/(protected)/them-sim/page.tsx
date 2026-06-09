"use client";

import { useState, useEffect } from "react";
import { GoldButton } from "@/components/ui/gold-button";
import { GoldInput } from "@/components/ui/gold-input";
import { GoldSelect } from "@/components/ui/gold-select";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ThemSimPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    phone_number: "",
    price: "",
    carrier: "",
    category_id: "",
    description: "",
    feng_shui: "",
    is_featured: false,
  });

  const carrierOptions = [
    { value: "", label: "-- Chọn nhà mạng --" },
    { value: "viettel", label: "Viettel" },
    { value: "vinaphone", label: "VinaPhone" },
    { value: "mobifone", label: "MobiFone" },
  ];

  const categoryOptions = [
    { value: "", label: "-- Chọn loại sim --" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("id, name, slug").order("sort_order");
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const payload = {
      phone_number: formData.phone_number.trim(),
      price: parseInt(formData.price),
      carrier: formData.carrier,
      category_id: formData.category_id || null,
      description: formData.description.trim() || null,
      feng_shui: formData.feng_shui.trim() || null,
      is_featured: formData.is_featured,
    };

    try {
      const res = await fetch("/api/admin/sims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: result.error || "Có lỗi xảy ra" });
      } else {
        setMessage({ type: "success", text: "Thêm sim thành công!" });
        setFormData({
          phone_number: "",
          price: "",
          carrier: "",
          category_id: "",
          description: "",
          feng_shui: "",
          is_featured: false,
        });
      }
    } catch {
      setMessage({ type: "error", text: "Không thể kết nối đến server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-cormorant font-bold text-gold-primary">Thêm Sim Mới</h1>
        <p className="text-text-secondary mt-2">Nhập thông tin sim cần thêm vào hệ thống</p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-sm border ${
            message.type === "success"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-error/10 border-error/30 text-error"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface border border-gold-border rounded-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoldInput
            id="phone_number"
            label="Số điện thoại"
            placeholder="0989999999"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            required
          />

          <GoldInput
            id="price"
            label="Giá (VNĐ)"
            type="number"
            placeholder="150000000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
          />

          <GoldSelect
            id="carrier"
            label="Nhà mạng"
            value={formData.carrier}
            onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
            options={carrierOptions}
            required
          />

          <GoldSelect
            id="category_id"
            label="Loại sim"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            options={categoryOptions}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-xs font-medium uppercase tracking-widest text-text-secondary"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Mô tả chi tiết về sim..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="flex w-full rounded-sm border border-gold-border bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all duration-300"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="feng_shui"
            className="block text-xs font-medium uppercase tracking-widest text-text-secondary"
          >
            Phong thủy
          </label>
          <textarea
            id="feng_shui"
            rows={2}
            placeholder="Ý nghĩa phong thủy..."
            value={formData.feng_shui}
            onChange={(e) => setFormData({ ...formData, feng_shui: e.target.value })}
            className="flex w-full rounded-sm border border-gold-border bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all duration-300"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="is_featured"
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="h-4 w-4 rounded border-gold-border bg-surface-elevated text-gold-primary focus:ring-gold-primary/50"
          />
          <label htmlFor="is_featured" className="text-sm text-text-primary">
            Sim nổi bật (hiển thị ở trang chủ)
          </label>
        </div>

        <div className="flex space-x-4">
          <GoldButton type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm sim"}
          </GoldButton>
          <GoldButton
            type="button"
            variant="secondary"
            size="lg"
            onClick={() =>
              setFormData({
                phone_number: "",
                price: "",
                carrier: "",
                category_id: "",
                description: "",
                feng_shui: "",
                is_featured: false,
              })
            }
          >
            Xóa form
          </GoldButton>
        </div>
      </form>
    </div>
  );
}
