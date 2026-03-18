import { getMentalLabel } from '../storage';

interface Props {
  mental: number;
  size?: 'sm' | 'lg';
}

export default function MentalBadge({ mental, size = 'sm' }: Props) {
  const { label, color } = getMentalLabel(mental);
  return (
    <span
      className={`mental-badge mental-badge-${size}`}
      style={{ borderColor: color, color }}
    >
      {mental} — {label}
    </span>
  );
}
