'use strict';

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
			callback: event.stageVariables.callbackUrl,
			slack: event.body
		}
	};

	console.log(request);

	bot.postToUrl(event.stageVariables.botUrl, request, (result) => {
			
	});

	callback(null, 'command done!');
}

module.exports.action = (event, context, callback) => {
	// let body = querystring.parse(event.body);
	// let payload = JSON.parse(body)
	
	// let slackContext = {
	// 	team_id: payload.team.id,
	// 	team_domain: payload.team.domain,
	// 	channel_id: payload.channel.id,
	// 	channel_name: payload.channel.name,
	// 	user_id: payload.user.id,
	// 	user_name: payload.user.name,
	// 	response_url: payload.response_url 
	// }

	// let request = {
	// 	input: {
	// 		text: null,
	// 		action: payload.actions[0].name,
	// 		payload: JSON.parse(payload.actions[0].value)
	// 	},
	// 	context: {
	// 		user: payload.user.id,
	// 		callback: event.stageVariables.callbackUrl,
	// 		slack: slackContext
	// 	}
	// };

	// console.log(request);

	// bot.postToUrl(event.stageVariables.botUrl, request, (result) => {
			
	// });

	callback(null, event);
}

module.exports.event = (event, context, callback) => {
	console.log(event.body);
	if (event.body.challenge) {
		callback(null, { challenge: event.body.challenge } );
	}
	else {
		callback();	
	}
}

module.exports.callback = (event, context, callback) => {

	console.log(event.body);
	
	let payload = slack.transformResponse(event.body);
	
	console.log(payload);
	
	bot.postToUrl(event.body.context.slack.response_url, payload, (result) => {
		callback(null, { function: 'callback', result: result });	
	});
	
}

// sample action
// payload=%7B%22actions%22%3A%5B%7B%22name%22%3A%22name%22%2C%22value%22%3A%22dude%22%7D%5D%2C%22callback_id%22%3A%22abc%22%2C%22team%22%3A%7B%22id%22%3A%22T1J329BG8%22%2C%22domain%22%3A%22print-bot-test%22%7D%2C%22channel%22%3A%7B%22id%22%3A%22C1J36UV0D%22%2C%22name%22%3A%22general%22%7D%2C%22user%22%3A%7B%22id%22%3A%22U1J2YMMFY%22%2C%22name%22%3A%22jbtrask%22%7D%2C%22action_ts%22%3A%221473549426.919446%22%2C%22message_ts%22%3A%221473549424.000017%22%2C%22attachment_id%22%3A%221%22%2C%22token%22%3A%22cpz1VEunG2taKWJkOTjHccFV%22%2C%22response_url%22%3A%22https%3A%5C%2F%5C%2Fhooks.slack.com%5C%2Factions%5C%2FT1J329BG8%5C%2F78382827094%5C%2FTcec2bqHoJFCekSbDCaYOqve%22%7D