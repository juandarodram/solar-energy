const express = require('express');
const router = express.Router();

const { receiveData, getMetrics } = require('../controllers/data.controller');

router.post('/data', receiveData);
router.get('/metrics', getMetrics);

module.exports = router;