import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-6 w-6 text-gold-primary" />
              <span className="font-cormorant text-2xl font-semibold text-shimmer-gold">
                SimDepGiaRe
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Kho sim số đẹp giá rẻ hàng đầu Việt Nam. Cam kết sim chính chủ, giá tốt nhất thị trường.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-cormorant text-lg font-semibold text-gold-primary mb-4">
              Liên Kết
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sims" className="text-text-secondary text-sm hover:text-gold-primary transition-colors">
                  Sim Số
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary text-sm hover:text-gold-primary transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-cormorant text-lg font-semibold text-gold-primary mb-4">
              Liên Hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-text-secondary text-sm">
                <Phone className="h-4 w-4 text-gold-primary mt-0.5" />
                <span>0987 654 321</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary text-sm">
                <Mail className="h-4 w-4 text-gold-primary mt-0.5" />
                <span>contact@simdepgiare.vn</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary text-sm">
                <MapPin className="h-4 w-4 text-gold-primary mt-0.5" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-border text-center">
          <p className="text-text-muted text-sm">
            © 2026 SimDepGiaRe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
