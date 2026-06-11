"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { GoldInput } from "@/components/ui/gold-input";

export default function CartPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, this would call createOrder API
    console.log("Order submitted:", formData);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <CheckCircle className="h-20 w-20 text-success mx-auto" />
          <h1 className="font-montserrat text-4xl font-bold text-text-primary">
            Đặt hàng thành công!
          </h1>
          <p className="text-text-secondary max-w-md mx-auto">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
          <GoldButton onClick={() => setSubmitted(false)}>
            Đặt đơn khác
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="border-b border-gold-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-montserrat text-5xl font-bold text-text-primary">
            Đặt Hàng
          </h1>
          <p className="mt-4 text-text-secondary">
            Điền thông tin bên dưới để đặt mua sim
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <GoldInput
            id="customer_name"
            label="Họ và tên"
            required
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          />

          <GoldInput
            id="phone"
            label="Số điện thoại"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <GoldInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <GoldInput
            id="address"
            label="Địa chỉ giao hàng"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="notes"
              className="block text-xs font-medium uppercase tracking-widest text-text-secondary"
            >
              Ghi chú
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-sm border border-gold-border bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all"
            />
          </div>

          <GoldButton type="submit" size="lg" className="w-full">
            Xác nhận đặt hàng
          </GoldButton>
        </form>
      </div>
    </div>
  );
}
