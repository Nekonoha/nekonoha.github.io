import catalog from './booth.json'

export interface BoothItem {
  id: string
  name: string
  price: string
  category: string
  soldOut: boolean
  endOfSale: boolean
  // 商品ページの公開日時。取れなかったときは null。
  publishedAt?: string | null
  url: string
  image: string
}

export const boothItems = catalog.items as BoothItem[]
export const boothCheckedAt = catalog.checkedAt
