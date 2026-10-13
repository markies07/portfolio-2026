// Lightweight CSS laptop-frame mockup — no external device-mockup image assets.

export default function DeviceMockup({ children, rotate = "-rotate-2", className = "" }) {
  return (
    <div className={`${rotate} transition-transform duration-500 hover:rotate-0 ${className}`}>
      <div className="relative rounded-t-xl border-6 border-b-0 border-[#2a2a2a] bg-[#111111] shadow-2xl">
        <span
          className="absolute left-1/2 top-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-paper/20"
          aria-hidden="true"
        />
        <div className="aspect-16/10 overflow-hidden rounded-sm">{children}</div>
      </div>
      <div className="mx-auto h-2 w-[70%] rounded-b-md bg-[#2a2a2a]" aria-hidden="true" />
      <div className="mx-auto h-1 w-[85%] rounded-b-lg bg-[#1a1a1a]" aria-hidden="true" />
    </div>
  );
}
