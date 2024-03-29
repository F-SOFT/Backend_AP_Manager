const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const upload = require('../app/middlewares/UploadAvatar');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');

router.post('/login', userController.login);
router.post('/store',auth.auth, permission.admin, userController.store);
router.patch('/change/password',auth.auth, permission.trainee, userController.changePassword);
router.put('/update/infomation', auth.auth, permission.trainee, upload.single('avatar'), userController.update);
router.put('/edit/:id', auth.auth, permission.admin, userController.edit);
router.delete('/:id',auth.auth, permission.admin, userController.delete);
router.get('/infomation', auth.auth, permission.trainee, userController.info);
router.get('/search', auth.auth, permission.trainingStaff, userController.search);
router.get('/majors/:id', auth.auth, permission.trainingStaff, userController.majors);
router.get('/find/:id', auth.auth, permission.trainingStaff, userController.find);
router.get('/personal/:id', auth.auth, permission.trainee, userController.personal);
router.get('/', auth.auth, permission.trainingStaff, userController.show);

module.exports = router;