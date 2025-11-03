export function HextechDivider() {
  return (
    <div className="w-[300px] flex items-center justify-center" aria-hidden="true">
      <div className="h-[1px] w-full bg-gradient-to-l from-yellow-600/80 via-yellow-400/30 to-transparent" />
      <div className="w-3 h-3 rotate-45 border border-yellow-600/80 mx-2" />
      <div className="h-[1px] w-full bg-gradient-to-r from-yellow-600/80 via-yellow-400/30 to-transparent" />
    </div>
  );
}
