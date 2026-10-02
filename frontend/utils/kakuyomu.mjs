// カクヨム記法の本文を、安全な HTML に変換する。
// 対応: ｜漢字《かんじ》 / 漢字《かんじ》 / 《《傍点》》 / ｜《 で《をそのまま表示
const KANJI = '[\\u4E00-\\u9FFF\\u3400-\\u4DBF\\uF900-\\uFAFF々〆ヵヶ仝]'
const escapeHtml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const OPEN = '' // 「｜《」で逃がした《の一時的な置き換え先

export const renderLine = line => {
  let text = escapeHtml(line).replace(/[｜|]《/g, OPEN)
  text = text.replace(/《《([^《》\n]+?)》》/g, '<em class="bouten">$1</em>')
  text = text.replace(/[｜|]([^｜|《》\n]+?)《([^《》\n]+?)》/g, '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>')
  text = text.replace(new RegExp(`(${KANJI}+)《([^《》\\n]+?)》`, 'g'), '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>')
  return text.replaceAll(OPEN, '《')
}

export const renderKakuyomu = source => String(source ?? '')
  .replace(/^﻿/, '')
  .replace(/\r\n?/g, '\n')
  .replace(/\n+$/, '')
  .split('\n')
  .map(line => line.trim() === '' ? '<p class="blank"><br></p>' : `<p>${renderLine(line)}</p>`)
  .join('\n')

// 「001 第1話 はじまり.txt」→ { number: 1, title: '第1話 はじまり' }
export const parseEpisodeFile = fileName => {
  const match = /^(\d+)[\s_.\-　]*(.*?)\.txt$/i.exec(fileName)
  if (!match) return null
  const number = Number.parseInt(match[1], 10)
  return { number, title: match[2].trim() || `第${number}話` }
}
