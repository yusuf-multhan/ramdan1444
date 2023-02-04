const express = require('express');
const router = express.Router();

const { getTakhmeenForm, addTakhmeenForm, updateTakhmeenForm, deleteTakhmeenForm } = require('../controllers/takhmeenForm');

router.route('/')
  .get(getTakhmeenForm)
  .post(addTakhmeenForm)
  .delete(updateTakhmeenForm)
  .put(deleteTakhmeenForm)

module.exports = router;