import { Skeleton } from "~/components/ui/skeleton"
import { Repeat } from "~/components/ui/repeat"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { ProductCardSkeleton } from "./product-card-skeleton"

export function ProductGridSkeleton() {
  return (
    <div class="min-h-screen bg-background">
      <div class="border-b border-border bg-background">
        <div class="container mx-auto px-4 py-6">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <Skeleton class="h-4 w-20" />
            <span class="text-muted-foreground/50">/</span>
            <Skeleton class="h-4 w-16" />
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <Flex class="flex-col items-center mb-12">
          <Skeleton class="h-8 w-48" />
          <Skeleton class="h-4 w-36 mt-3" />
        </Flex>

        <Grid cols={2} colsSm={2} colsMd={3} colsLg={4} class="gap-4">
          <Repeat count={8}>
            <ProductCardSkeleton />
          </Repeat>
        </Grid>
      </div>
    </div>
  )
}
