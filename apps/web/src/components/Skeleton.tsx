/** Bloque de carga (shimmer). Decorativo: se marca aria-hidden. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-border ${className}`} />;
}
