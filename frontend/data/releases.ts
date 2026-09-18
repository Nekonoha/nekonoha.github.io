import catalog from './releases.json'
export type MusicRelease = {
  id: string
  title: string
  titleEn: string
  releaseDate: string
  artwork: string
  linkcoreUrl: string
  type: string
  trackCount: number
  spotifyId?: string
}
export const musicReleases: MusicRelease[] = catalog.releases
export const releaseCheckedAt = catalog.checkedAt
