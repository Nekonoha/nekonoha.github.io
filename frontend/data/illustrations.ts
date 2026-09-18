import catalog from './illustrations.json'

export interface Illustration {
  id: string
  title: string
  postedAt: string
  width: number
  height: number
  pageCount: number
  tags: string[]
  pixivUrl: string
  image: string
}

export const illustrations = catalog.illustrations as Illustration[]
export const illustrationsCheckedAt = catalog.checkedAt
