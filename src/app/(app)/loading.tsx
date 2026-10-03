export default function Loading() {
  const b = "animate-pulse rounded-2xl bg-border/60";
  return (
    <div aria-busy="true">
      <div className={`${b} h-9 w-56`} /><div className={`${b} mt-3 h-4 w-72`} />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className={`${b} h-28`} />)}</div>
      <div className={`${b} mt-6 h-64`} />
    </div>
  );
}
