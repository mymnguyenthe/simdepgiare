import { SearchBar } from "@/components/search-bar";
import { SimGrid } from "@/components/sim/sim-grid";
import { GoldButton } from "@/components/ui/gold-button";
import { getCategories, getFeaturedSims } from "@/lib/api/sims";
import { Award, Phone, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [featuredSims, categories] = await Promise.all([
    getFeaturedSims(8),
    getCategories(),
  ]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gold-border-strong bg-linear-to-b from-surface to-background py-24">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-montserrat text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="neon-text-gold-strong block mb-5">KHO SIM SỐ</span>
              <span className="text-text-primary">ĐẸP GIÁ RẺ</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
              Mua bán sim số đẹp chính chủ, cam kết giá tốt nhất thị trường.
              Sim Viettel, VinaPhone, MobiFone đa dạng loại hình.
            </p>

            {/* Search Bar — client component */}
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 border-b border-gold-border">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <h2 className="font-montserrat text-4xl font-bold text-center neon-text-gold mb-12 tracking-wider">
            DANH MỤC SIM
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.id}
                href={`/sims?category=${category.id}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-lg gold-neon-card transition-all duration-300 opacity-0 animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-4xl">{category.icon}</span>
                <span className="text-sm font-medium text-text-primary group-hover:neon-text-gold transition-all">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sims */}
      <section className="py-20 border-b border-gold-border">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-montserrat text-4xl font-bold neon-text-gold tracking-wider">
              SIM NỔI BẬT
            </h2>
            <Link href="/sims">
              <GoldButton variant="secondary">
                Xem Tất Cả
              </GoldButton>
            </Link>
          </div>
          <SimGrid sims={featuredSims} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <h2 className="font-montserrat text-4xl font-bold text-center neon-text-gold mb-12 tracking-wider">
            TẠI SAO CHỌN CHÚNG TÔI
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 gold-neon-card rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gold-glow/20 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-gold-neon" />
              </div>
              <h3 className="font-montserrat text-xl font-bold text-text-primary mb-2 tracking-wide">
                SIM CHÍNH CHỦ
              </h3>
              <p className="text-sm text-text-secondary">
                100% sim chính chủ, sang tên ngay trong ngày
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 gold-neon-card rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gold-glow/20 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-gold-neon" />
              </div>
              <h3 className="font-montserrat text-xl font-bold text-text-primary mb-2 tracking-wide">
                BẢO HÀNH TRỌN ĐỜI
              </h3>
              <p className="text-sm text-text-secondary">
                Cam kết bảo hành sim trọn đời, hỗ trợ 24/7
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 gold-neon-card rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gold-glow/20 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-gold-neon" />
              </div>
              <h3 className="font-montserrat text-xl font-bold text-text-primary mb-2 tracking-wide">
                GIÁ TỐT NHẤT
              </h3>
              <p className="text-sm text-text-secondary">
                Giá cạnh tranh nhất thị trường, không qua trung gian
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 gold-neon-card rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gold-glow/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-gold-neon" />
              </div>
              <h3 className="font-montserrat text-xl font-bold text-text-primary mb-2 tracking-wide">
                ĐA DẠNG LOẠI HÌNH
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
