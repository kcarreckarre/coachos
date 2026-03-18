interface Props {
  label: string;
  value: number;
  color?: string;
}

export default function StatBar({ label, value, color = '#ff4655' }: Props) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-header">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-track">
        <div
          className="stat-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
