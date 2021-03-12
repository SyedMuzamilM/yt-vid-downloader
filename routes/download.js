const express = require('express');
const downloadRouter = express.Router();

const download_controller = require('../controllers/downloadController')

/* Get the index route */
downloadRouter.get('/', download_controller.show_download_page)
downloadRouter.get('/video', download_controller.download_video)

module.exports = downloadRouter;