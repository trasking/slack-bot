'use strict'

module.exports.transformResponse = (response) => {

	let result = {
		text: response.text
	};

	if (response.items) {
		result.attachments = [];
		for (var itemIdx = 0; itemIdx < response.items.length; itemIdx++) {

			let info = response.items[itemIdx];

			let item = {
				fallback: info.basic_text
			};

			if (info.color) item.color = info.color;
			if (info.image)	item.thumb_url = info.image;
			if (info.footer_text) item.footer = info.footer_text;

			if (info.text_fields) {
				item.fields = [];
				for(var fieldIdx = 0; fieldIdx < info.text_fields.length; fieldIdx++) {
					let field = {
						title: info.text_fields[fieldIdx].title,
						value: info.text_fields[fieldIdx].text
					}
					item.fields.push(field);
				}
			}

			if (info.actions) {
				item.actions = [];
				item.callback_id =  'action_' + response.detail.action;
				for(var actionIdx = 0; actionIdx < info.actions.length; actionIdx++) {
					let actionInfo = info.actions[actionIdx];
					let action = {
						name: actionInfo.id,
						text: actionInfo.text,
						style: actionInfo.default ? 'primary' : 'default',
						type: 'button',
						value: JSON.stringify(actionInfo.payload)
					};
					item.actions.push(action);
					console.log(action);
				}
			}

			result.attachments.push(item);
		}
	}

	return result;
};
