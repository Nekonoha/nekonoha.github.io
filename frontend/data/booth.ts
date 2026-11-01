import catalog from './booth.json'

export interface BoothItem {
  id: string
  name: string
  price: string
  category: string
  soldOut: boolean
  endOfSale: boolean
  url: string
  image: string
}

export const boothItems = catalog.items as BoothItem[]
export const boothCheckedAt = catalog.checkedAt
