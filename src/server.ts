import express, { type Request, type Response } from "express"
import app from "./app"
import config from "./config/env"
import { initBD } from "./db"


const port = config.port

const main = () => {
  initBD()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()

