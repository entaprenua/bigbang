import { Skeleton } from "~/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div class="overflow-hidden rounded-lg border bg-card">
      <Skeleton class="aspect-[4/5] w-full" />
      <div class="p-3 space-y-2">
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/3" />
      </div>
    </div>
  )
}
