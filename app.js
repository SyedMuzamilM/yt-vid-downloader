const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(cors())

/**
 * Import the routes
 */
const users = require('./routes/users');
const indexRouter = require('./routes/index')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

/**
 * User the routes on the specific endpoints
 */
app.use('', indexRouter)
app.use('/api/v1/users', users);


/**
 * Listen of port
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listning on PORT ${PORT}`))

module.exports = app;
