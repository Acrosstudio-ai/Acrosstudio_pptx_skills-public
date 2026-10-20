import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { calculateCosts, calculateRoi } from './financials.mjs'

const ASSETS =
  'https://raw.githubusercontent.com/Acrosstudio-ai/Acrosstudio_pptx_skills-public/c1b1c61789e92c930fb9e71606c0a398c8b7af3f/skills/acrosstudio-pptx/assets/'
const yen = (value) => `${new Intl.NumberFormat('ja-JP').format(value)} 円`
const decimal = (value) =>
  new Intl.NumberFormat('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    value
  )

function text(value, name, max = 80) {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    /[\r\n]/.test(value) ||
    [...value].length > max
  ) {
    throw new Error(
      `${name} must be non-empty, single-line text up to ${max} characters; split long content into more pages`
    )
  }
  return value
}

function plans(input) {
  if (!Array.isArray(input.plans) || input.plans.length === 0)
    throw new Error('plans must explicitly list at least one named plan')
  return input.plans
}

function documentPages(input) {
  if ((input.type === 'cost' || input.type === 'roi') && input.currency !== 'JPY')
    throw new Error(
      'Financial slides require explicit currency JPY; no currency conversion is performed'
    )
  if (input.type === 'proposal' || input.type === 'meeting') {
    if (!Array.isArray(input.pages) || input.pages.length === 0)
      throw new Error('pages must contain the approved proposal or meeting content')
    return input.pages
  }
  if (input.type === 'cost') {
    return plans(input).flatMap((plan) => {
      text(plan.name, 'plan.name', 18)
      const result = calculateCosts(plan)
      const pages = []
      for (let i = 0; i < Math.max(plan.oneTimeCosts.length, plan.monthlyCosts.length); i += 4) {
        const cards = [
          ['初期費用', plan.oneTimeCosts],
          ['月額運用費', plan.monthlyCosts]
        ].flatMap(([title, items]) => {
          const rows = items.slice(i, i + 4)
          return rows.length
            ? [{ title, lines: rows.map((item) => `${item.name}: ${yen(item.amount)}`) }]
            : []
        })
        pages.push({ title: `${plan.name} 費用内訳`, lead: input.basis, cards })
      }
      pages.push({
        title: `${plan.name} 費用サマリー`,
        lead: input.basis,
        cards: [
          { title: '初期費用', lines: [yen(result.initialInvestment), '一時費用の合計'] },
          {
            title: '運用費',
            lines: [
              `月額: ${yen(result.monthlyOperatingCost)}`,
              `年額: ${yen(result.annualOperatingCost)}`
            ]
          },
          {
            title: '評価期間の総費用',
            lines: [
              `評価期間: ${result.years} 年`,
              yen(result.totalCost),
              '初期費用＋年額運用費×年数'
            ]
          }
        ]
      })
      return pages
    })
  }
  if (input.type === 'roi') {
    return plans(input).map((plan) => {
      text(plan.name, 'plan.name', 18)
      const result = calculateRoi(plan)
      return {
        title: `${plan.name} ROI 試算`,
        lead: input.basis,
        cards: [
          {
            title: '前提',
            lines: [
              `初期投資: ${yen(plan.initialInvestment)}`,
              `年間運用費: ${yen(plan.annualOperatingCost)}`,
              `年間効果: ${yen(plan.annualBenefit)}`,
              `評価期間: ${plan.years} 年`
            ]
          },
          {
            title: 'ネット効果と純利益',
            lines: [
              `年間ネット: ${yen(result.annualNetBenefit)}`,
              `累計ネット: ${yen(result.cumulativeNetBenefit)}`,
              `期間純利益: ${yen(result.netProfit)}`
            ]
          },
          {
            title: 'ROI・回収・総費用',
            lines: [
              result.roiPercent === null
                ? 'ROI: 算出不可（初期投資0）'
                : `ROI: ${decimal(result.roiPercent)}%`,
              result.paybackYears === null
                ? '回収期間: 効果不足'
                : `回収期間: ${decimal(result.paybackYears)} 年`,
              `期間総費用: ${yen(result.totalCost)}`
            ]
          }
        ]
      }
    })
  }
  throw new Error('type must be proposal, meeting, cost, or roi')
}

