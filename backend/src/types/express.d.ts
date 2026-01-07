import "express"

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string
      phone: string
      iat: number
      exp: number
    }
  }
}
