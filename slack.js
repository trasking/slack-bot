'use strict'

const https = require('https');
const uri = require('url');

module.exports.transformResponse = (frameworkResponse) => {
	return { text: 'TODO: transform framework response to slack response' };	
};

module.exports.postResponse = (responseUrl, responseBody, callback) => {
    let url = uri.parse(responseUrl);
    let options = {
        hostname: url.hostname,
        port: url.port,
        path: url.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
    };
    let req = https.request(options, function(res) {
    	let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('error', (error) => callback({ status: res.statusCode, error: error }));
        res.on('end', () => callback({ status: res.statusCode, body: body }));
    });
    req.write(JSON.stringify(responseBody));
    req.end();
};