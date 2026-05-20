import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { createResponse, errorResponse, forbiddenResponse, successResponse } from "../../utility/sendResponse";



//& CREATE USER
const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body 
    const result = await authService.createUserIntoDB(body)
    return successResponse(res, 'User registered successfully', result.rows[0]) 
  } 
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}



//& LOGIN USER
const loginUser = async (req: Request, res: Response) => {

  try {
    const result = await authService.loginUserFromDB(req.body)
    return successResponse(res, "Login successful", result as any)
    
  } catch (error: any) {
    return errorResponse(res, error.message, error)
  }

}



export const authController = {
  createUser,
  loginUser,
}