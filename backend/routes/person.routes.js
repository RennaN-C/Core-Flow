const { Router } = require('express');
const PersonController = require('../controllers/PersonController');
const authMiddleware = require('../middlewares/auth');

const router = Router();


router.use(authMiddleware);


router.post('/', PersonController.store);          
router.get('/', PersonController.index);           
router.get('/:id', PersonController.show);         
router.put('/:id', PersonController.update);       
router.delete('/:id', PersonController.delete);    

module.exports = router;