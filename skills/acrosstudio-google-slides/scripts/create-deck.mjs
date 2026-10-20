import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildDeck } from './build-deck.mjs'

export async function createDeck(input, folderId, tokens, fetchImpl = fetch) {
  if (typeof folderId !== 'string' || !folderId.trim())
    throw new Error(
      'An explicitly approved destination folder ID is required; use root only when My Drive root is approved'
    )
  if (
    [tokens?.driveToken, tokens?.slidesToken].some((token) => typeof token !== 'string' || !token)
  )
    throw new Error(
      'Connect the current user Google Drive and Slides account before creating a deck'
    )
  buildDeck(
    {
      revisionId: 'validate-input',
      pageSize: { width: { magnitude: 720, unit: 'PT' }, height: { magnitude: 405, unit: 'PT' } },
      slides: []
    },
    input
  )
  const secrets = [...new Set([tokens.driveToken, tokens.slidesToken])].sort(
    (a, b) => b.length - a.length
  )
  const redact = (message) =>
    secrets.reduce((text, secret) => text.replaceAll(secret, '<redacted>'), message)
  let presentationId
  const request = async (url, token, method = 'GET', body) => {
    const response = await fetchImpl(url, {
      method,
      redirect: 'error',
      signal: AbortSignal.timeout(60000),
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {})
    })
    const raw = await response.text()
    if (!response.ok) {
      throw new Error(
        `Google ${method} ${new URL(url).pathname} HTTP ${response.status}: ${redact(raw).slice(0, 2000)}`
      )
    }
    return JSON.parse(raw)
  }
  try {
    const created = await request(
      'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&ignoreDefaultVisibility=true&fields=id,name,webViewLink',
      tokens.driveToken,
      'POST',
      {
        name: input.title,
        mimeType: 'application/vnd.google-apps.presentation',
        parents: [folderId]
      }
    )
    if (typeof created.id !== 'string' || !created.id)
      throw new Error(
        'Google did not return the created presentation ID; inspect Drive before retrying'
      )
    presentationId = created.id
    const url = `https://slides.googleapis.com/v1/presentations/${encodeURIComponent(presentationId)}`
    const presentation = await request(url, tokens.slidesToken)
    const updates = buildDeck(presentation, input)
    await request(`${url}:batchUpdate`, tokens.slidesToken, 'POST', updates)
    return {
      presentationId,
      url: `https://docs.google.com/presentation/d/${encodeURIComponent(presentationId)}/edit`,
      slideCount: updates.requests.filter((request) => request.createSlide).length
    }
  } catch (error) {
    let message = redact(error instanceof Error ? error.message : String(error))
    if (presentationId)
      message += `; created presentation ${presentationId}: inspect it before retrying; it may be incomplete`
    else message += '; no presentation ID returned: inspect Drive before retrying creation'
    throw new Error(message)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const result = await createDeck(
      JSON.parse(readFileSync(process.argv[2], 'utf8')),
      process.argv[3],
      {
        driveToken: process.env.VAULT_TOKEN_WWW_GOOGLEAPIS_COM,
        slidesToken: process.env.VAULT_TOKEN_SLIDES_GOOGLEAPIS_COM
      }
    )
    process.stdout.write(JSON.stringify(result) + '\n')
  } catch (error) {
    process.stderr.write(error.message + '\n')
    process.exitCode = 1
  }
}
