export default function DiodeIcon({ size = 30, color = "#000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <line x1="10" y1="32" x2="50" y2="32" stroke={color} strokeWidth="4"/>
      <polygon points="40,24 50,32 40,40" fill={color}/>
    </svg>
  );
}
