'use strict'

module.exports.transformResponse = (response) => {
	let result = { text: response.text };
	if (response.items) {
		result.attachments = [];
		for (var itemIdx = 0; itemIdx < response.items.length; itemIdx++) {
			let info = response.items[itemIdx];
			let item = { fallback: info.basic_text };
			result.attachments.push(item);
		}	

	}
};


// {
//      		callback_id: 'action_print', 
//      		fields: [
//         		{
//         			title: 'Type',
//         			value: options[:file]['pretty_type'],
//         			short: true
//         		},
//         		{
//         			title: 'Title',
//         			value: options[:file]['title'],
//         			short: true
//         		},
//         		{
//         			title: 'Filename',
//         			value: options[:file]['name'],
//         			short: true
//         		}
//         	],
//         	actions: actions
//         }
