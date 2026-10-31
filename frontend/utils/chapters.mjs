// novel.json の "chapters" をもとに、目次を章ごとのまとまりに分ける。
// chapters: [{ "from": 1, "title": "第一章　…" }, { "from": 22, "title": "第二章　…" }]
// from は、その章が始まる話の番号（ファイル名の先頭の数字）。
// 返り値: [{ title: string | null, items: [{ episode, index }] }]。index は目次の通し番号（0 始まり）。
export const groupByChapter = (episodes, chapters) => {
  const marks = (Array.isArray(chapters) ? chapters : [])
    .filter(chapter => chapter && Number.isFinite(chapter.from) && typeof chapter.title === 'string' && chapter.title.trim() !== '')
    .map(chapter => ({ from: chapter.from, title: chapter.title.trim() }))
    .sort((a, b) => a.from - b.from)
  const groups = []
  episodes.forEach((episode, index) => {
    // この話より前（同じ番号をふくむ）で始まる章のうち、いちばん後ろのもの。
    let title = null
    for (const mark of marks) { if (mark.from <= episode.number) title = mark.title; else break }
    const last = groups[groups.length - 1]
    if (last && last.title === title) last.items.push({ episode, index })
    else groups.push({ title, items: [{ episode, index }] })
  })
  return groups
}
