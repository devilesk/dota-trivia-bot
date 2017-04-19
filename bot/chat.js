var fs = require("fs");
var util = require("util");
var Dota2Bot = require('./core');
var Command = require("./Command");
var tokenize = require("./util/tokenize");

Dota2Bot.prototype.onDotaChatMessage = function (channel, persona_name, message, chatObject) {
    util.log([channel, persona_name, message].join(", "));
    console.log('onDotaChatMessage', channel, persona_name, message, chatObject);
    
    if (message === undefined || !message) return;
    
    // check if message is a command
    if (message.charAt(0) === this.config.cmdChar && message.length > 1) {
        var args = tokenize(message.substring(1));
        
        // if first argument is a plugin name, combine it with the command name to form the full chat command.
        if (this.plugins.find(function (plugin) { return plugin.name === args[0] })) {
            args[1] = args[0] + ' ' + args[1];
            this.emit("chatCommand", channel, persona_name, message, chatObject, args.slice(1));
        }
        else {
            this.emit("chatCommand", channel, persona_name, message, chatObject, args);
        }
    }
    else {
        this.emit("chatMessage", channel, persona_name, message, chatObject);
    }
}

Dota2Bot.prototype.onDotaChatJoined = function (channelData) {
    console.log('Dota2Bot.onDotaChatJoined emitting chatJoined event', channelData);
    this.emit("chatJoined", channelData);
}

Dota2Bot.prototype.joinChat = function (channel_name, channel_type, callback, condition) {
    var self = this;
    channel_type = this.getChannelType(channel_type);
    console.log('Dota2Bot joinChat', channel_name, channel_type, callback, condition);
    
    var joinChannelCallback = function (isValid) {
        return isValid;
    }
    var joinChannelCondition = function () {
        return (!condition || condition()) && !self.Dota2._getChannelByName(channel_name, channel_type);
    }
    this.dotaCommandQueue.push(new Command(this.Dota2.joinChat, [channel_name, channel_type], joinChannelCallback, joinChannelCondition, this.Dota2));
}

Dota2Bot.prototype.leaveChat = function (channel_name, channel_type, callback, condition) {
    channel_type = this.getChannelType(channel_type);
    this.dotaCommandQueue.push(new Command(this.Dota2.leaveChat, [channel_name, channel_type], callback, condition, this.Dota2));
}

Dota2Bot.prototype.sendMessage = function (channel_name, message, channel_type, callback, condition) {
    channel_type = this.getChannelType(channel_type);
    this.dotaCommandQueue.push(new Command(this.Dota2.sendMessage, [message, channel_name, channel_type], callback, condition, this.Dota2));
}