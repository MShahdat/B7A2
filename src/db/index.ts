import { Pool } from "pg"
import config from "../config/env"


export const pool = new Pool({
  connectionString: config.connectionString
})



export const initBD = async () => {
  try {

    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(30) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(30) DEFAULT 'contributor',

      create_at TIMESTAMP DEFAULT NOW(),
      update_at TIMESTAMP DEFAULT NOW()
    )    
  `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        reporter_id INT,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    console.log('database connected successfully!')
  }
  catch (error) {
    console.log(error)
  }
}




