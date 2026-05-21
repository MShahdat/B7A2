import { Router } from "express";
import { issuecontroller } from "./issues.controller";
import { authorization } from "../../middleWare/auth";

const router = Router()

const ROLE = {
  contributor: 'contributor',
  maintainer: 'maintainer'
}

router.post('/', authorization.issueCreateAuth(ROLE.contributor), issuecontroller.createIssues)



export const issueRouter = router