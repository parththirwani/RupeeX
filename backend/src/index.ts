import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { signinSchema, userSchema } from "./schema/authSchema"
import prisma from "./lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY"

const app = express()
app.use(express.json())

/*POST : Sign up endpoint
params :- (phone : string), (password: string), (first, middle , last Name: string)
*/
app.post("/signup", async (req, res) => {
  try {
    const parsedData = userSchema.safeParse(req.body)

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      })
    }

    const { phone, password, firstName, middleName, lastName } = parsedData.data

    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingPhone) {
      return res.status(400).json({
        message: "The number already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        firstName,
        middleName,
        lastName
      }
    })

    return res.status(201).json({
      message: "User successfully signed up",
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
})

/*POST : Sign in endpoint
params :- (phone : string), (password: string)
*/
app.post("/signin", async (req, res) => {
  try {
    const parsedData = signinSchema.safeParse(req.body)

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      })
    }

    const { phone, password } = parsedData.data

    const foundUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (!foundUser) {
      return res.status(404).json({
        message: "User does not exist"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password)

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Wrong credentials"
      })
    }

    const token = jwt.sign(
      { userId: foundUser.id, phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      message: "User successfully signed in",
      token
    })
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
})

app.listen(3000)
