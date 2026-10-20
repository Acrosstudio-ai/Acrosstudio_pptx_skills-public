import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildDeck } from '../../skills/acrosstudio-google-slides/scripts/build-deck.mjs'
import {
  calculateCosts,
  calculateRoi
} from '../../skills/acrosstudio-google-slides/scripts/financials.mjs'

const presentation = JSON.parse(
  readFileSync(new URL('./fixtures/new-presentation.json', import.meta.url), 'utf8')
)
const example = (type) =>
  JSON.parse(
    readFileSync(
      new URL(`../../skills/acrosstudio-google-slides/examples/${type}.json`, import.meta.url),
      'utf8'
    )
  )
const visibleText = (body) =>
  body.requests.flatMap((request) => (request.insertText ? [request.insertText.text] : []))

test('costs sum every line, annualize monthly costs, and include initial costs once', () => {
  assert.deepEqual(calculateCosts(example('cost').plans[0]), {
    initialInvestment: 1000000,
    monthlyOperatingCost: 50000,
    annualOperatingCost: 600000,
    totalCost: 2800000,
    years: 3
  })
  assert.equal(calculateCosts(example('cost').plans[1]).totalCost, 2580000)
})

test('ROI follows the original annual-net, cumulative-profit and initial-investment denominator', () => {
  const result = calculateRoi(example('roi').plans[0])
  assert.equal(result.annualNetBenefit, 600000)
  assert.equal(result.cumulativeNetBenefit, 1800000)
  assert.equal(result.netProfit, 800000)
  assert.equal(result.totalCost, 2800000)
  assert.equal(result.roiPercent, 80)
  assert.equal(result.paybackYears, 5 / 3)
})

test('zero initial investment and insufficient benefits are not presented as a positive ROI or instant recovery', () => {
  const noRecovery = calculateRoi(example('roi').plans[1])
  assert.equal(noRecovery.netProfit, -1600000)
  assert.equal(noRecovery.roiPercent, -160)
  assert.equal(noRecovery.paybackYears, null)
  const free = calculateRoi({
    initialInvestment: 0,
    annualOperatingCost: 0,
    annualBenefit: 100,
    years: 1
  })
  assert.equal(free.roiPercent, null)
  assert.equal(free.paybackYears, 0)
})

test('unknown, negative, fractional-yen and overflowing monetary inputs fail instead of inventing defaults', () => {
  for (const value of [
    undefined,
    null,
    '100',
    NaN,
    Infinity,
    -1,
    0.5,
    Number.MAX_SAFE_INTEGER + 1
  ]) {
    assert.throws(() => calculateRoi({ ...example('roi').plans[0], initialInvestment: value }))
  }
  assert.throws(() => calculateCosts({ monthlyCosts: [], years: 3 }))
  assert.throws(() =>
    calculateCosts({
      oneTimeCosts: [],
      monthlyCosts: [{ name: 'large', amount: Number.MAX_SAFE_INTEGER }],
      years: 3
    })
  )
  for (const years of [0, -1, 0.5, Infinity])
    assert.throws(() => calculateRoi({ ...example('roi').plans[0], years }))
})

