'use strict';

let slack = require('slack');
let bot = require('bot');

module.exports.command = (event, context, callback) => {
	let botUrl = 'https://xb5qr6apmj.execute-api.us-west-2.amazonaws.com/dev/input';
	event.body.callbackUrl = 'https://dpw5548x5e.execute-api.us-west-2.amazonaws.com/dev/callback';
	let request = {
		text: event.body.text,
		action: event.body.command,
		payload: null,
		context: event.body
	}
	bot.postToUrl(botUrl, request, (result) => {
		callback(null, { function: 'command', result: result });	
	});
}

module.exports.callback = (event, context, callback) => {
	let slackBody = slack.transformResponse(event.body);
	bot.postToUrl(event.body.context.responseUrl, slackBody, (result) => {
		callback(null, { function: 'callback', result: result });	
	});
}



// {
// 	"status": "cool",
// 	"event": {
// 		"body": {
// 			"token": "cpz1VEunG2taKWJkOTjHccFV",
// 			"team_id": "T1J329BG8",
// 			"team_domain": "print-bot-test",
// 			"channel_id": "C1J36UV0D",
// 			"channel_name": "general",
// 			"user_id": "U1J2YMMFY",
// 			"user_name": "jbtrask",
// 			"command": "/awesome",
// 			"text": "",
// 			"response_url": "https://hooks.slack.com/commands/T1J329BG8/78286688496/4uxMyTc9rqkMzR6MlppN0Fyj"
// 		},
// 		"method": "POST",
// 		"principalId": "",
// 		"stage": "dev",
// 		"headers": {
// 			"Accept": "application/json,*/*",
// 			"Accept-Encoding": "gzip,deflate",
// 			"CloudFront-Forwarded-Proto": "https",
// 			"CloudFront-Is-Desktop-Viewer": "true",
// 			"CloudFront-Is-Mobile-Viewer": "false",
// 			"CloudFront-Is-SmartTV-Viewer": "false",
// 			"CloudFront-Is-Tablet-Viewer": "false",
// 			"CloudFront-Viewer-Country": "US",
// 			"Content-Type": "application/x-www-form-urlencoded",
// 			"Host": "dpw5548x5e.execute-api.us-west-2.amazonaws.com",
// 			"User-Agent": "Slackbot 1.0 (+https://api.slack.com/robots)",
// 			"Via": "1.1 70d79aa19e315b47281005f9e3c25c88.cloudfront.net (CloudFront)",
// 			"X-Amz-Cf-Id": "xWk1beQSEYbUqTpCN_yxRIACa-a48r6ZB2keaLFuudtlhWqyK2TmXg==",
// 			"X-Forwarded-For": "52.91.184.228, 54.239.145.61",
// 			"X-Forwarded-Port": "443",
// 			"X-Forwarded-Proto": "https"
// 		},
// 		"query": {},
// 		"path": {},
// 		"identity": {
// 			"cognitoIdentityPoolId": "",
// 			"accountId": "",
// 			"cognitoIdentityId": "",
// 			"caller": "",
// 			"apiKey": "",
// 			"sourceIp": "52.91.184.228",
// 			"cognitoAuthenticationType": "",
// 			"cognitoAuthenticationProvider": "",
// 			"userArn": "",
// 			"userAgent": "Slackbot 1.0 (+https://api.slack.com/robots)",
// 			"user": ""
// 		},
// 		"stageVariables": {}
// 	}
// }