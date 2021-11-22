const express = require('express');
const router = express.Router();

const majorsControler = require('../app/controllers/MajorsController');
const upload = require('../app/middlewares/UploadImage');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');

router.delete('/:id', auth.auth, permission.admin, majorsControler.delete);
router.patch('/:id', auth.auth, permission.admin, upload.single('image'),majorsControler.changeImage);
router.put('/:id', auth.auth, permission.admin,majorsControler.edit);
router.post('/store', auth.auth, permission.admin, upload.single('image'), majorsControler.store);
router.get('/index', majorsControler.index);
router.get('/',auth.auth, permission.trainee, majorsControler.show);

module.exports = router;