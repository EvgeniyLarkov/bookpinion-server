import { Router } from 'express'
import BookController from '../../controllers/BookController'
import { admin, auth } from '../../middlewares'
import { bookParamValidator, bookQueryValidator } from '../../validators/validation'

const router: Router = Router()

router.post('/update', [auth, admin], BookController.populate)

router.get('/:id', bookParamValidator, BookController.byId)

router.get('/', bookQueryValidator, BookController.index)

export default router
