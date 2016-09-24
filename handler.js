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
			user: { user_id: event.body.user_id },
			group: { group_id: event.body.team_id },
			service_endpoint: `https://${event.headers.Host}/${event.stage}`,
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
	// console.log('EVENT', event);
	// console.log('CONTEXT', event.body.context);
	// console.log('SLACK', event.body.context.slack);
	// callback(null, "dude");
	slack.processResponse(event, callback);
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
			user: { user_id: info.user.id },
			group: { group_id: info.team.id },
			service_endpoint: `https://${event.headers.Host}/${event.stage}`,
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
	console.log(event);
	if (event.body.challenge) {
		callback(null, { challenge: event.body.challenge } );
	} else {
		request(`${event.stageVariables.bot_endpoint}/group?id=${event.body.team_id}`, (error, response, data) => {
			if (error) {
				console.log('REQUEST ERROR', error);
				callback(null, { status: 'error', detail: error });
			} else {
				var groupResult = JSON.parse(data);
				if ('ok' != groupResult.status) {
					console.log('BOT ERROR', groupResult);
					callback(null, { status: 'error', detail: groupResult.detail });
				} else {
					var botTag = `<@${groupResult.group.bot_user_id}>`
					var botExp = new RegExp(`^${botTag}`);
					if (botExp.test(event.body.event.text)) {
						let payload = {
							input: { text: event.body.event.text.slice(botTag.length).trim() },
							context: {
								user: { user_id: event.body.event.user },
								group: { group_id: event.body.team_id },
								service_endpoint: `https://${event.headers.Host}/${event.stage}`,
								slack: { channel_id: event.body.event.channel	}
							}
						};
						bot.publishSNS(payload, 'arn:aws:sns:us-west-2:084075158741:bot-framework-input', (snsError, snsData) => {
							var result = { error: snsError, data: snsData };
							console.log(result);
							callback(null, result);
						});
					} else {
						console.log('NO MATCH', botExp, event.body.event.text);
					}
				}
			}
		});
	}
};

module.exports.user = (event, context, callback) => {
	var slackContext = JSON.parse(event.headers['x-bot-context']);
	if (slackContext.user && slackContext.user.user_id) {
			if (slackContext.group && slackContext.group.team_access_token) {
				var params = {
					url: "https://slack.com/api/users.info",
					form: { token: slackContext.group.team_access_token, user: slackContext.user.user_id }
				};
				request.post(params, (error, response, data) => {
					if(error) {
						callback(null, { status: 'error', detail: error });
					} else if (200 != response.statusCode) {
						callback(null, { status: 'error', detail: `(${response.statusCode}) Unable to retrieve user data`})
					} else {
						var result = JSON.parse(data);
						if (result.ok) {
							var user = {
								user_id: result.user.id,
								first_name: result.user.profile.first_name,
								last_name: result.user.profile.last_name,
								full_name: result.user.profile.real_name,
								handle: result.user.name,
								email: result.user.profile.email
							};
							callback(null, { status: 'ok', user: user });
						} else {
							callback(null, { status: 'error', detail: result });
						}
					}
				});
			} else {
					callback(null, { status: 'error', detail: 'no team access token provided'});
			}
	} else {
		callback(null, { status: 'error', detail: 'no user id provided'});
	}
};

//aws apigateway update-stage --rest-api-id bt5l1uujh7 --stage development --patch-operations op=replace,path=/variables/apiKey,value=dude
