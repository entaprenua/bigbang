import { Show, createEffect, splitProps, type JSX, createMemo } from "solid-js"
import { HeroProvider, useHero } from "./hero-context"
import { useHeroItem } from "./hero-sections"
import { Query, useQueryState } from "../query"
import { Collection } from "../collection"
import { Button } from "../button"
import { Flex } from "../flex"
import { cn } from "~/lib/utils"
import { heroApi } from "~/lib/api/heroes"
import type { Hero, HeroItem as HeroItemType } from "~/lib/types"

export type HeroRootProps = {
  heroId?: string
  storeId?: string | (() => string | null | undefined)
  queryKey?: unknown[]
  enabled?: boolean
  class?: string
  children?: JSX.Element
}

const HeroRoot = (props: HeroRootProps) => {
  const [local, others] = splitProps(props, [
    "heroId", "storeId", "queryKey", "enabled", "class", "children"
  ])

  const queryFn = async () => {
    return await heroApi.get()
  }

  const queryKey = createMemo(() => {
    return local.queryKey ?? ["hero", local.heroId]
  })
  return (
    <Query
      queryFn={queryFn}
      queryKey={queryKey()}
      enabled={local.enabled ?? true}
    >
      <HeroRootContent
        class={local.class}
      >{local.children}
      </HeroRootContent>
    </Query>
  )
}

const HeroRootContent = (props: { data?: Hero; class?: string; children?: JSX.Element }) => {
  const queryState = useQueryState()
  const data = () => queryState.data as Hero || undefined

  // hero-root.tsx — inside HeroRootContent, after <HeroProvider>
  const HeroDataSync = () => {
    const hero = useHero()
    const data = () => queryState?.data as Hero | undefined
    createEffect(() => {
      const d = data()
      if (!d) return
      hero.setHero(d)
      hero.setItems(d.items ?? [])
    })
    return null
  }

  return (
    <HeroProvider initialHero={data()}>
      <HeroDataSync />
      <div class={props.class}>{props.children}</div>
    </HeroProvider>
  )
}

export type HeroItemsProps = {
  class?: string
  children?: JSX.Element
}

const HeroItems = (props: HeroItemsProps) => {
  const hero = useHero()
  const items = createMemo(() => hero?.items() ?? [])
  const [local] = splitProps(props, ["class", "children"])

  return (
    <Collection data={items()}>
      {local.children}
    </Collection>
  )
}

export type HeroItemProps = {
  item?: HeroItemType
  aspectRatio?: string
  maxHeight?: number
  class?: string
  children?: JSX.Element
}

const HeroItem = (props: HeroItemProps) => {
  const hero = useHero()
  const [local, others] = splitProps(props, ["item", "aspectRatio", "maxHeight", "class", "children"])

  const heroItem = useHeroItem()

  const item = createMemo(() => local.item ?? heroItem() ?? null)

  const bgStyle = createMemo(() => {
    const i = item()
    if (!i) return {}

    if (i.backgroundType === 'gradient' && i.backgroundGradient) {
      return { background: i.backgroundGradient }
    }
    if (i.backgroundType === 'color' && i.backgroundColor) {
      return { 'background-color': i.backgroundColor }
    }
    if (i.backgroundType === 'image' && i.backgroundImageUrl) {
      return {
        'background-image': `url(${i.backgroundImageUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
      }
    }
    return {}
  })

  const positionClass = createMemo(() => {
    const i = item()
    const pos = i?.contentPosition ?? 'center'
    const map: Record<string, string> = {
      'top-left': 'items-start justify-start text-left',
      'top-center': 'items-start justify-center text-center',
      'top-right': 'items-start justify-end text-right',
      'center-left': 'items-center justify-start text-left',
      'center': 'items-center justify-center text-center',
      'center-right': 'items-center justify-end text-right',
      'bottom-left': 'items-end justify-start text-left',
      'bottom-center': 'items-end justify-center text-center',
      'bottom-right': 'items-end justify-end text-right',
    }
    return map[pos] ?? 'items-center justify-center text-center'
  })

  return (
    <Show when={item()}>
      <div
        class={cn("relative w-full overflow-hidden", local.class)}
        style={{
          'aspect-ratio': local.aspectRatio ?? '16/9',
          'max-height': local.maxHeight ? `${local.maxHeight}px` : undefined,
          ...bgStyle(),
        }}
        {...others}
      >
        <Show when={item()!.backgroundType === 'image' && item()!.overlayColor}>
          <div
            class="absolute inset-0"
            style={{
              'background-color': item()!.overlayColor!,
              opacity: Number(item()!.overlayOpacity ?? 0.3)
            }}
          />
        </Show>

        <Flex flexDirection="col" class={cn("relative z-10 p-8 h-full", positionClass())}>
          {local.children ?? (
            <>
              <Show when={item()!.subtitle}>
                <p class="text-sm uppercase tracking-wider mb-2" style={{ color: item()!.subtitleColor ?? 'white' }}>
                  {item()!.subtitle}
                </p>
              </Show>
              <Show when={item()!.title}>
                <p class="text-3xl md:text-5xl font-bold mb-4" style={{ color: item()!.titleColor ?? 'white' }}>
                  {item()!.title}
                </p>
              </Show>
              <Show when={item()!.description}>
                <p class="text-lg max-w-xl mb-6" style={{ color: item()!.descriptionColor ?? 'white' }}>
                  {item()!.description}
                </p>
              </Show>
              <Flex class={cn("gap-3", item()!.textAlignment === 'center' && 'justify-center', item()!.textAlignment === 'right' && 'justify-end')}>
                <Show when={item()!.ctaText && item()!.ctaUrl}>
                  <Button as="a" href={item()!.ctaUrl!} variant={item()!.ctaStyle as any} target={item()!.ctaTarget}>
                    {item()!.ctaText}
                  </Button>
                </Show>
                <Show when={item()!.ctaSecondaryText && item()!.ctaSecondaryUrl}>
                  <Button as="a" href={item()!.ctaSecondaryUrl!} variant={item()!.ctaSecondaryStyle as any} target={item()!.ctaSecondaryTarget}>
                    {item()!.ctaSecondaryText}
                  </Button>
                </Show>
              </Flex>
            </>
          )}
        </Flex>
      </div>
    </Show>
  )
}

export {
  HeroRoot,
  HeroProvider,
  HeroItems,
  HeroItem,
  useHero,
}
