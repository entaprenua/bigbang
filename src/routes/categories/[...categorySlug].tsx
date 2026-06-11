import { A } from "@solidjs/router"
import { Category, CategoryName, CategoryImage, CategorySubcategories } from "~/components/ui/category"
import { ProductList, } from "~/components/ui/product"
import { Grid } from "~/components/ui/grid"
import { Text } from "~/components/ui/text"
import { CollectionContent, CollectionView } from "~/components/ui/collection"
import ProductCard from "~/components/product-card"
import { Suspense } from "solid-js"
import { StoreName } from "~/components/store"
import { CategoryDetailSkeleton } from "~/components/loading/category-detail-skeleton"

function CategoryCard() {
  return (
    <Category href="categories" class="group m-1">
      <div class="relative overflow-hidden rounded-lg">
        <CategoryImage class="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div class="p-4 text-center">
        <CategoryName class="font-semibold group-hover:text-primary transition-colors" />
      </div>
    </Category>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
    <Category>
      <div class="container mx-auto px-4 py-8">
        <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <A href="/" class="hover:text-foreground transition-colors"><StoreName /></A>
          <span>/</span>
          <A href="/categories" class="hover:text-foreground transition-colors">Categories</A>
          <span>/</span>
          <span class="text-foreground"><CategoryName /></span>
        </nav>
        <Text variant="h1" class="text-3xl font-bold mb-8">
          <CategoryName />
        </Text>
      </div>

      <CategorySubcategories>
        <CollectionContent>
          <div class="container mx-auto px-4 pb-8">
            <Text variant="h2" class="text-xl font-semibold mb-4">Subcategories</Text>
            <Grid cols={2} colsSm={2} colsMd={3} colsLg={4}>
              <CollectionView>
                <CategoryCard />
              </CollectionView>
            </Grid>
          </div>
        </CollectionContent>
      </CategorySubcategories>

      <div class="container mx-auto px-4 pb-12">
        <ProductList>
          <CollectionContent>
            <Text variant="h2" class="text-xl font-semibold mb-4">Products</Text>
            <Grid cols={2} colsSm={2} colsMd={3} colsLg={4}>
              <CollectionView>
                <ProductCard />
              </CollectionView>
            </Grid>
          </CollectionContent>
        </ProductList>
      </div>
    </Category>
    </Suspense>
  )
}
