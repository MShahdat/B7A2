import express, { type Application, type NextFunction, type Request, type Response } from "express"
import { rootResponse } from "./utility/sendResponse"
import { authRouter } from "./modules/auth/auth.route"
import { issueRouter } from "./modules/issues/issues.route"

const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});




//& GET ROOT 
app.get('/', (req: Request, res: Response) => {
  rootResponse(res)
})



app.use('/api/auth', authRouter)
app.use('/api/issues', issueRouter)



export default app
