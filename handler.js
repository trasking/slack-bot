'use strict';

let slack = require('slack');
let bot = require('bot');

module.exports.command = (event, context, callback) => {
	
	let request = {
		input: {
			text: event.body.text,
			action: event.body.command,
			payload: null
		},
		context: {
			user: event.body.user_id,
			callbackUrl: event.stageVariables.callbackUrl,
			slackInfo: event.body
		}
	};

	console.log(request);

	bot.postToUrl(event.stageVariables.botUrl, request, (result) => {
		callback(null, 'slack command finished');	
	});

}

module.exports.callback = (event, context, callback) => {

	console.log(event.body);
	
	let payload = slack.transformResponse(event.body);
	
	bot.postToUrl(event.body.context.slackInfo.response_url, payload, (result) => {
		callback(null, { function: 'callback', result: result });	
	});
	
}