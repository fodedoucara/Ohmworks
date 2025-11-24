export default function RGBLEDIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="10" fill="red" stroke="#000" strokeWidth="2"/>
      <circle cx="32" cy="32" r="7" fill="green"/>
      <circle cx="32" cy="32" r="4" fill="blue"/>
    </svg>
  );
}
