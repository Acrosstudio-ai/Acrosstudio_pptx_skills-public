import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createDeck } from '../../skills/acrosstudio-google-slides/scripts/create-deck.mjs'

const tokens = {
  driveToken: 'sensitive-drive-token',
  slidesToken: 'sensitive-drive-token-extended-slides'
}
const presentation = {
  revisionId: 'revision',
  pageSize: { width: { magnitude: 720, unit: 'PT' }, height: { magnitude: 405, unit: 'PT' } },
  slides: [{ objectId: 'p' }]
}
const example = (type) =>
  JSON.parse(
    readFileSync(
      new URL(`../../skills/acrosstudio-google-slides/examples/${type}.json`, import.meta.url),
      'utf8'
    )
  )

for (const type of ['proposal', 'meeting', 'cost', 'roi']) {
  test(`${type}: approved destination → native presentation → complete revision-guarded drawing`, async () => {
    const calls = []
    const result = await createDeck(
      example(type),
      'approved-folder',
      tokens,
      async (url, options) => {
        calls.push({ url, ...options })
        assert.equal(options.redirect, 'error')
        if (calls.length === 1) {
          assert.equal(new URL(url).searchParams.get('ignoreDefaultVisibility'), 'true')
          assert.equal(options.headers.Authorization, `Bearer ${tokens.driveToken}`)
          assert.deepEqual(JSON.parse(options.body).parents, ['approved-folder'])
          assert.equal(
            JSON.parse(options.body).mimeType,
            'application/vnd.google-apps.presentation'
          )
          return new Response(JSON.stringify({ id: 'created-deck' }))
        }
        assert.equal(options.headers.Authorization, `Bearer ${tokens.slidesToken}`)
        if (calls.length === 2) return new Response(JSON.stringify(presentation))
        const update = JSON.parse(options.body)
        assert.equal(update.writeControl.requiredRevisionId, 'revision')
        assert.ok(
          update.requests.some((request) => request.createImage?.url.endsWith('/logo_black.png'))
        )
        return new Response(JSON.stringify({ replies: [] }))
      }
    )
    assert.equal(calls.length, 3)
    assert.equal(result.presentationId, 'created-deck')
    assert.equal(result.url, 'https://docs.google.com/presentation/d/created-deck/edit')
    assert.ok(result.slideCount >= 2)
    assert.ok(!calls.some((call) => call.url.includes('/permissions')))
  })
}

test('invalid content, absent credentials, and an unapproved destination cannot create a Google file', async () => {
  let calls = 0
  const fetcher = async () => {
    calls++
    throw new Error('must not be called')
  }
  await assert.rejects(() =>
    createDeck({ ...example('roi'), plans: [{}] }, 'root', tokens, fetcher)
  )
  await assert.rejects(() => createDeck(example('meeting'), '', tokens, fetcher))
  await assert.rejects(() => createDeck(example('meeting'), 'root', {}, fetcher))
  assert.equal(calls, 0)
})

test('a failed write is not retried or reported successful, and secrets are removed before truncating diagnostics', async () => {
  let calls = 0
  await assert.rejects(
    () =>
      createDeck(example('roi'), 'root', tokens, async () => {
        calls++
        if (calls === 1) return new Response(JSON.stringify({ id: 'incomplete-deck' }))
        if (calls === 2) return new Response(JSON.stringify(presentation))
        return new Response('x'.repeat(1990) + tokens.slidesToken + tokens.driveToken, {
          status: 403
        })
      }),
    (error) => {
      assert.ok(error.message.includes('HTTP 403'))
      assert.ok(error.message.includes('incomplete-deck'))
      assert.ok(error.message.includes('inspect it before retrying'))
      for (const token of Object.values(tokens)) assert.ok(!error.message.includes(token))
      assert.ok(!error.message.includes('extended-slides'))
      return true
    }
  )
  assert.equal(calls, 3)
})

test('uncertain creation stops after one request and preserves the warning without leaking the token', async () => {
  let calls = 0
  await assert.rejects(
    () =>
      createDeck(example('meeting'), 'root', tokens, async () => {
        calls++
        throw new Error('network interrupted ' + tokens.slidesToken)
      }),
    (error) => {
      assert.ok(error.message.includes('inspect Drive before retrying'))
      assert.ok(!error.message.includes(tokens.driveToken))
      assert.ok(!error.message.includes('extended-slides'))
      return true
    }
  )
  assert.equal(calls, 1)
})
