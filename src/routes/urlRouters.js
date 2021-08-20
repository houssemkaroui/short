const express = require('express');
const urlController = require('../controllers/urlController');
const authController = require('../controllers/authController')
const router = express.Router();
router.use(authController.protect);
router.post('/Short', urlController.createShortUrl);
router.get('/listeUrlUser',urlController.getAllurlUser)
router.post('/click',urlController.postClick)
router.get('/nombreClick/:URlId',urlController.getNombreClik)

module.exports = router;
