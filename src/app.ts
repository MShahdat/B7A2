import express, { type Application, type Request, type Response } from "express"
import { rootResponse } from "./utility/sendResponse"
import { authRouter } from "./modules/auth/auth.route"

const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))


//& GET ROOT 
app.get('/', (req: Request, res: Response) => {
  rootResponse(res)
})



app.use('/api/auth', authRouter)



export default app
