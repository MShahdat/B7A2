import type { Request, Response } from "express"
import { allResponse, badResponse, errorResponse, notFoundResponse, successResponse } from "../../utility/sendResponse"
import { issueService } from "./issues.service"
import type { Issues } from "./type"


//& CREATE ISSUES
const createIssues = async (req: Request, res: Response) => {

  try {
    const body: Issues = req.body
    const result = await issueService.createIssueIntoDB(req, body);

    if (!result) {
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
    const sort = (req.query.sort as "newest" | "oldest") ?? "newest"
    const type = req.query.type as "bug" | "feature_request"
    const status = req.query.status as "open" | "in_progress" | "resolved"

    const result = await issueService.getAllIssuesFromDB(sort, type, status)

    if (result.length === 0) {
      return notFoundResponse(res)
    }
    return allResponse(res, result)
  }
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}



//& GET SINGLE ISSUES
const getSingleIssues = async (req: Request, res: Response) => {

  try {
    const { id } = req.params
    const result = await issueService.getSingleIssuesFromDB(id as string)

    if (result.length === 0) {
      return notFoundResponse(res)
    }
    return allResponse(res, result)
  }
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}



//& UPDATE ISSUE
const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = req.body

    const result = await issueService.updateIssueInfoBD(body, id as string)

    if(result === 0){
      badResponse(res, 'Invalid type or status!')
      return
    }
    if (!result) {
      return notFoundResponse(res)
    } 
    else {
      return successResponse(res, "Issue updated successfully", result.rows[0])
    }
  }
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}


//& DELETE ISSUE
const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const reslut = await issueService.deleteIssueFromDB(id as string)

    if (reslut.rowCount === 0) {
      return notFoundResponse(res)
    }
    
    return successResponse(res, "Issue deleted successfully")
  } 
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }
}

export const issuecontroller = {
  createIssues,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  deleteIssue,
}