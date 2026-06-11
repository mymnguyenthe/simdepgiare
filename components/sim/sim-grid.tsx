import { SimCard } from "./sim-card";

interface SimGridProps {
  sims: Array<{
    id: string;
    phone_number: string;
    price: number;
    carrier: string;
    category_name?: string;
    is_featured?: boolean;
  }>;
}

export function SimGrid({ sims }: SimGridProps) {
  if (sims.length === 0) {
    return (
      <div className="text-center py-24 gold-neon-card rounded-lg">
        <p className="text-text-secondary text-lg mb-2">
          Không tìm thấy sim nào phù hợp
        </p>
        <p className="text-text-muted text-sm">
          Vui lòng thử lại với bộ lọc khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sims.map((sim, index) => (
        <SimCard
          key={sim.id}
          sim={sim}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
}
