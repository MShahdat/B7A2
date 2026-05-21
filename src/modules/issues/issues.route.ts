import { Router } from "express";
import { issuecontroller } from "./issues.controller";
import { authorization } from "../../middleWare/auth";
import { USER_ROLE } from "../../utility/util";

const router = Router()


router.post('/', authorization.issueCreateAuth(USER_ROLE.contributor, USER_ROLE.maintainer), issuecontroller.createIssues)
router.get('/', issuecontroller.getAllIssues)



export const issueRouter = router