const express = require('express');
const router = express.Router();

const auth = require('../app/middlewares/Auth');
const permission = require('../app/middlewares/Pemission');
const TopicController = require('../app/controllers/TopicController');

router.put('/:id', TopicController.edit);
router.delete('/:id', TopicController.delete);
router.post('/store', TopicController.store);
router.get('/:id', TopicController.topic);
router.get('/', TopicController.index);

module.exports = router;