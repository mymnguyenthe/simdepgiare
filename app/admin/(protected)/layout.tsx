import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-error">Lỗi cấu hình</h1>
          <p className="text-text-secondary">
            Biến môi trường Supabase chưa được cấu hình. Vui lòng kiểm tra file .env.local
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-gold-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin/them-sim"
                className="text-gold-primary font-semibold text-lg"
              >
                Admin Panel
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin/them-sim"
                  className="text-text-secondary hover:text-gold-primary transition-colors"
                >
                  Thêm Sim
                </Link>
                <Link
                  href="/admin/them-sim/import"
                  className="text-text-secondary hover:text-gold-primary transition-colors"
                >
                  Import CSV
                </Link>
                <Link
                  href="/"
                  className="text-text-secondary hover:text-gold-primary transition-colors"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-text-secondary text-sm">{user.email}</span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-text-secondary hover:text-gold-primary transition-colors text-sm"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