for (const [type, count] of [
  ['proposal', 5],
  ['meeting', 3],
  ['cost', 6],
  ['roi', 5]
]) {
  test(`${type} produces editable native Slides with original cover and normal-slide assets`, () => {
    const body = buildDeck(presentation, example(type))
    assert.equal(body.writeControl.requiredRevisionId, 'test-revision')
    assert.equal(body.requests.filter((request) => request.createSlide).length, count)
    const images = body.requests
      .filter((request) => request.createImage)
      .map((request) => request.createImage)
    assert.equal(images.filter((image) => image.url.endsWith('/cover_texture.jpg')).length, 1)
    assert.equal(images.filter((image) => image.url.endsWith('/logo_white.png')).length, 1)
    assert.equal(images.filter((image) => image.url.endsWith('/logo_black.png')).length, count - 1)
    const blackLogo = images.find((image) => image.url.endsWith('/logo_black.png'))
    assert.ok(Math.abs(blackLogo.elementProperties.transform.translateX - 563.058) < 0.01)
    for (const request of body.requests) {
      const created = request.createSlide ?? request.createImage ?? request.createShape
      if (created) assert.match(created.objectId, /^[A-Za-z0-9_][A-Za-z0-9_:-]{4,49}$/)
      if (request.updateTextStyle)
        assert.ok(['ALL', 'FIXED_RANGE'].includes(request.updateTextStyle.textRange.type))
      const outline = request.updateShapeProperties?.shapeProperties?.outline
      if (outline && outline.propertyState !== 'NOT_RENDERED')
        assert.ok(outline.outlineFill?.solidFill?.color?.rgbColor)
    }
    assert.equal(
      body.requests.filter(
        (request) =>
          request.createShape?.shapeType === 'RECTANGLE' &&
          Math.abs(request.createShape.elementProperties.transform.translateX - 14.418) < 0.01
      ).length,
      count - 1
    )
    assert.ok(
      body.requests.some(
        (request) =>
          request.updateTextStyle?.textRange.type === 'FIXED_RANGE' &&
          request.updateTextStyle.style.fontFamily === 'Arial'
      )
    )
    assert.deepEqual(body.requests.at(-1), { deleteObject: { objectId: 'p' } })
    assert.ok(visibleText(body).includes(example(type).title))
  })
}

test('financial slides expose computed values and loss cases rather than placeholder totals', () => {
  const costs = visibleText(buildDeck(presentation, example('cost')))
  assert.ok(costs.includes('2,800,000 円'))
  assert.ok(costs.includes('2,580,000 円'))
  const roi = visibleText(buildDeck(presentation, example('roi')))
  assert.ok(roi.includes('ROI: 80.0%'))
  assert.ok(roi.includes('ROI: -160.0%'))
  assert.ok(roi.includes('回収期間: 効果不足'))
  assert.ok(roi.includes('ROI（%）= 期間純利益 ÷ 初期投資 × 100'))
  assert.ok(roi.includes('回収期間（年）= 初期投資 ÷ 年間ネット効果'))
  assert.ok(costs.includes('出典: 同梱 examples/cost.json'))
  assert.ok(costs.includes('移行・教育・追加開発費は別途確認'))
  assert.ok(roi.includes('割引・インフレは未反映'))
  assert.ok(roi.includes('年間効果の測定方法と責任者'))
  assert.throws(() => buildDeck(presentation, { ...example('roi'), currency: 'USD' }))
})

test('empty default placeholders are allowed, but filled placeholders, automatic text and images are protected', () => {
  for (const content of [
    { textRun: { content: 'Existing customer content' } },
    { autoText: { type: 'SLIDE_NUMBER' } }
  ]) {
    const existing = structuredClone(presentation)
    existing.slides[0].pageElements[0].shape.text = { textElements: [content] }
    assert.throws(() => buildDeck(existing, example('meeting')))
  }
  const image = structuredClone(presentation)
  image.slides[0].pageElements.push({ image: { contentUrl: 'https://example.invalid/image.png' } })
  assert.throws(() => buildDeck(image, example('meeting')))
  const blank = structuredClone(presentation)
  blank.slides[0].pageElements[0].shape.text = { textElements: [{ textRun: { content: '\n' } }] }
  assert.equal(
    buildDeck(blank, example('meeting')).requests.filter((request) => request.createSlide).length,
    3
  )
})

test('all cost lines survive pagination and existing slides cannot be overwritten', () => {
  const input = example('cost')
  input.plans = [
    {
      name: '詳細',
      years: 2,
      oneTimeCosts: [],
      monthlyCosts: Array.from({ length: 11 }, (_, i) => ({ name: `項目${i}`, amount: i + 1 }))
    }
  ]
  const texts = visibleText(buildDeck(presentation, input))
  for (let i = 0; i < 11; i++) assert.ok(texts.includes(`項目${i}: ${i + 1} 円`))
  assert.throws(() =>
    buildDeck({ ...presentation, slides: [{ objectId: 'existing', pageElements: [{}] }] }, input)
  )
  assert.throws(() => buildDeck({ ...presentation, revisionId: '' }, input))
  assert.throws(() =>
    buildDeck(
      {
        ...presentation,
        pageSize: { width: { magnitude: 720, unit: 'PT' }, height: { magnitude: 540, unit: 'PT' } }
      },
      input
    )
  )
})
