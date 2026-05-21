import type { Request } from "express"
import { pool } from "../../db"
import type { Issues } from "./type"



//& CREATE ISSUE INTO DATABASE
const createIssueIntoDB = async (req: Request, payload: Issues) => {

  try {
    const issueType = payload.type
    const issueStatus = payload?.status

    console.log(issueType, issueStatus)

    if ((issueType === "bug" || issueType === "feature_request") && (issueStatus === "open" || issueStatus === "in_progress" || issueStatus === "resolved" || issueStatus === undefined)) {
      payload.reporter_id = req.user?.id
      const keys = Object.keys(payload)
      const values = Object.values(payload)

      const cols = keys.join(", ")
      const placeholder = keys.map((_, idx) => `$${idx + 1}`).join(", ")
      // console.log(placeholder)

      const result = await pool.query(`
        INSERT INTO issues (${cols})
        VALUES (${placeholder})
        RETURNING * 
      `, values)

      return result
    }
    else {
      return false
    }
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}



//& GET ALL ISSUES FROM DB
const getAllIssuesFromDB = async () => {
  try {
    const result = await pool.query(`
      SELECT * FROM issues
    `)

    if (result.rows.length === 0) {
      return []
    }

    const issues = await Promise.all(
      result.rows.map(async (row) => {
        const uId = row.reporter_id

        const reporterResult = await pool.query(`
          SELECT id, name, role FROM users
          WHERE id = $1
        `, [uId])

        const reporter = reporterResult.rows[0]
        delete row.reporter_id

        const { created_at, updated_at, ...issue } = row

        return {
          ...issue,
          reporter: reporter,
          created_at,
          updated_at
        }
      })
    )

    return issues
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}




//& GET SINGLE ISSUES FROM DB
const getSingleIssuesFromDB = async (id: string) => {
  try {

    const result = await pool.query(`
      SELECT * FROM issues WHERE id = $1
    `, [id])

    if (result.rows.length === 0) {
      return []
    }

    const uId = result.rows[0].reporter_id

    const reporterResult = await pool.query(`
          SELECT id, name, role FROM users
          WHERE id = $1
        `, [uId])

    const reporter = reporterResult.rows[0]

    delete result.rows[0].reporter_id

    const { created_at, updated_at, ...issue } = result.rows[0]

    return {
      ...issue,
      reporter: reporter,
      created_at,
      updated_at
    }
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}



//& UPDATE ISSUE FROM DB
const updateIssueInfoBD = async (payload: Issues, id: string) => {
  try {

    const {title, description, type, status} = payload

    const isIssue = await pool.query(`
      SELECT * FROM issues 
      WHERE id = $1  
    `, [id])

    if (isIssue.rows.length === 0) {
      return false
    }

    const result = await pool.query(`
      UPDATE issues 
      SET 
      title = $1,
      description = $2,
      type = $3,
      status = $4,
      updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [title, description, type, status, id])

    return result

  } 
  catch (error: any) {
    throw new Error(error)
  }
}



//& DELETE ISSUE
const deleteIssueFromDB = async (id: string) => {
  try {
    const result = await pool.query(`
      DELETE FROM issues 
      WHERE id = $1
    `, [id])

    return result
  }
  catch (error) {
    throw new Error("Internal error!")
  }

}



export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssuesFromDB,
  deleteIssueFromDB,
  updateIssueInfoBD,
}