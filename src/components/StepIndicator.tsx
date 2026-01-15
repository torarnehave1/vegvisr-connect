interface StepIndicatorProps {
  current: number;
  total: number;
  label: string;
}

const StepIndicator = ({ current, total, label }: StepIndicatorProps) => {
  const progress = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-white/80">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
