import { Router } from "express";
import { issuecontroller } from "./issues.controller";
import { authorization } from "../../middleWare/auth";
import { USER_ROLE } from "../../utility/util";

const router = Router()


router.post('/', authorization.issueAuth(USER_ROLE.contributor, USER_ROLE.maintainer), issuecontroller.createIssues)
router.get('/', issuecontroller.getAllIssues)
router.get('/:id', issuecontroller.getSingleIssues)
router.put('/:id', issuecontroller.updateIssue)
router.delete('/:id', authorization.issueAuth(USER_ROLE.maintainer), issuecontroller.deleteIssue)




export const issueRouter = router