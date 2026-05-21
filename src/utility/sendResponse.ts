import type { Response } from "express"
import type { User } from "../modules/auth/types"



//&   ROOT RESPONSE
export const rootResponse = (res: Response) => {  
  const response = {
    success: true,
    message: "Welcome to Assignet 2",
    author: "Shahdat Hossain"
  }

  res.status(200).json(response)
}


//& SUCCESS RESPNSE
export const successResponse = (res: Response, message?: string, data?: User) => {
  const response = {
    success: true,
    message,
    data
  }
  res.status(200).json(response)
}



//& GET ALL SUCCESS RESPNSE
export const allResponse = (res: Response, data?: any) => {
  const response = {
    success: true,
    data
  }
  res.status(200).json(response)
}



//& ERROR RESPONSE
export const errorResponse = (res: Response, message: string, data?: User) => {
  const response = {
    success: false,
    message,
    data
  }
  res.status(200).json(response)
}



//& CREATE RESPNSE
export const createResponse = (res: Response, message: string, data?: User) => {
  const response = {
    success: true,
    message,
    data
  }
  res.status(201).json(response)
}


//& NOT-FOUND RESPNSE
export const notFoundResponse = (res: Response) => {
  const response = {
    success: false,
    message : "Not Found!!",
    data: null
  }
  res.status(404).json(response)
}




//& UNAUTHORIZED RESPONSE
export const unauthorizedResponse = (res: Response, message?: string, data?: User) => {
  const response = {
    success: false,
    message : message || "Unauthorized access!",
    data
  }
  res.status(401).json(response)
}




//& FORBIDDEN RESPONSE
export const forbiddenResponse = (res: Response, message: string) => {
  const response = {
    success: false,
    message,
    data: null
  }
  res.status(403).json(response)
}


//& BAD REQUEST RESPONSE
export const badResponse = (res: Response, message: string) => {
  const response = {
    success: false,
    message,
    data: null
  }
  res.status(400).json(response)
}



