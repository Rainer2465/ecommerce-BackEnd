const express = require('express');
const { getTargetGroups } = require('../controllers/targetGroups');

const router = express.Router();

router.route('/')
  .get(getTargetGroups);

module.exports = router;