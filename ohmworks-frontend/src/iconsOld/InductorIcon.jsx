export default function InductorIcon({ size = 30, color = "#000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <polyline points="10,32 18,32 22,24 28,40 34,24 40,40 46,24 54,32" stroke={color} strokeWidth="4" fill="none"/>
    </svg>
  );
}
