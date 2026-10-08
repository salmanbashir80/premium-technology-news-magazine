export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside
      aria-label="Key takeaways"
      className="border-y-2 border-emerald bg-emerald-soft/60 px-4 py-5 sm:px-6 sm:py-6"
    >
      <p className="kicker">Key takeaways</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 font-serif text-[15px] leading-[1.6] text-ink-soft sm:text-base"
          >
            <span className="mt-[0.6em] h-1 w-1 shrink-0 bg-emerald" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
