import { HeroRoot, HeroItems, HeroItem, HeroBackground, HeroContent, HeroTitle, HeroSubtitle, HeroDescription, HeroCtaPrimary, HeroCtaSecondary } from "~/components/ui/hero"
import { CategoryList, Category, CategoryImage, CategoryName } from "~/components/ui/category"
import { RecommendationsRoot, RecommendationsItems } from "~/components/ui/recommendations"
import { Product, ProductImage, ProductName, ProductPrice, ProductComparePrice, ProductDiscount, ProductInStockBadge, ProductLowStockBadge, ProductOutOfStockBadge, ProductAddToCartTrigger } from "~/components/ui/product"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "~/components/ui/carousel"
import { Grid } from "~/components/ui/grid"
import { Flex } from "~/components/ui/flex"
import { Text } from "~/components/ui/text"
import { CollectionView, CollectionContent } from "~/components/ui/collection"
import ProductCard from "~/components/product-card"

function HeroSection() {
  return (
    <HeroRoot class="w-full">
      <Carousel autoplay opts={{ loop: true }} class="group">
        <CarouselContent>
          <HeroItems>
            <CollectionView>
              <CarouselItem class="w-full">
                <HeroItem aspectRatio="2/1" maxHeight={500}>
                  <HeroBackground />
                  <HeroContent contentPosition="center">
                    <HeroSubtitle />
                    <HeroTitle />
                    <HeroDescription />
                    <Flex class="gap-3 mt-6">
                      <HeroCtaPrimary />
                      <HeroCtaSecondary />
                    </Flex>
                  </HeroContent>
                </HeroItem>
              </CarouselItem>
            </CollectionView>
          </HeroItems>
        </CarouselContent>
        <CarouselNext class="right-4" />
        <CarouselPrevious class="left-4" />
      </Carousel>
    </HeroRoot>
  )
}

function CategorySection() {
  return (
    <section class="py-12">
      <div class="px-4">
        <CategoryList>
          <CollectionContent>
            <Text variant="h2" class="text-xl font-bold text-center mb-2">Shop by Category</Text>
            <Text class="text-muted-foreground text-center mb-8 text-sm">Find what you need</Text>
            <Grid cols={2} colsMd={3} colsLg={4} class="gap-4">
              <CollectionView>
                <Category href="/categories" class="group">
                  <div class="relative overflow-hidden rounded-xl aspect-square bg-muted">
                    <CategoryImage class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div class="absolute bottom-3 left-3 right-3">
                      <CategoryName class="text-white text-sm font-semibold" />
                    </div>
                  </div>
                </Category>
              </CollectionView>
            </Grid>
          </CollectionContent>
        </CategoryList>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />

      <section class="py-12">
        <div class="px-4">
          <RecommendationsRoot type="newest" limit={8}>
            <RecommendationsItems>
              <CollectionContent>
                <Flex class="flex-col items-center mb-8">
                  <Text variant="h2" class="text-xl font-bold">New Arrivals</Text>
                  <Text class="text-muted-foreground text-sm mt-1">Fresh drops for you</Text>
                </Flex>
                <Grid cols={2} colsMd={3} colsLg={4} class="gap-4">
                  <CollectionView>
                    <ProductCard />
                  </CollectionView>
                </Grid>
              </CollectionContent>
            </RecommendationsItems>
          </RecommendationsRoot>
        </div>
      </section>

      <section class="py-12 bg-muted/30">
        <div class="px-4">
          <RecommendationsRoot type="popular" limit={8}>
            <RecommendationsItems>
              <CollectionContent>
                <Flex class="flex-col items-center mb-8">
                  <Text variant="h2" class="text-xl font-bold">Popular</Text>
                  <Text class="text-muted-foreground text-sm mt-1">Most ordered this month</Text>
                </Flex>
                <Grid cols={2} colsMd={3} colsLg={4} class="gap-4">
                  <CollectionView>
                    <ProductCard />
                  </CollectionView>
                </Grid>
              </CollectionContent>
            </RecommendationsItems>
          </RecommendationsRoot>
        </div>
      </section>
    </>
  )
}
