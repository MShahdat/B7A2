import type { NextFunction, Request, Response } from "express";
import { errorResponse, notFoundResponse, unauthorizedResponse } from "../utility/sendResponse";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config/env";
import { pool } from "../db";

const issueCreateAuth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const token = req.headers.authorization;
      // console.log('token : ', token)

      if(!token){
        return unauthorizedResponse(res)
      }

      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
      // console.log('decoded user : ', decoded)
     

      const isUser = await pool.query(`
        SELECT * FROM users WHERE email = $1
      `, [decoded.email])

      // console.log(isUser.rows[0])

      if(isUser.rows.length === 0){
        return notFoundResponse(res)
      }

      req.user = decoded;
      // console.log('from request : ',req.user)

      const role = isUser.rows[0].role // from database

      if(!roles.includes(role)){
        return unauthorizedResponse(res)
      }
      
      next()

    } catch (error: any) {
      return errorResponse(res, error.message, error)
    }
  }
}




export const authorization = {
  issueCreateAuth,
}