'use strict';

let slack = require('slack');
let bot = require('bot');

module.exports.command = (event, context, callback) => {
	let body = {
		text: "sample text",
		action: "fake action",
		payload: { sample: "value" },
		context: {
			user: "12345",
			callbackUrl: event.callbackUrl,
			responseUrl: event.responseUrl
		}
	}
	bot.postToUrl(event.botUrl, body, (result) => {
		callback(null, { function: 'command', result: result });	
	});
}

module.exports.callback = (event, context, callback) => {
	let slackBody = slack.transformResponse(event.body);
	bot.postToUrl(event.body.context.responseUrl, slackBody, (result) => {
		callback(null, { function: 'callback', result: result });	
	});
}
