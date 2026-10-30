import { createHmac, timingSafeEqual } from 'crypto'

const secret = () => {
  const value = process.env.PAYLOAD_SECRET
  if (!value) throw new Error('PAYLOAD_SECRET is not set')
  return value
}

const mac = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url')

export const signValue = (data: string) => mac(data)

export const verifyValue = (data: string, signature: string) => {
  const expected = Buffer.from(mac(data))
  const actual = Buffer.from(signature)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

/** Compact signed token: base64url(json).signature, with an `exp` (unix seconds) claim. */
export const createToken = (claims: Record<string, unknown>, ttlSeconds: number) => {
  const body = Buffer.from(
    JSON.stringify({ ...claims, exp: Math.floor(Date.now() / 1000) + ttlSeconds }),
  ).toString('base64url')
  return `${body}.${mac(body)}`
}

export const readToken = <T extends Record<string, unknown>>(token: string | null | undefined) => {
  if (!token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature || !verifyValue(body, signature)) return null
  try {
    const claims = JSON.parse(Buffer.from(body, 'base64url').toString()) as T & { exp: number }
    return claims.exp > Date.now() / 1000 ? claims : null
  } catch {
    return null
  }
}

export const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(mac(a))
  const right = Buffer.from(mac(b))
  return timingSafeEqual(left, right)
}
