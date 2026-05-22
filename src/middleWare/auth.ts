import type { NextFunction, Request, Response } from "express";
import { errorResponse, notFoundResponse, unauthorizedResponse } from "../utility/sendResponse";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config/env";
import { pool } from "../db";
import { verifyAuth } from "./commonAuth";


//& AUTHORIZATION FOR CREATE A ISSUE
const issueAuth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const auth = await verifyAuth(req, res, roles)
      if (!auth) {
        return
      }
      next()
    } catch (error: any) {
      return errorResponse(res, error.message, error)
    }
  }
}


//& AUTHORIZATION FOR UPDATE A ISSUE
const issueUpdateAuth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = await verifyAuth(req, res, roles)
      if (!auth) {
        return
      }

      const { id } = req.params

      const updateIssue = await pool.query(`
        SELECT * FROM issues WHERE id = $1
      `, [id])

      console.log('updated issue ', updateIssue.rows[0])

      if (updateIssue.rows.length === 0) {
        return notFoundResponse(res)
      }

      const authRole = req.user?.role // 
      const userId = String(req.user?.id)
      console.log('user id from token : ', userId)

      const uId = String(updateIssue.rows[0].reporter_id)
      console.log('user id from body: ', uId)


      const sta = updateIssue.rows[0].status
      const isInvalidContributorAction = (authRole === 'contributor' && (userId !== uId || sta !== 'open'))

      if (isInvalidContributorAction) {
        return unauthorizedResponse(res)
      }

      next()

    } catch (error: any) {
      return errorResponse(res, error.message, error)
    }
  }
}



export const authorization = {
  issueAuth,
  issueUpdateAuth,
}