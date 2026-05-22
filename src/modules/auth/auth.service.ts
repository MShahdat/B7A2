import { pool } from "../../db"
import bcrypt from 'bcrypt'
import type { LoginBody, User } from "./types";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../../config/env";


//& CREATE USER
const createUserIntoDB = async (payload: User) => {
  try {

    const role = payload?.role
    console.log('user role : ', role)

    const validRole = role === 'contributor' || role === 'maintainer' || role === undefined

    if(!validRole){
      return false
    }

    const { password } = payload
    const hasPass = await bcrypt.hash(password, 9);
    payload.password = hasPass

    const keys = Object.keys(payload)
    const values = Object.values(payload)

    const cols = keys.join(", ")
    const placeholder = keys.map((_, idx) => `$${idx + 1}`).join(", ")

    const result = await pool.query(`
        INSERT INTO users (${cols})
        VALUES (${placeholder})
        RETURNING * 
      `, values)

    delete result.rows[0].password
    return result
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}




//& LOGIN USER
const loginUserFromDB = async (payload: LoginBody) => {

  try {
    const { email, password } = payload

    const isUser = await pool.query(`
      SELECT * FROM users WHERE email = $1
    `, [email])

    if (isUser.rows.length === 0) {
      return false
    }

    const pass = isUser.rows[0].password
    const isMatch = await bcrypt.compare(password, pass)

    if (!isMatch) {
      return false
    }

    //! Genereate JWT token
    const { id, name, role, } = isUser.rows[0]
    const jwtPayload = {
      id,
      name,
      email,
      role,
    } as JwtPayload

    console.log('jwt payload : ', jwtPayload)

    const token = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: config.accessTokenExpire })

    delete isUser.rows[0].password

    const result = {
      token,
      user: isUser.rows[0] as User
    }

    return result

  }
  catch (error: any) {
    throw new Error("Invalid Credential!")
  }

}



export const authService = {
  createUserIntoDB,
  loginUserFromDB,

}