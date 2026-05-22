import type { Response } from "express"
import type { User } from "../modules/auth/types"



//&   ROOT RESPONSE
export const rootResponse = (res: Response) => {  
  const response = {
    success: true,
    author: "Shahdat Hossain",
    title: "DevPulse Issue Tracker API",
    description: "A robust RESTful API for issue tracking and team collaboration, built with Node.js, Express.js, and TypeScript. The system features JWT-based authentication, role-based access control, and a PostgreSQL database managed via raw SQL queries."
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
export const errorResponse = (res: Response, message: string, error?: any) => {
  const response = {
    success: false,
    message,
    error: error?.stack
  }
  res.status(500).json(response)
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
export const unauthorizedResponse = (res: Response, message?: string) => {
  const response = {
    success: false,
    message : message || "Unauthorized access!",
  }
  res.status(401).json(response)
}




//& FORBIDDEN RESPONSE
export const forbiddenResponse = (res: Response, message: string) => {
  const response = {
    success: false,
    message
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



