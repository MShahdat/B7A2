import dotenv from "dotenv"
import path from "path"
import type { SignOptions } from "jsonwebtoken"

dotenv.config({
  path: path.join(process.cwd(), ".env")
})


const config = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET as string,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>
}





export default config