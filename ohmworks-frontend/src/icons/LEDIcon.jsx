export default function LEDIcon({ size = 30, color = "#ff0000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="10" fill={color} stroke="#000" strokeWidth="2"/>
      <line x1="32" y1="22" x2="32" y2="10" stroke="#000" strokeWidth="2"/>
      <line x1="32" y1="42" x2="32" y2="54" stroke="#000" strokeWidth="2"/>
    </svg>
  );
}
