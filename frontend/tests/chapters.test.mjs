import test from 'node:test'
import assert from 'node:assert/strict'
import { groupByChapter } from '../utils/chapters.mjs'

const episodes = [1, 2, 3, 4, 5].map(number => ({ number, title: `第${number}話` }))
const shape = groups => groups.map(group => [group.title, group.items.map(item => item.episode.number)])

test('章の指定がなければ、ひとまとまりのまま', () => {
  assert.deepEqual(shape(groupByChapter(episodes, undefined)), [[null, [1, 2, 3, 4, 5]]])
  assert.deepEqual(shape(groupByChapter(episodes, [])), [[null, [1, 2, 3, 4, 5]]])
})
test('from の話から章が変わる', () => {
  const chapters = [{ from: 4, title: '第二章' }, { from: 1, title: '第一章' }]
  assert.deepEqual(shape(groupByChapter(episodes, chapters)), [['第一章', [1, 2, 3]], ['第二章', [4, 5]]])
})
test('最初の章より前の話は、見出しなしで先に並ぶ', () => {
  assert.deepEqual(shape(groupByChapter(episodes, [{ from: 3, title: '本編' }])), [[null, [1, 2]], ['本編', [3, 4, 5]]])
})
test('通し番号は章をまたいで続く', () => {
  const groups = groupByChapter(episodes, [{ from: 1, title: 'A' }, { from: 3, title: 'B' }])
  assert.deepEqual(groups[1].items.map(item => item.index), [2, 3, 4])
})
test('抜けた番号や、こわれた指定があっても落ちない', () => {
  const sparse = [1, 2, 10].map(number => ({ number, title: '' }))
  const chapters = [{ from: 5, title: '後半' }, { title: '番号なし' }, { from: 2, title: '  ' }, null]
  assert.deepEqual(shape(groupByChapter(sparse, chapters)), [[null, [1, 2]], ['後半', [10]]])
})
