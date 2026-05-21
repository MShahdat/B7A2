import type { Request } from "express"
import { pool } from "../../db"
import type { Issues } from "./type"



//& CREATE ISSUE INTO DATABASE
const createIssueIntoDB = async (req: Request, payload: Issues) => {

  try {

    payload.reporter_id = req.user?.id
    const keys = Object.keys(payload)
    const values = Object.values(payload)

    // console.log(keys, values)


    const cols = keys.join(", ")

    const placeholder = keys.map((_, idx) => `$${idx + 1}`).join(", ")
    // console.log(placeholder)

    const result = await pool.query(`
        INSERT INTO issues (${cols})
        VALUES (${placeholder})
        RETURNING * 
      `, values)



    // console.log(result.rows[0])
    
    return result
  }
  catch (error: any) {
  throw new Error(error.message)
}
}



export const issueService = {
  createIssueIntoDB,
}