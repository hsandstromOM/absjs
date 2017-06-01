
// Load in configs (only necessary for dev)
require('dotenv').config();

const express = require('express');
const sendHtml = require('send-data/html');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const apiRoutes = require('./routes/api');
const redirectRoutes = require('./routes/redirects');
const prerender = require('prerender-node');
const compression = require('compression');
const gzippo = require('gzippo');
const cors = require('cors');
const bodyParser = require('body-parser');


// Bring in express and create an instance of the router - to be used w/ middleware
const app = express();
const router = new express.Router();
const mg = require('nodemailer-mailgun-transport');
const nodemailer = require ('nodemailer');


// Set the port
app.set('port', process.env.PORT || 5000);

// Listen for requests
const server = app.listen(app.get('port'), function() {
	const port = server.address().port;
	console.info(`Magic happens on port ${port}`);
});

// Set the static asset directory
app.use(gzippo.staticGzip(`${__dirname}/www`));
app.use(compression(`${__dirname}/www`));
app.use(cors());
app.use(prerender).set('prerenderServiceUrl', 'https://appliedbuildingsciences.com/').set('prerenderToken', process.env.PRERENDER_TOKEN);
app.use(bodyParser.json());       // to support JSON-encoded bodies


const forceSsl = function(req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};

if (app.get('env') === 'production') {
	app.use(forceSsl);
} else if (app.get('env') !== 'production') {
	// Use a nice logger in development
	const logger = require('morgan');
	app.use(logger('dev'));
}

function render(req, res, template) {
	const layout = fs.readFileSync(`${__dirname}/templates/layout.html`, 'utf-8');

	sendHtml(req, res, ejs.render(layout, {
		body: template,
	}));
}

function handleAppPage(req, res) {
	var requestUrl = req.url;
	if (requestUrl === '/') requestUrl = '/layout.html';
	const page = fs.readFileSync(`${__dirname}/templates/layout.html`, 'utf-8');
	render(req, res, page);
}

// Tell the app to use any middle ware on the router
app.use(router);

// Load in routes
app.use('/api', apiRoutes);
app.use(redirectRoutes);

// NOTE: SHOULD ALWAYS BE LAST LINE OF FILE
app.get('*', handleAppPage);
