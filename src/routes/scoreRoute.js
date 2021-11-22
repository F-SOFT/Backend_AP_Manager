const express = require('express');
const router = express.Router();

const scoreController = require('../app/controllers/ScoreController');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');

router.delete('/:id', auth.auth, permission.trainingStaff, scoreController.delete);
router.put('/:id', auth.auth, permission.trainer, scoreController.edit);
router.post('/store', auth.auth, permission.trainingStaff, scoreController.store);
router.get('/user/:id', auth.auth, permission.trainee, scoreController.user);
router.get('/class/:id', auth.auth, permission.trainee, scoreController.showClass);
router.get('/:classId', auth.auth, permission.trainee, scoreController.show);
router.get('/', auth.auth, permission.trainingStaff, scoreController.index);

module.exports = router;