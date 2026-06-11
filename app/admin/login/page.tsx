"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GoldButton } from "@/components/ui/gold-button";
import { GoldInput } from "@/components/ui/gold-input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/admin/them-sim";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-montserrat font-bold text-gold-primary">
            Admin Panel
          </h1>
          <p className="mt-2 text-text-secondary">Đăng nhập để quản lý sim</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-surface border border-gold-border rounded-sm p-8 space-y-6"
        >
          {error && (
            <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

          <GoldInput
            id="email"
            label="Email"
            type="email"
            placeholder="admin@simdepgiare.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <GoldInput
            id="password"
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <GoldButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </GoldButton>
        </form>
      </div>
    </div>
  );
}
