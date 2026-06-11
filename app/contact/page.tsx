"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { GoldInput } from "@/components/ui/gold-input";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <CheckCircle className="h-20 w-20 text-success mx-auto" />
          <h1 className="font-cormorant text-4xl font-bold text-text-primary">
            Đã gửi tin nhắn!
          </h1>
          <p className="text-text-secondary max-w-md mx-auto">
            Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
          <GoldButton onClick={() => setSubmitted(false)}>
            Gửi tin nhắn khác
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="border-b border-gold-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-cormorant text-5xl font-bold text-text-primary">
            Liên Hệ
          </h1>
          <p className="mt-4 text-text-secondary">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-cormorant text-3xl font-semibold text-text-primary mb-8">
              Gửi tin nhắn
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <GoldInput
                id="name"
                label="Họ và tên"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-medium uppercase tracking-widest text-text-secondary"
                >
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-sm border border-gold-border bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all"
                />
              </div>

              <GoldButton type="submit" size="lg" className="w-full">
                Gửi tin nhắn
              </GoldButton>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-cormorant text-3xl font-semibold text-text-primary mb-8">
              Thông tin liên hệ
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-gold-primary" />
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-semibold text-text-primary mb-1">
                    Điện thoại
                  </h3>
                  <p className="text-text-secondary">0945 556 789</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-gold-primary" />
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-semibold text-text-primary mb-1">
                    Giờ làm việc
                  </h3>
                  <p className="text-text-secondary">
                    Thứ 2 - Thứ 6: 8:00 - 20:00
                    <br />
                    Thứ 7 - Chủ nhật: 9:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
