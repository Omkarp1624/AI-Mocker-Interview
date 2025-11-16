/**
 * Tailwind classnames helper (simple)
 * Usage: cn("p-2", condition && "text-red")
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
