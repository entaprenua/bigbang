import { createContext, useContext, createMemo, For, splitProps, type JSX } from 'solid-js'
import { cn } from '~/lib/utils'
import { useCheckout } from './checkout-context'
import { useCheckoutSettingsOptional } from './checkout-settings'
import { Collection, useCollectionItem } from '../collection'

function parseMethods(raw: string | null | undefined): Record<string, {
  label: string
  price: number
  conditions?: string
  classPrices?: Record<string, number>
  estMinDays?: number
  estMaxDays?: number
}> {
  try { return JSON.parse(raw ?? '{}') } catch { return {} }
}

function parseLocations(raw: string | null | undefined): string[] {
  try { return JSON.parse(raw ?? '[]') } catch { return [] }
}

function useMatchedZone() {
  const collectionItem = useCollectionItem()
  return createMemo(() => collectionItem?.item ?? null)
}

function useMatchedMethod() {
  const zone = useMatchedZone()
  const { formData } = useCheckout()
  return createMemo(() => {
    const name = formData.deliveryMethod
    if (!name) return null
    const methods = parseMethods(zone()?.methods)
    return methods[name] ?? null
  })
}

// ─── CheckoutDeliveryZones ──────────────────────────────────────────

type CheckoutDeliveryZonesProps = {
  children?: JSX.Element
}

function CheckoutDeliveryZones(props: CheckoutDeliveryZonesProps) {
  const settingsCtx = useCheckoutSettingsOptional()
  const zones = createMemo(() => settingsCtx?.settings().deliveryZones ?? [])
  return (
    <Collection data={zones()}>
      {props.children}
    </Collection>
  )
}

// ─── CheckoutDeliveryZoneName ────────────────────────────────────────

type CheckoutDeliveryZoneNameProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneName(props: CheckoutDeliveryZoneNameProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const collectionItem = useCollectionItem()
  return (
    <span class={cn(local.class)}>
      {local.children ?? collectionItem?.item?.name}
    </span>
  )
}

// ─── CheckoutDeliveryZoneMethod ──────────────────────────────────────

type CheckoutDeliveryZoneMethodProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethod(props: CheckoutDeliveryZoneMethodProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()
  return method() ? <div class={cn(local.class)}>{local.children}</div> : null
}

// ─── CheckoutDeliveryZoneMethodLabel ─────────────────────────────────

type CheckoutDeliveryZoneMethodLabelProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodLabel(props: CheckoutDeliveryZoneMethodLabelProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()
  return <span class={local.class}>{local.children ?? method()?.label}</span>
}

// ─── CheckoutDeliveryZoneMethodPrice ─────────────────────────────────

type CheckoutDeliveryZoneMethodPriceProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodPrice(props: CheckoutDeliveryZoneMethodPriceProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()
  return (
    <span class={cn('text-lg font-bold', local.class)}>
      {local.children ?? method()?.price}
    </span>
  )
}

// ─── CheckoutDeliveryZoneMethodMinDays ───────────────────────────────

type CheckoutDeliveryZoneMethodMinDaysProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodMinDays(props: CheckoutDeliveryZoneMethodMinDaysProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()
  return method() && method()!.estMinDays != null ? (
    <span class={cn('text-sm text-muted-foreground', local.class)}>
      {local.children ?? `${method()!.estMinDays} day(s)`}
    </span>
  ) : null
}

// ─── CheckoutDeliveryZoneMethodMaxDays ───────────────────────────────

type CheckoutDeliveryZoneMethodMaxDaysProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodMaxDays(props: CheckoutDeliveryZoneMethodMaxDaysProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()
  return method() && method()!.estMaxDays != null ? (
    <span class={cn('text-sm text-muted-foreground', local.class)}>
      {local.children ?? `${method()!.estMaxDays} day(s)`}
    </span>
  ) : null
}

// ─── Conditions ──────────────────────────────────────────────────

type MethodConditionEntry = { field: string; value: string }

const MethodConditionContext = createContext<MethodConditionEntry>()

