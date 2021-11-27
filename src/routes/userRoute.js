const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const upload = require('../app/middlewares/UploadAvatar');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');
// ,upload.single('avatar')
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/store',auth.auth, permission.admin, userController.store);
router.patch('/change/avatar', auth.auth, permission.trainee, upload.single('avatar'), userController.changeAvatar);
router.patch('/change/password',auth.auth, permission.trainee, userController.changePassword);
router.put('/:id', auth.auth, permission.trainee, userController.edit);
router.delete('/:id',auth.auth, permission.admin, userController.delete);
router.get('/infomation', auth.auth, permission.trainee, userController.info);
router.get('/search', auth.auth, permission.trainingStaff, userController.search);
router.get('/majors/:id', auth.auth, permission.trainingStaff, userController.majors);
router.get('/find/:id', auth.auth, permission.trainingStaff, userController.find);
router.get('/index', userController.index);
router.get('/', auth.auth, permission.trainingStaff, userController.show);

module.exports = router;