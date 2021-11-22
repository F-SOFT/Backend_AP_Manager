const express = require('express');
const router = express.Router();

const upladImage = require('../app/middlewares/UploadImage');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');
const course = require('../app/controllers/CourseController');

router.delete('/:id', auth.auth, permission.admin, course.delete);
router.put('/:id', auth.auth, permission.admin, course.edit);
router.patch('/change/image', auth.auth, permission.admin, upladImage.single('image'), course.changeImage);
router.post('/store', upladImage.single('image'), course.store);
router.get('/majors/:id', auth.auth, permission.trainee, course.majors);
router.get('/', auth.auth, permission.trainee, course.show);

module.exports = router;