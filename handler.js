'use strict';

let slack = require('slack');

module.exports.command = (event, context, callback) => {
	let responseBody = slack.transformResponse(event);
	slack.postResponse(event.context.responseUrl, responseBody, (result) => {
		callback(null, { function: 'command', result: result });	
	});
}

module.exports.callback = (event, context, callback) => {
	callback(null, { function: 'callback', event, context });
}
