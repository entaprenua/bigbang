import { CollectionContent, CollectionItems } from "~/components/ui/collection"
import { Categories, Category, CategoryName, CategoryImage } from "~/components/ui/category"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "~/components/ui/breadcrumb"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { Text } from "~/components/ui/text"
import { StoreName } from "~/components/store"

export default function CategoriesPage() {
  return (
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
                <BreadcrumbLink href="/categories" class="text-stone-800 font-medium">Categories</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <Flex class="flex-col items-center mb-12">
          <Text variant="h1" class="text-3xl font-serif font-light">Shop by category</Text>
        </Flex>

        <Categories mode="root">
          <CollectionContent>
            <Grid cols={2} colsSm={2} colsMd={3} colsLg={4}>
              <CollectionItems>
                <Category href="categories" class="group">
                  <div class="relative overflow-hidden rounded-lg aspect-[4/5]">
                    <CategoryImage class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div class="absolute bottom-6 left-6 right-6">
                      <CategoryName class="text-white text-lg font-serif" />
                    </div>
                  </div>
                </Category>
              </CollectionItems>
            </Grid>
          </CollectionContent>
        </Categories>
      </div>
    </div>
  )
}
