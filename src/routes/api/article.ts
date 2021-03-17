import { Router } from 'express'
import ArticleController from '../../controllers/ArticleController'
import { admin, auth } from '../../middlewares'
import withFilter from '../../middlewares/withFilter'
import { articleCreateValidator, articleQueryValidator } from '../../validators/validation'

const router: Router = Router()

router.get('/:id', articleQueryValidator, ArticleController.byId)
router.put('/update/:id', [auth, admin], ArticleController.update)

router.get('/', [...articleQueryValidator, withFilter], ArticleController.index)
router.post('/', auth, articleCreateValidator, ArticleController.create)

export default router
