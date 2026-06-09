export default function Loading() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-gold-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-text-secondary text-sm">Đang tải...</p>
      </div>
    </div>
  );
}
