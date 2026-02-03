/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const GeminiController = () => import('#controllers/gemini_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/api/liu-ren/gemini', [GeminiController, 'liuRen'])
router.post('/api/lenormand/gemini', [GeminiController, 'lenormand'])
router.post('/api/tarot/gemini', [GeminiController, 'tarot'])
