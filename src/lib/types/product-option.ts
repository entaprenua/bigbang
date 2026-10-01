export interface ProductOption {
  id: string
  name: string
  values: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  value: string
}

export type ProductOptionValues = Record<string, string>
