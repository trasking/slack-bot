'use strict';

let slack = require('slack');
let bot = require('../bot-framework/utilities');

module.exports.command = (event, context, callback) => {
	callback(null, { function: 'command', event, context });
}

module.exports.callback = (event, context, callback) => {
	let slackBody = slack.transformResponse(event);
	bot.postToUrl(event.context.responseUrl, slackBody, (result) => {
		callback(null, { function: 'callback', result: result });	
	});
}
