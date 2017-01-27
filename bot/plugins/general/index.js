var Plugin = require("../index.js");

var GeneralPlugin = function (bot, options) {
    Plugin.call(this, 'general', bot, options);
}
GeneralPlugin.prototype = Object.create(Plugin.prototype);
GeneralPlugin.prototype.constructor = GeneralPlugin;

module.exports = GeneralPlugin;