var path = require('path');
var Command = require("../Command");

var Plugin = function (name, bot, options) {
    this.name = name;
    this.bot = bot;
    this.options = options || {};
    this.ready = false;
    this.bot.on("chatJoined", this.onDotaChatJoined.bind(this));
    this.bot.on("chatMessage", this.onChatMessage.bind(this));
    this.bot.on("chatCommand", this.onChatCommand.bind(this));
    this.bot.on("chatSendMessage", this.onChatSendMessage.bind(this));
    this.bot.on("ready", this.onDotaReady.bind(this));
    this.commandHandlers = require('./' + name + '/handlers');
}

Plugin.prototype.onDotaReady = function () {}
Plugin.prototype.onDotaChatJoined = function (channelData) {}
Plugin.prototype.onChatMessage = function (channel, persona_name, message, chatObject) {}
Plugin.prototype.onChatSendMessage = function (channel, persona_name, message, chatObject) {}
Plugin.prototype.onChatCommand = function (channel, persona_name, message, chatObject, args) {
    console.log('plugin onChatCommand', channel, persona_name, message, chatObject, args, this.commandHandlers);
    if (this.commandHandlers.hasOwnProperty(args[0])) {
        console.log('onChatCommand', channel, persona_name, message, chatObject, args);
        this.commandHandlers[args[0]].call(this, args, channel, persona_name, message, chatObject);
    }
}
Plugin.prototype.addUserCommand = function (account_id, fn, args, callback, condition, context) {
    var command = new Command(fn, args, callback, condition, context);
    if (this.bot.userCommandQueue.size() < this.bot.config.maxUserCommandQueueSize && !this.bot.userCommandLog.hasOwnProperty(account_id)) {
        if (account_id != this.bot.config.ownerId) this.bot.userCommandLog[account_id] = 1;
        this.bot.userCommandQueue.push(command);
    }
}

module.exports = Plugin;