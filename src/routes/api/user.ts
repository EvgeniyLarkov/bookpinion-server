import { Router } from 'express'
import UserController from '../../controllers/UserController'
import { userGetValidator, userRegDataValidator } from '../../validators/validation'

const router: Router = Router()

router.post('/', userRegDataValidator, UserController.create)
router.get('/:username', userGetValidator, UserController.get)

export default router
