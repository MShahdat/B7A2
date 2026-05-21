import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { badResponse, createResponse, errorResponse, forbiddenResponse, successResponse } from "../../utility/sendResponse";
import type { User } from "./types";



//& CREATE USER
const createUser = async (req: Request, res: Response) => {
  try {
    const body: User = req.body 
    const result = await authService.createUserIntoDB(body)
    if(!result){
      return badResponse(res, 'Invalid input! Provide valid user role.')
    }
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