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
      <div className="text-center py-16">
        <p className="text-text-secondary text-lg">
          Không tìm thấy sim nào phù hợp
        </p>
        <p className="text-text-muted text-sm mt-2">
          Vui lòng thử lại với bộ lọc khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
