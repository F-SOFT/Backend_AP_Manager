const express = require('express');
const router = express.Router();

const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');
const TopicController = require('../app/controllers/TopicController');

router.put('/:id', auth.auth, permission.admin, TopicController.edit);
router.delete('/:id',auth.auth, permission.admin, TopicController.delete);
router.post('/store',auth.auth, permission.admin, TopicController.store);
router.get('/',auth.auth, permission.trainee, TopicController.index);

module.exports = router;