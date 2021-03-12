const express = require('express');
const indexRouter = express.Router();

const index_controller = require('../controllers/indexController')

/* Get the index route */
indexRouter.get('/', index_controller.index_page)
indexRouter.get('/about-us', index_controller.about_page)

module.exports = indexRouter;