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
    const result = await pool.query (`
      SELECT * FROM issues
    `)

    if(result.rows.length === 0){
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

        const {created_at, updated_at, ...issue} = row

        return {
          ...issue,
          reporter: reporter,
          created_at,
          updated_at
        }
      })
    )

    return issues


    // const abc = result.rows.map(async (row) => {
    //   // console.log('each issue : ', row)
    //   const uId = row.reporter_id
    //   const reporter = await pool.query(`
    //     SELECT * FROM users WHERE id = $1
    //   `, [uId])

    //   const {email, password, create_at, update_at, ...repo} = reporter.rows[0]

    //   // console.log('user info : ', repo)

    //   delete row.reporter_id

    //   const response = {
    //     row,
    //     repo 
    //   }

    //   console.log('combine : ', response)
    // })





    // return result
  }
   catch (error: any) {
    throw new Error(error.message)
  }
}


export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
}