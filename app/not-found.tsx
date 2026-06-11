import Link from "next/link";
import { GoldButton } from "@/components/ui/gold-button";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="font-montserrat text-8xl font-bold text-shimmer-gold">
          404
        </h1>
        <h2 className="font-montserrat text-3xl font-semibold text-text-primary">
          Không tìm thấy trang
        </h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/">
          <GoldButton>Về Trang Chủ</GoldButton>
        </Link>
      </div>
    </div>
  );
}
