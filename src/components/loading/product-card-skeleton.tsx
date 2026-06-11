import { Skeleton } from "~/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div class="bg-white rounded-lg border overflow-hidden">
      <Skeleton class="aspect-[4/5] w-full" />
      <div class="p-3 space-y-2">
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/3" />
      </div>
    </div>
  )
}
