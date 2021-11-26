const express = require('express');
const router = express.Router();

const classCotroller = require('../app/controllers/ClassController');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');

router.delete('/:id',auth.auth, permission.trainingStaff, classCotroller.delete);
router.patch('/remove/student/:id',auth.auth, permission.trainingStaff, classCotroller.removeStudent);
router.patch('/student/:id',auth.auth, permission.trainingStaff, classCotroller.editStudent);
router.put('/:id',auth.auth, permission.trainingStaff, classCotroller.edit);
router.post('/store', auth.auth, permission.trainingStaff, classCotroller.store);
router.get('/courses/:id',auth.auth, permission.trainee, classCotroller.courses);
router.get('/user', auth.auth, permission.trainee, classCotroller.user);
router.get('/:id',auth.auth, permission.trainee, classCotroller.show);
router.get('/', auth.auth, permission.trainingStaff, classCotroller.index);

module.exports = router;