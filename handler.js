'use strict';


module.exports.command = (event, context, callback) => {
	callback(null, { function: 'command', event, context });
}

module.exports.callback = (event, context, callback) => {
	callback(null, { function: 'callback', event, context });
}
