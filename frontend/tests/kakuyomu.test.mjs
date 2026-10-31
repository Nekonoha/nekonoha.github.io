import test from 'node:test'
import assert from 'node:assert/strict'
import { renderLine, renderKakuyomu, parseEpisodeFile } from '../utils/kakuyomu.mjs'

test('縦棒つきルビ', () => {
  assert.equal(renderLine('｜針の筵《はりのむしろ》に座る'), '<ruby>針の筵<rp>(</rp><rt>はりのむしろ</rt><rp>)</rp></ruby>に座る')
  assert.equal(renderLine('|etc《エトセトラ》'), '<ruby>etc<rp>(</rp><rt>エトセトラ</rt><rp>)</rp></ruby>')
})
test('漢字の直後のルビは漢字だけに付く', () => {
  assert.equal(renderLine('彼は冒険《ぼうけん》に出た'), '彼は<ruby>冒険<rp>(</rp><rt>ぼうけん</rt><rp>)</rp></ruby>に出た')
})
test('傍点', () => {
  assert.equal(renderLine('それは《《違う》》'), 'それは<em class="bouten">違う</em>')
})
test('｜《 は《をそのまま表示する', () => {
  assert.equal(renderLine('漢字｜《そのまま》'), '漢字《そのまま》')
})
test('HTML は無効化される', () => {
  assert.equal(renderLine('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;')
  assert.ok(!renderLine('｜a《<img src=x onerror=1>》').includes('<img'))
})
test('空行は段落の空きとして残る', () => {
  assert.equal(renderKakuyomu('一行目\r\n\r\n二行目\n'), '<p>一行目</p>\n<p class="blank"><br></p>\n<p>二行目</p>')
})
test('ファイル名から話数とタイトルを読む', () => {
  assert.deepEqual(parseEpisodeFile('001 第1話 はじまり.txt'), { number: 1, title: '第1話 はじまり' })
  assert.deepEqual(parseEpisodeFile('12_夜.txt'), { number: 12, title: '夜' })
  assert.deepEqual(parseEpisodeFile('3.txt'), { number: 3, title: '第3話' })
  assert.equal(parseEpisodeFile('メモ.txt'), null)
})

test('話数の入力を位置に直す', async () => {
  const { resolveEpisodeInput } = await import('../utils/kakuyomu.mjs')
  assert.deepEqual(resolveEpisodeInput('12', 29), { index: 11 })
  assert.deepEqual(resolveEpisodeInput('１２', 29), { index: 11 })
  assert.deepEqual(resolveEpisodeInput(' 第3話 ', 29), { index: 2 })
  assert.deepEqual(resolveEpisodeInput('29', 29), { index: 28 })
  assert.deepEqual(resolveEpisodeInput('0', 29), { error: 'range' })
  assert.deepEqual(resolveEpisodeInput('30', 29), { error: 'range' })
  assert.deepEqual(resolveEpisodeInput('', 29), { error: 'empty' })
  assert.deepEqual(resolveEpisodeInput('abc', 29), { error: 'empty' })
  assert.deepEqual(resolveEpisodeInput('1.5', 29), { error: 'empty' })
  assert.deepEqual(resolveEpisodeInput('-2', 29), { error: 'empty' })
})
