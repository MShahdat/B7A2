import type { Request } from "express"
import { pool } from "../../db"
import type { Issues } from "./type"



//& CREATE ISSUE INTO DATABASE
const createIssueIntoDB = async (req: Request, payload: Issues) => {

  try {
    const issueType = payload.type
    const issueStatus = payload?.status

    const validType = issueType === "bug" || issueType === "feature_request"
    const validStatus = issueStatus === "open" || issueStatus === "in_progress" || issueStatus === "resolved" || issueStatus === undefined

    if (!validStatus || !validType) {
      return false
    }

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
  catch (error: any) {
    throw new Error(error.message)
  }
}



//& GET ALL ISSUES FROM DB
const getAllIssuesFromDB = async (
  sort: "newest" | "oldest" = "newest",
  type?: "bug" | "feature_request",
  status?: "open" | "in_progress" | "resolved"
 ) => {
  try {
    const conditions: string[] = []
    const values = []

    if(type){
      values.push(type)
      conditions.push(`type = $${values.length}`)
    }

    if(status){
      values.push(status)
      conditions.push(`status = $${values.length}`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "" 

    const orderClause = `ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}`

    const result = await pool.query(`
      SELECT * FROM issues ${whereClause} ${orderClause}
    `, values)

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
    const { title, description, type, status } = payload
    // console.log(status)

    const validType = type === "bug" || type === "feature_request" || type === undefined
    const validStatus = status === "open" || status === "in_progress" || status === "resolved" || status === undefined

    if (!validType || !validStatus) {
      return 0
    }
    
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
      title = COALESCE($1, title),
      description = COALESCE ($2, description),
      type = COALESCE ($3, type),
      status = COALESCE($4, status),
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