function useMethodCondition(): MethodConditionEntry {
  const ctx = useContext(MethodConditionContext)
  if (!ctx) throw new Error('Must be inside CheckoutDeliveryZoneMethodConditions')
  return ctx
}

type CheckoutDeliveryZoneMethodConditionsProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodConditions(props: CheckoutDeliveryZoneMethodConditionsProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()

  const entries = createMemo(() => {
    const raw = method()?.conditions
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      return Object.entries(parsed)
        .filter(([, v]) => v != null)
        .map(([field, value]) => ({ field, value: formatConditionValue(value) }))
    } catch {
      return []
    }
  })

  return (
    <For each={entries()}>
      {(entry) => (
        <MethodConditionContext.Provider value={entry}>
          {local.children}
        </MethodConditionContext.Provider>
      )}
    </For>
  )
}

type CheckoutDeliveryZoneMethodConditionLabelProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodConditionLabel(props: CheckoutDeliveryZoneMethodConditionLabelProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const { field } = useMethodCondition()
  return (
    <span class={cn('text-sm font-medium', local.class)}>
      {local.children ?? formatFieldLabel(field)}
    </span>
  )
}

type CheckoutDeliveryZoneMethodConditionValueProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodConditionValue(props: CheckoutDeliveryZoneMethodConditionValueProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const { value } = useMethodCondition()
  return (
    <span class={cn('text-sm text-muted-foreground', local.class)}>
      {local.children ?? value}
    </span>
  )
}

// ─── Class Prices ────────────────────────────────────────────────

type ClassPriceEntry = { classId: string; price: number }

const ClassPriceContext = createContext<ClassPriceEntry>()

function useClassPrice(): ClassPriceEntry {
  const ctx = useContext(ClassPriceContext)
  if (!ctx) throw new Error('Must be inside CheckoutDeliveryZoneMethodClassPrices')
  return ctx
}

type CheckoutDeliveryZoneMethodClassPricesProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodClassPrices(props: CheckoutDeliveryZoneMethodClassPricesProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const method = useMatchedMethod()

  const entries = createMemo(() => {
    const prices = method()?.classPrices
    if (!prices) return []
    return Object.entries(prices).map(([classId, price]) => ({ classId, price }))
  })

  return (
    <For each={entries()}>
      {(entry) => (
        <ClassPriceContext.Provider value={entry}>
          {local.children}
        </ClassPriceContext.Provider>
      )}
    </For>
  )
}

type CheckoutDeliveryZoneMethodClassPriceLabelProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodClassPriceLabel(props: CheckoutDeliveryZoneMethodClassPriceLabelProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const { classId } = useClassPrice()
  return (
    <span class={cn('text-sm font-medium', local.class)}>
      {local.children ?? classId}
    </span>
  )
}

type CheckoutDeliveryZoneMethodClassPriceValueProps = { class?: string; children?: JSX.Element }

function CheckoutDeliveryZoneMethodClassPriceValue(props: CheckoutDeliveryZoneMethodClassPriceValueProps) {
  const [local] = splitProps(props, ['class', 'children'])
  const { price } = useClassPrice()
  return (
    <span class={cn('text-sm text-muted-foreground', local.class)}>
      {local.children ?? price}
    </span>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────

function formatFieldLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function formatConditionValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value
  return String(value)
}

export {
  CheckoutDeliveryZones,
  CheckoutDeliveryZoneName,
  CheckoutDeliveryZoneMethod,
  CheckoutDeliveryZoneMethodLabel,
  CheckoutDeliveryZoneMethodPrice,
  CheckoutDeliveryZoneMethodMinDays,
  CheckoutDeliveryZoneMethodMaxDays,
  CheckoutDeliveryZoneMethodConditions,
  CheckoutDeliveryZoneMethodConditionLabel,
  CheckoutDeliveryZoneMethodConditionValue,
  CheckoutDeliveryZoneMethodClassPrices,
  CheckoutDeliveryZoneMethodClassPriceLabel,
  CheckoutDeliveryZoneMethodClassPriceValue,
  parseLocations,
  parseMethods,
}
