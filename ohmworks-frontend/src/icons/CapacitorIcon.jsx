export default function CapacitorIcon({ size = 30, color = "#000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <line x1="20" y1="10" x2="20" y2="54" stroke={color} strokeWidth="4"/>
      <line x1="44" y1="10" x2="44" y2="54" stroke={color} strokeWidth="4"/>
      <line x1="20" y1="32" x2="44" y2="32" stroke={color} strokeWidth="2"/>
    </svg>
  );
}
