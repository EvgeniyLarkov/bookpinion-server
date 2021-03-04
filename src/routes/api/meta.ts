import { Router } from 'express'
import MetaController from '../../controllers/MetaController'

const router: Router = Router()

router.get('/', [], MetaController.getMetaData)

export default router