export function buildDeck(presentation, input) {
  text(input.title, 'title', 40)
  text(input.subtitle, 'subtitle', 60)
  text(input.versionDate, 'versionDate', 40)
  if (
    !Number.isInteger(input.copyrightYear) ||
    input.copyrightYear < 2000 ||
    input.copyrightYear > 9999
  )
    throw new Error('copyrightYear must be explicit')
  if (!presentation.revisionId)
    throw new Error('Read the newly created presentation with edit access before building')
  if ((presentation.slides ?? []).some((slide) => (slide.pageElements ?? []).length !== 0))
    throw new Error(
      'Builder only accepts a new, empty presentation; never overwrite an existing deck'
    )
  const points = (dimension) => {
    if (
      !dimension ||
      !['PT', 'EMU'].includes(dimension.unit) ||
      !Number.isFinite(dimension.magnitude) ||
      dimension.magnitude <= 0
    )
      throw new Error('Invalid pageSize')
    return dimension.unit === 'EMU' ? dimension.magnitude / 12700 : dimension.magnitude
  }
  const width = points(presentation.pageSize?.width),
    height = points(presentation.pageSize?.height)
  if (Math.abs(width / height - 16 / 9) > 0.01) throw new Error('A widescreen page is required')
  const k = width / 13.333333,
    fontScale = k / 72
  const pages = documentPages(input)
  const requests = []
  let count = 0
  const id = (kind) => `acros_${kind}_${++count}`
  const rgb = (hex) => ({
    red: parseInt(hex.slice(0, 2), 16) / 255,
    green: parseInt(hex.slice(2, 4), 16) / 255,
    blue: parseInt(hex.slice(4, 6), 16) / 255
  })
  const properties = (page, x, y, w, h) => ({
    pageObjectId: page,
    size: { width: { magnitude: w * k, unit: 'PT' }, height: { magnitude: h * k, unit: 'PT' } },
    transform: { scaleX: 1, scaleY: 1, translateX: x * k, translateY: y * k, unit: 'PT' }
  })
  const image = (page, file, x, y, w, h) =>
    requests.push({
      createImage: {
        objectId: id('image'),
        url: ASSETS + file,
        elementProperties: properties(page, x, y, w, h)
      }
    })
  const rectangle = (page, x, y, w, h, fill, line) => {
    const objectId = id('rect')
    requests.push(
      {
        createShape: {
          objectId,
          shapeType: 'RECTANGLE',
          elementProperties: properties(page, x, y, w, h)
        }
      },
      {
        updateShapeProperties: {
          objectId,
          shapeProperties: {
            shapeBackgroundFill: { solidFill: { color: { rgbColor: rgb(fill) } } },
            outline: line
              ? {
                  outlineFill: { solidFill: { color: { rgbColor: rgb(line) } } },
                  weight: { magnitude: 0.7 * fontScale, unit: 'PT' }
                }
              : { propertyState: 'NOT_RENDERED' }
          },
          fields: 'shapeBackgroundFill,outline'
        }
      }
    )
  }
  const box = (
    page,
    value,
    x,
    y,
    w,
    h,
    size,
    color,
    bold = false,
    fill,
    alignment = 'START',
    font = 'BIZ UDPGothic'
  ) => {
    const objectId = id('text')
    requests.push(
      {
        createShape: {
          objectId,
          shapeType: 'TEXT_BOX',
          elementProperties: properties(page, x, y, w, h)
        }
      },
      { insertText: { objectId, text: value, insertionIndex: 0 } },
      {
        updateTextStyle: {
          objectId,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: font,
            fontSize: { magnitude: size * fontScale, unit: 'PT' },
            foregroundColor: { opaqueColor: { rgbColor: rgb(color) } },
            bold
          },
          fields: 'fontFamily,fontSize,foregroundColor,bold'
        }
      },
      {
        updateParagraphStyle: {
          objectId,
          textRange: { type: 'ALL' },
          style: { alignment },
          fields: 'alignment'
        }
      }
    )
    if (font !== 'Arial') {
      for (const match of value.matchAll(/[ -~]+/g)) {
        requests.push({
          updateTextStyle: {
            objectId,
            textRange: {
              type: 'FIXED_RANGE',
              startIndex: match.index,
              endIndex: match.index + match[0].length
            },
            style: { fontFamily: 'Arial' },
            fields: 'fontFamily'
          }
        })
      }
    }
    if (fill)
      requests.push({
        updateShapeProperties: {
          objectId,
          shapeProperties: {
            shapeBackgroundFill: { solidFill: { color: { rgbColor: rgb(fill) } } },
            outline: { propertyState: 'NOT_RENDERED' }
          },
          fields: 'shapeBackgroundFill,outline'
        }
      })
  }
  const slide = () => {
    const objectId = id('slide')
    requests.push({
      createSlide: { objectId, slideLayoutReference: { predefinedLayout: 'BLANK' } }
    })
    return objectId
  }
  const cover = slide()
  image(cover, 'cover_texture.jpg', 0, 0, 13.333333, 7.5)
  box(cover, input.title, 0.9, 2.55, 11.4, 1.5, 36, 'FFFFFF', true)
  box(cover, input.subtitle, 0.9, 4.2, 11.4, 0.8, 18, 'FFFFFF')
  box(cover, input.versionDate, 0.9, 6.75, 9, 0.35, 11, 'FFFFFF')
  image(cover, 'logo_white.png', 11.3, 6.85, 1.5, 0.406)
  for (const page of pages) {
    text(page.title, 'page.title', 30)
    text(page.lead, 'page.lead', 60)
    if (!Array.isArray(page.cards) || page.cards.length < 1 || page.cards.length > 3)
      throw new Error('Each page needs 1–3 cards')
    const pageId = slide()
    rectangle(pageId, 0.267, 0.4, 0.08, 0.666, '073763')
    image(pageId, 'logo_black.png', 10.427, 0.1, 2.903, 0.792)
    box(pageId, page.title, 0.533, 0.333, 9.4, 0.8, 22, '073763', true)
    box(pageId, page.lead, 0.533, 1.226, 12.264, 0.55, 14, '262626', true)
    box(
      pageId,
      `Copyright ${input.copyrightYear}. Acrosstudio, Inc. <Confidential>`,
      7.332,
      7.092,
      5.599,
      0.293,
      8,
      '595959',
      false,
      undefined,
      'END',
      'Arial'
    )
    const gap = 0.2,
      cardWidth = (12.264 - gap * (page.cards.length - 1)) / page.cards.length
    page.cards.forEach((card, index) => {
      text(card.title, 'card.title', page.cards.length === 3 ? 18 : 28)
      if (!Array.isArray(card.lines) || card.lines.length < 1 || card.lines.length > 6)
        throw new Error('Each card needs 1–6 lines; split long content into more pages')
      const x = 0.533 + index * (cardWidth + gap)
      rectangle(pageId, x, 2.1, cardWidth, 4.5, 'FFFFFF', 'BFBFBF')
      box(pageId, card.title, x, 2.1, cardWidth, 0.55, 14, 'FFFFFF', true, '073763', 'CENTER')
      card.lines.forEach((line, row) =>
        box(
          pageId,
          text(line, 'card.line', page.cards.length === 3 ? 36 : 65),
          x + 0.18,
          2.85 + row * 0.6,
          cardWidth - 0.36,
          0.56,
          12,
          '262626'
        )
      )
    })
  }
  for (const blank of presentation.slides ?? [])
    requests.push({ deleteObject: { objectId: blank.objectId } })
  return { writeControl: { requiredRevisionId: presentation.revisionId }, requests }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = JSON.parse(readFileSync(process.argv[2], 'utf8'))
  const presentation = JSON.parse(readFileSync(process.argv[3], 'utf8'))
  process.stdout.write(JSON.stringify(buildDeck(presentation, input)))
}
