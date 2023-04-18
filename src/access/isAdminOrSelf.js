import isAdmin from "./isAdmin"

export default ({ req }) => {
  if (!req?.user) return false

  if (isAdmin({ req })) return true

  return { id: { equals: req.user.id } }
}
