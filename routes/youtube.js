const express = require('express');
const youtubeRouter = express.Router();

const youtube_controller = require('../controllers/youtubeController')

/* Get the index route */
youtubeRouter.get('/', youtube_controller.download_video)

module.exports = youtubeRouter;