type StockMeterProps = {
  stock: number;
  max?: number;
};

export default function StockMeter({ stock, max = 30 }: StockMeterProps) {
  const percentage = Math.min((stock / max) * 100, 100);
  const level =
    stock === 0 ? 'out' : stock <= 5 ? 'low' : stock <= 15 ? 'medium' : 'high';

  const colors = {
    out: 'bg-charcoal/30',
    low: 'bg-red-500',
    medium: 'bg-amber-500',
    high: 'bg-emerald-500',
  };

  const labels = {
    out: 'Out of Stock',
    low: `Only ${stock} left — order soon!`,
    medium: `${stock} in stock`,
    high: `${stock} in stock — plenty available`,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-charcoal">Availability</span>
        <span className={`font-medium ${level === 'out' ? 'text-charcoal/50' : level === 'low' ? 'text-red-600' : 'text-charcoal/70'}`}>
          {labels[level]}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-charcoal/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[level]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
