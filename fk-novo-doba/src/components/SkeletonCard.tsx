const SkeletonCard = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-[#12161f] rounded-xl ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/05 to-transparent" />
  </div>
);

export const SkeletonText = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-[#12161f] rounded-md ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/05 to-transparent" />
  </div>
);

export default SkeletonCard;
