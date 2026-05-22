import type { Request, Response } from "express";
import { notFoundResponse, unauthorizedResponse } from "../utility/sendResponse";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config/env";
import { pool } from "../db";

export const verifyAuth = async (req: Request, res: Response, roles: string[]) => {

  const token = req.headers.authorization;
      // console.log('token : ', token)

      if (!token) {
        unauthorizedResponse(res)
        return null
      }

      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
      // console.log('decoded user : ', decoded)

      const isUser = await pool.query(`
        SELECT * FROM users WHERE email = $1
      `, [decoded.email])

      // console.log(isUser.rows[0])
      const user = isUser.rows[0]

      if (isUser.rows.length === 0) {
        notFoundResponse(res)
        return null
      }

      req.user = decoded;
      // console.log('from request : ',req.user)

      const role = isUser.rows[0].role // from database

      if (!roles.includes(role)) {
        return unauthorizedResponse(res)
      }
      return {decoded, role, user }
}