const express = require('express');
const router = express.Router();

const scheduleController = require('../app/controllers/ScheduleController');
const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');

router.delete('/:id', auth.auth, permission.trainingStaff, scheduleController.delete);
router.put('/:id', auth.auth, permission.trainingStaff, scheduleController.edit);
router.post('/store', auth.auth, permission.trainingStaff, scheduleController.store);
router.get('/classCode/:id', auth.auth, permission.trainee, scheduleController.showUser);

module.exports = router;