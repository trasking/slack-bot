'use strict'

const querystring = require('querystring');
const slack = require('modules/slack');
const bot = require('modules/bot');
const request = require('request');

module.exports.command = (event, context, callback) => {

	let payload = {
		input: {
			text: event.body.text,
			action: event.body.command.slice(1),
			payload: null
		},
		context: {
			user: event.body.user_id,
			group: event.body.team_id,
			callback: event.stageVariables.callback_url,
			slack: event.body
		}
	};

	console.log(payload);

	bot.publishSNS(payload, 'arn:aws:sns:us-west-2:084075158741:bot-framework-input', (error, data) => {
		var result = { error: error, data: data };
		console.log(result);
		callback(null, result);
	});

};

module.exports.callback = (event, context, callback) => {
	console.log(event.body);
	let payload = slack.transformResponse(event.body);
	console.log(payload);
	request({
    method: 'POST',
    url: event.body.context.slack.response_url,
    body: payload,
    json: true
  }, (error, response, data) => {
		callback(null, { error: error, response: response, data: data });
  });
};

module.exports.action = (event, context, callback) => {

	let body = querystring.parse(event.body);
	let info = JSON.parse(body.payload);

	let slackContext = {
		team_id: info.team.id,
		team_domain: info.team.domain,
		channel_id: info.channel.id,
		channel_name: info.channel.name,
		user_id: info.user.id,
		user_name: info.user.name,
		response_url: info.response_url
	};

	let payload = {
		input: {
			text: null,
			action: info.actions[0].name,
			payload: JSON.parse(info.actions[0].value)
		},
		context: {
			user: info.user.id,
			group: info.team.id,
			callback: event.stageVariables.callback_url,
			slack: slackContext
		}
	};

	bot.publishSNS(payload, 'arn:aws:sns:us-west-2:084075158741:bot-framework-input', (error, data) => {
		var result = { error: error, data: data };
		console.log(result);
		callback(null, result);
	});
};

module.exports.event = (event, context, callback) => {
	console.log(event.body);
	if (event.body.challenge) {
		callback(null, { challenge: event.body.challenge } );
	}
	else {
		if (event.body.event.text.match(/^<@U268PTX26>/)) {

			let slackContext = {
				team_id: event.body.team_id,
				team_domain: info.team.domain,
				channel_id: event.body.event.channel,
				user_id: event.body.event.user,
				response_url: info.response_url
			};

			let payload = {
				input: { text: event.body.event.text },
				context: {
					user: event.body.event.user,
					group: event.body.team_id,
					callback: event.stageVariables.callback_url,
					slack: slackContext
				}
			};
		}

		bot.publishSNS(payload, 'arn:aws:sns:us-west-2:084075158741:bot-framework-input', (error, data) => {
			var result = { error: error, data: data };
			console.log(result);
			callback(null, result);
		});

	}
};


//aws apigateway update-stage --rest-api-id bt5l1uujh7 --stage development --patch-operations op=replace,path=/variables/apiKey,value=dude
