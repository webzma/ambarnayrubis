import type { Access, FieldAccess } from 'payload'

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)

export const anyone: Access = () => true

/** Admins see everything; the public only sees documents with `published: true`. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { published: { equals: true } }
}
