interface PhotoCounterProps {
  count: number;
}

export const PhotoCounter = ({ count }: PhotoCounterProps) => {
  return (
    <div className="bg-primary/10 rounded-full px-6 py-2 inline-block">
      <span className="text-xl font-semibold">
        Photos: <span className="text-accent">{count}</span>
      </span>
    </div>
  );
};