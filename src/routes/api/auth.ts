import { Router } from 'express'
import AuthController from '../../controllers/AuthController'

const router: Router = Router()

router.post('/', [], AuthController.login)

export default router
