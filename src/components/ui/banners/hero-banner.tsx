import { type JSX } from "solid-js"
import { Query, useQueryState } from "../query"
import { BannerProvider } from "./banner-context"
import { bannersApi } from "~/lib/api/banners"
import type { Banner } from "~/lib/types"

type HeroProps = {
  children?: JSX.Element
}

/**
 * Hero is the root banner at position 0; its children are the slides.
 *
 * Fetches the first root banner and provides it through BannerContext so the
 * regular banner sections (BannerImage, BannerTitle, BannerCtaLink, ...)
 * can render it. Pass `data` to provide the hero directly and skip fetching.
 */
const Hero = (props: HeroProps) => {
  return (
    <Query
      queryFn={() => bannersApi.getHero()}
      queryKey={["hero"]}
      enabled={true}
    >
      <HeroContent>{props.children}</HeroContent>
    </Query>
  )
}

const HeroContent = (props: { children?: JSX.Element }) => {
  const query = useQueryState()
  const hero = () => (query?.data as Banner | null) ?? null

  return (
    <BannerProvider data={hero()}>
      {props.children}
    </BannerProvider>
  )
}

export { Hero }
export type { HeroProps }
