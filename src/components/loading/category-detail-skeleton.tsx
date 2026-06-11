import { Skeleton } from "~/components/ui/skeleton"
import { Repeat } from "~/components/ui/repeat"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { ProductCardSkeleton } from "./product-card-skeleton"

function CategoryCardSkeleton() {
  return (
    <div class="m-1">
      <div class="relative overflow-hidden rounded-lg">
        <Skeleton class="aspect-square w-full" />
      </div>
      <div class="p-4 text-center">
        <Skeleton class="h-4 w-24 mx-auto" />
      </div>
    </div>
  )
}

export function CategoryDetailSkeleton() {
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center gap-2 text-sm text-stone-400 mb-6">
        <Skeleton class="h-4 w-16" />
        <span class="text-stone-300">/</span>
        <Skeleton class="h-4 w-20" />
        <span class="text-stone-300">/</span>
        <Skeleton class="h-4 w-24" />
      </div>

      <Skeleton class="h-9 w-48 mb-8" />

      <div class="mb-8">
        <Skeleton class="h-6 w-32 mb-4" />
        <Grid cols={2} colsSm={2} colsMd={3} colsLg={4}>
          <Repeat count={4}>
            <CategoryCardSkeleton />
          </Repeat>
        </Grid>
      </div>

      <div>
        <Skeleton class="h-6 w-24 mb-4" />
        <Grid cols={2} colsSm={2} colsMd={3} colsLg={4} class="gap-4">
          <Repeat count={8}>
            <ProductCardSkeleton />
          </Repeat>
        </Grid>
      </div>
    </div>
  )
}
