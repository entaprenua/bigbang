import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "~/components/ui/breadcrumb"
import { ProductList, ProductPaginationProvider, ProductPaginationPrevious, ProductPaginationNext, ProductPaginationTotal } from "~/components/ui/product"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { Text } from "~/components/ui/text"
import { CollectionContent, CollectionView } from "~/components/ui/collection"
import ProductCard from "~/components/product-card"
import { Suspense } from "solid-js"
import { StoreName } from "~/components/store"

export default function ProductsPage() {
  return (
    <Suspense fallback={"Products loading...."}>
      <div class="bg-stone-50 min-h-screen">
        <div class="bg-white border-b">
          <div class="container mx-auto px-4 py-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" class="text-stone-500"><StoreName /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="m-1" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/categories" class="text-stone-800 font-medium">Products</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div class="container mx-auto px-4 py-12">
          <Flex class="flex-col items-center mb-12">
            <Text variant="h1" class="text-3xl font-serif font-light">Our Collection</Text>
            <Text class="text-stone-500 mt-2">Browse our curated selection</Text>
          </Flex>

          <ProductPaginationProvider initialPageSize={50}>
            <ProductList>
              <CollectionContent>
                <Grid cols={2} colsSm={2} colsMd={3} colsLg={4} class="gap-4">
                  <CollectionView>
                    <ProductCard />
                  </CollectionView>
                </Grid>
              </CollectionContent>
            </ProductList>

            <div class="flex items-center justify-center gap-4 mt-8">
              <ProductPaginationPrevious />
              <ProductPaginationTotal class="text-muted-foreground" />
              <ProductPaginationNext />
            </div>
          </ProductPaginationProvider>
        </div>
      </div>
    </Suspense>
  )
}
