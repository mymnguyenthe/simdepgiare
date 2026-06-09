import Link from "next/link";
import { Search, Phone, Shield, Award, TrendingUp } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { SimGrid } from "@/components/sim/sim-grid";
import { getFeaturedSims, getCategories } from "@/lib/api/sims";

export default async function HomePage() {
  const [featuredSims, categories] = await Promise.all([
    getFeaturedSims(8),
    getCategories(),
  ]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gold-border bg-gradient-to-b from-surface to-background py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-cormorant text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-shimmer-gold">Kho Sim Số Đẹp</span>
              <br />
              <span className="text-text-primary">Giá Rẻ</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
              Mua bán sim số đẹp chính chủ, cam kết giá tốt nhất thị trường.
              Sim Viettel, VinaPhone, MobiFone đa dạng loại hình.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Tìm sim theo số (VD: 0987, 6868, 9999...)"
                  className="w-full h-14 pl-12 pr-32 rounded-sm border border-gold-border bg-surface-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:border-gold-primary transition-all"
                />
                <Link href="/sims">
                  <GoldButton className="absolute right-2 top-1/2 -translate-y-1/2">
                    Tìm Kiếm
                  </GoldButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 border-b border-gold-border">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-4xl font-semibold text-center text-text-primary mb-12">
            Danh Mục Sim
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.id}
                href={`/sims?category=${category.id}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-sm border border-gold-border bg-surface hover:gold-glow-hover transition-all duration-300 opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-4xl">{category.icon}</span>
                <span className="text-sm font-medium text-text-primary group-hover:text-gold-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sims */}
      <section className="py-20 border-b border-gold-border">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-cormorant text-4xl font-semibold text-text-primary">
              Sim Nổi Bật
            </h2>
            <Link href="/sims">
              <GoldButton variant="secondary">Xem Tất Cả</GoldButton>
            </Link>
          </div>
          <SimGrid sims={featuredSims} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-4xl font-semibold text-center text-text-primary mb-12">
            Tại Sao Chọn Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-gold-primary" />
              </div>
              <h3 className="font-cormorant text-xl font-semibold text-text-primary mb-2">
                Sim Chính Chủ
              </h3>
              <p className="text-sm text-text-secondary">
                100% sim chính chủ, sang tên ngay trong ngày
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-gold-primary" />
              </div>
              <h3 className="font-cormorant text-xl font-semibold text-text-primary mb-2">
                Bảo Hành Trọn Đời
              </h3>
              <p className="text-sm text-text-secondary">
                Cam kết bảo hành sim trọn đời, hỗ trợ 24/7
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-gold-primary" />
              </div>
              <h3 className="font-cormorant text-xl font-semibold text-text-primary mb-2">
                Giá Tốt Nhất
              </h3>
              <p className="text-sm text-text-secondary">
                Giá cạnh tranh nhất thị trường, không qua trung gian
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-gold-primary" />
              </div>
              <h3 className="font-cormorant text-xl font-semibold text-text-primary mb-2">
                Đa Dạng Loại Hình
              </h3>
              <p className="text-sm text-text-secondary">
                Tứ quý, ngũ quý, lộc phát, phong thủy... đủ loại
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
