export default ({ req }) => Boolean(req?.user?.collection === "admin")
