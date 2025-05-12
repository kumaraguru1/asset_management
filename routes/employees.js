const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.index);
router.get('/new', employeeController.new);
router.post('/', employeeController.create);
router.get('/:id/edit', employeeController.edit);
router.post('/:id', employeeController.update);
router.get('/:id/delete', employeeController.delete);

module.exports = router;
