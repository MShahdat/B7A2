import type { Request, Response } from "express"
import { errorResponse, successResponse } from "../../utility/sendResponse"
import { issueService } from "./issues.service"


//& CREATE ISSUES
const createIssues = async (req: Request, res: Response) => {

  try {
    const body = req.body
    const result = await issueService.createIssueIntoDB(req, body);

    return successResponse(res, 'Issue created successfully', result.rows[0])

  }
  catch (error: any) {
    return errorResponse(res, error.message, error)
  }

}



export const issuecontroller = {
  createIssues,
}