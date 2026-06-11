import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Tag, Sparkles } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { GoldBadge } from "@/components/ui/gold-badge";
import { SimGrid } from "@/components/sim/sim-grid";
import { getSimById, getRelatedSims } from "@/lib/api/sims";
import { formatPrice, formatPhoneNumber } from "@/lib/utils";

interface SimDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SimDetailPage({ params }: SimDetailPageProps) {
  const { id } = await params;
  const sim = await getSimById(id);

  if (!sim) {
    notFound();
  }

  const relatedSims = await getRelatedSims(id, 4);
  const carrierVariant = sim.carrier as "viettel" | "vinaphone" | "mobifone";

  return (
    <div className="pt-16">
      <div className="border-b border-gold-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/sims"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Sim Info */}
          <div className="space-y-8">
            {/* Carrier Badge */}
            <div>
              <GoldBadge variant={carrierVariant} className="text-sm px-3 py-1">
                {sim.carrier}
              </GoldBadge>
            </div>

            {/* Sim Number */}
            <div>
              <h1 className="font-montserrat text-5xl font-bold text-text-primary mb-4">
                {formatPhoneNumber(sim.phone_number)}
              </h1>
              <p className="text-3xl font-bold text-shimmer-gold">
                {formatPrice(sim.price)}
              </p>
            </div>

            {/* Category */}
            {sim.category_name && (
              <div className="flex items-center gap-3 text-text-secondary">
                <Tag className="h-5 w-5 text-gold-primary" />
                <span>{sim.category_name}</span>
              </div>
            )}

            {/* Description */}
            {sim.description && (
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-text-primary mb-4">
                  Mô tả
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {sim.description}
                </p>
              </div>
            )}

            {/* Feng Shui */}
            {sim.feng_shui && (
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-gold-primary" />
                  Ý nghĩa phong thủy
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {sim.feng_shui}
                </p>
              </div>
            )}
          </div>

          {/* Right: Action Card */}
          <div>
            <div className="sticky top-24 space-y-6 p-8 rounded-sm border border-gold-border bg-surface">
              <div>
                <h3 className="font-montserrat text-2xl font-semibold text-text-primary mb-2">
                  Mua sim này
                </h3>
                <p className="text-sm text-text-secondary">
                  Liên hệ ngay để được tư vấn và giao sim miễn phí
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-text-secondary">
                  <Phone className="h-5 w-5 text-gold-primary" />
                  <span className="text-lg font-medium text-text-primary">
                    0945 556 789
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <GoldButton size="lg" className="w-full">
                  Mua Ngay
                </GoldButton>
                <GoldButton variant="secondary" size="lg" className="w-full">
                  Liên Hệ Tư Vấn
                </GoldButton>
              </div>

              <div className="pt-6 border-t border-gold-border space-y-2 text-sm text-text-secondary">
                <p>✓ Sim chính chủ, sang tên ngay</p>
                <p>✓ Giao sim miễn phí toàn quốc</p>
                <p>✓ Bảo hành trọn đời</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Sims */}
        {relatedSims.length > 0 && (
          <div className="mt-20">
            <h2 className="font-montserrat text-3xl font-semibold text-text-primary mb-8">
              Sim liên quan
            </h2>
            <SimGrid sims={relatedSims} />
          </div>
        )}
      </div>
    </div>
  );
}
