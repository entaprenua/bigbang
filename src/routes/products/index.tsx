import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "~/components/ui/breadcrumb"
import { Products, ProductPaginationProvider, ProductPaginationPrevious, ProductPaginationNext, ProductPaginationTotal } from "~/components/ui/product"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { Text } from "~/components/ui/text"
import { CollectionContent, CollectionItems } from "~/components/ui/collection"
import { RecommendationsRoot, RecommendationsItems, RecommendationsTitle } from "~/components/ui/recommendations"
import ProductCard from "~/components/product-card"
import { Suspense } from "solid-js"
import { StoreName } from "~/components/store"
import { ProductGridSkeleton } from "~/components/loading/product-grid-skeleton"

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <div class="min-h-screen bg-background">
        <div class="border-b border-border bg-background">
          <div class="container mx-auto px-4 py-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" class="text-muted-foreground"><StoreName /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="m-1" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/categories" class="font-medium text-foreground">Products</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div class="container mx-auto px-4 py-12">
          <ProductPaginationProvider initialPageSize={200}>
            <Products>
              <CollectionContent>
                <Grid cols={2} colsSm={3} colsMd={4} colsLg={5} colsXl={6} class="gap-4">
                  <CollectionItems>
                    <ProductCard />
                  </CollectionItems>
                </Grid>
              </CollectionContent>
            </Products>

            <div class="flex items-center justify-center gap-4 mt-8">
              <ProductPaginationPrevious />
              <ProductPaginationTotal class="text-muted-foreground" />
              <ProductPaginationNext />
            </div>
          </ProductPaginationProvider>

          <section class="mt-16">
            <div>
              <RecommendationsRoot type="recently_viewed" limit={10}>
                <RecommendationsItems>
                  <CollectionContent>
                    <Flex class="flex-col items-center mb-8">
                      <RecommendationsTitle class="text-xl font-semibold mb-2">Recently viewed</RecommendationsTitle>
                    </Flex>
                    <Grid cols={2} colsSm={3} colsMd={4} colsLg={5} colsXl={6} class="gap-4">
                      <CollectionItems>
                        <ProductCard />
                      </CollectionItems>
                    </Grid>
                  </CollectionContent>
                </RecommendationsItems>
              </RecommendationsRoot>
            </div>
          </section>

          <section class="mt-16">
            <div>
              <RecommendationsRoot type="popular" limit={10}>
                <RecommendationsItems>
                  <CollectionContent>
                    <Flex class="flex-col items-center mb-8">
                      <RecommendationsTitle class="text-xl font-semibold mb-2">Popular</RecommendationsTitle>
                    </Flex>
                    <Grid cols={2} colsSm={3} colsMd={4} colsLg={5} colsXl={6} class="gap-4">
                      <CollectionItems>
                        <ProductCard />
                      </CollectionItems>
                    </Grid>
                  </CollectionContent>
                </RecommendationsItems>
              </RecommendationsRoot>
            </div>
          </section>
        </div>
      </div>
    </Suspense>
  )
}
