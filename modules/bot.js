'use strict'

const https = require('https');
const uri = require('url');
const aws = require('aws-sdk');

module.exports.publishSNS = (message, topic, callback) => {
  const sns = new aws.SNS();
  let params = {
    Message: JSON.stringify(message),
    TopicArn: topic
  };
  sns.publish(params, callback);
}

module.exports.postToUrl = (url, body, callback) => {
    let parts = uri.parse(url);
    let options = {
        hostname: parts.hostname,
        port: parts.port,
        path: parts.path,
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
    req.write(JSON.stringify(body));
    req.end();
};
