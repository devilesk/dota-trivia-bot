var Dota2Bot = require('./core');

// Steam connection handlers
require('./connect');

// Dota event handlers
require('./chat');

module.exports = Dota2Bot;