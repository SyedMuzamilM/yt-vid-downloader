const express = require('express');
const indexRouter = express.Router();

const {index, download, downloadVideo} = require('../controllers/download');
const timeController = require('../controllers/test')
const mp4tomp3 = require('../controllers/mp3')
const highqualityController = require('../controllers/highquality')

/* Get the index route */
indexRouter.get('/', index)
indexRouter.get('/download', download)
indexRouter.get('/download/video', highqualityController)
indexRouter.get('/test/time', timeController)
// indexRouter.get('/vid', highqualityController)

module.exports = indexRouter;