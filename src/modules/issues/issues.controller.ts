import type { Request, Response } from "express"
import { allResponse, badResponse, errorResponse, notFoundResponse, successResponse } from "../../utility/sendResponse"
import { issueService } from "./issues.service"
import type { Issues } from "./type"


//& CREATE ISSUES
const createIssues = async (req: Request, res: Response) => {

  try {
    const body: Issues = req.body
    const result = await issueService.createIssueIntoDB(req, body);

    if(!result){
      return badResponse(res, 'Invalid input!') 
    }
    return successResponse(res, 'Issue created successfully', result.rows[0])

  }
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }

}



//& GET ALL ISSUES
const getAllIssues = async (req: Request, res: Response) => {

  try {
    const result = await issueService.getAllIssuesFromDB()
    
    if(result.length === 0){
      return notFoundResponse(res)
    }
    return allResponse(res, result)
  } 
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}



export const issuecontroller = {
  createIssues,
  getAllIssues,
}