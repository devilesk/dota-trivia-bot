var Plugin = require("../index.js");
var fs = require("fs");
var util = require("util");

var AdminPlugin = function (bot, options) {
    var defaultOptions = {
        channel_type: "custom"
    }
    options = Object.assign(defaultOptions, options);
    Plugin.call(this, 'admin', bot, options);
    this._channel_id = null;
    this._channel_type = this.bot.getChannelType(this.options.channel_type);
}
AdminPlugin.prototype = Object.create(Plugin.prototype);
AdminPlugin.prototype.constructor = AdminPlugin;

AdminPlugin.prototype.onDotaReady = function () {
    console.log('admin onDotaReady');
    if (this.options.hasOwnProperty('channel')) {
        this.bot.joinChat(this.options.channel);
    }
}

AdminPlugin.prototype.onDotaChatJoined = function (channelData) {
    if (channelData.channel_name === this.options.channel && channelData.channel_type === this._channel_type) {
        this._channel_id = channelData.channel_id;
        console.log('admin channel joined');
        this.ready = true;
    }
}

AdminPlugin.prototype.onChatCommand = function (channel, persona_name, message, chatObject, args) {
    console.log('admin onChatCommand', chatObject.account_id, this.bot.config.owner_account_id, chatObject.account_id == this.bot.config.owner_account_id);
    if (chatObject.account_id == this.bot.config.owner_account_id) {
        Plugin.prototype.onChatCommand.apply(this, arguments);
    }
}

module.exports = AdminPlugin;