import { Banners, Banner, Subbanners, Hero, BannerImage, BannerTitle, BannerSubtitle, BannerCtaText, BannerCtaLink } from "~/components/ui/banners"
import { RecommendationsRoot, RecommendationsItems } from "~/components/ui/recommendations"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "~/components/ui/carousel"
import { Grid } from "~/components/ui/grid"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import { CollectionItems, CollectionContent } from "~/components/ui/collection"
import { Product, ProductImage, ProductName } from "~/components/ui/product"
import { Suspense } from "solid-js"

function RecommendationCard() {
  return (
    <Product href="/products" class="block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
      <div class="relative overflow-hidden bg-muted">
        <ProductImage class="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div class="p-2">
        <div class="text-xs font-medium line-clamp-2 leading-snug"><ProductName /></div>
      </div>
    </Product>
  )
}

function HeroSection() {
  return (
    <Hero>
      <Carousel autoplay opts={{ loop: true }} class="group">
        <CarouselContent>
          <Subbanners>
            <CollectionItems>
              <CarouselItem class="w-full">
                <Banner class="relative w-full overflow-hidden aspect-[2/1] max-h-[350px]">
                  <BannerImage class="absolute inset-0 size-full object-cover" />
                  <div class="absolute inset-0 bg-black/40" />
                  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8">
                    <BannerSubtitle class="text-sm uppercase tracking-wider mb-2 text-white/90 drop-shadow-md" />
                    <BannerTitle class="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-md" />
                    <BannerCtaLink class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      <BannerCtaText />
                    </BannerCtaLink>
                  </div>
                </Banner>
              </CarouselItem>
            </CollectionItems>
          </Subbanners>
        </CarouselContent>
        <CarouselNext class="right-4" />
        <CarouselPrevious class="left-4" />
      </Carousel>
    </Hero>
  )
}

function BannerSection() {
  return (
    <section class="px-4 my-2">
      <Banners>
        <CollectionContent>
          <Grid cols={1} colsMd={2} colsLg={3} class="gap-4">
            <CollectionItems>
              <Banner class="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                <BannerImage class="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="p-4 pb-2">
                  <BannerTitle class="block text-lg font-semibold leading-tight" />
                  <BannerSubtitle class="block text-sm text-muted-foreground" />
                </div>
                <Subbanners>
                  <CollectionContent>
                    <Grid cols={2} class="gap-2 px-4">
                      <CollectionItems>
                        <Banner class="group/tile relative aspect-square overflow-hidden rounded-lg bg-muted">
                          <BannerImage class="size-full object-cover transition-transform duration-300 group-hover/tile:scale-105" />
                          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <BannerTitle class="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white" />
                        </Banner>
                      </CollectionItems>
                    </Grid>
                  </CollectionContent>
                </Subbanners>
                <div class="mt-auto p-4 pt-3">
                  <BannerCtaLink class="text-sm font-medium text-primary underline">
                    <BannerCtaText />
                  </BannerCtaLink>
                </div>
              </Banner>
            </CollectionItems>
          </Grid>
        </CollectionContent>
      </Banners>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BannerSection />

      <section>
        <Card class="overflow-hidden">
          <RecommendationsRoot type="newest" limit={8}>
            <RecommendationsItems>
              <CollectionContent>
                <CardHeader class="items-center text-center">
                  <CardTitle>New Arrivals</CardTitle>
                  <CardDescription>Fresh drops for you</CardDescription>
                </CardHeader>
                <Carousel class="group w-full">
                  <CarouselContent>
                    <CollectionItems>
                      <CarouselItem class="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                        <RecommendationCard />
                      </CarouselItem>
                    </CollectionItems>
                  </CarouselContent>
                  <CarouselPrevious class="left-2" />
                  <CarouselNext class="right-2" />
                </Carousel>
              </CollectionContent>
            </RecommendationsItems>
          </RecommendationsRoot>
        </Card>
      </section>

      <section class="py-12">
        <Card class="overflow-hidden">
          <Suspense fallback={"Loading recommendations"}>
            <RecommendationsRoot type="popular" limit={8}>
              <RecommendationsItems>
                <CollectionContent>
                  <CardHeader class="items-center text-center">
                    <CardTitle>Popular</CardTitle>
                    <CardDescription>Most ordered this month</CardDescription>
                  </CardHeader>
                  <CardContent class="p-0">
                    <Carousel class="group w-full">
                      <CarouselContent>
                        <CollectionItems>
                          <CarouselItem class="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <RecommendationCard />
                          </CarouselItem>
                        </CollectionItems>
                      </CarouselContent>
                      <CarouselPrevious class="left-2" />
                      <CarouselNext class="right-2" />
                    </Carousel>
                  </CardContent>
                </CollectionContent>
              </RecommendationsItems>
            </RecommendationsRoot>
          </Suspense>
        </Card>
      </section>
    </>
  )
}
