const express = require('express');
const router = express.Router();

const roleController = require('../app/controllers/RoleController');
const permission = require('../app/middlewares/Pemission');
const auth = require('../app/middlewares/Auth');

router.put('/:id', auth.auth, permission.admin, roleController.edit);
router.delete('/:id', auth.auth, permission.admin, roleController.delete);
router.post('/store', auth.auth, permission.admin, roleController.store);
router.get('/', auth.auth, permission.trainingStaff, roleController.index);

module.exports = router;