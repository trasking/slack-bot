'use strict'

const querystring = require('querystring');
const slack = require('slack');
const bot = require('bot');

module.exports.command = (event, context, callback) => {

	let request = {
		input: {
			text: event.body.text,
			action: event.body.command.slice(1),
			payload: null
		},
		context: {
			user: event.body.user_id,
			callback: event.stageVariables.callback_url,
			slack: event.body
		}
	};

	console.log(request);

	bot.postToUrl(event.stageVariables.bot_url, request, (result) => {

	});

	callback(null, 'command done!');

};

module.exports.callback = (event, context, callback) => {
	console.log(event.body);
	let payload = slack.transformResponse(event.body);
	console.log(payload);
	bot.postToUrl(event.body.context.slack.response_url, payload, (result) => {
		callback(null, { function: 'callback', result: result });
	});
};

module.exports.action = (event, context, callback) => {

	let body = querystring.parse(event.body);
	let payload = JSON.parse(body.payload);

	let slackContext = {
		team_id: payload.team.id,
		team_domain: payload.team.domain,
		channel_id: payload.channel.id,
		channel_name: payload.channel.name,
		user_id: payload.user.id,
		user_name: payload.user.name,
		response_url: payload.response_url
	};

	let request = {
		input: {
			text: null,
			action: payload.actions[0].name,
			payload: JSON.parse(payload.actions[0].value)
		},
		context: {
			user: payload.user.id,
			callback: event.stageVariables.callback_url,
			slack: slackContext
		}
	};

	console.log(request);

	bot.postToUrl(event.stageVariables.bot_url, request, (result) => {

	});

	callback(null, 'action done!');
};

module.exports.event = (event, context, callback) => {
	console.log(event.body);
	if (event.body.challenge) {
		callback(null, { challenge: event.body.challenge } );
	}
	else {
		callback();
	}
};
