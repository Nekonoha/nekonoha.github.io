// API通信の共通処理例
export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('API error')
  return res.json()
}
