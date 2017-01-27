var EventEmitter = require('events').EventEmitter,
    util = require("util");

var Dota2Client = function Dota2Client(steamClient, debug, debugMore) {
  EventEmitter.call(this);
  var self = this;
  this.chatChannels = [];
};
util.inherits(Dota2Client, EventEmitter);

// Methods
Dota2Client.prototype.launch = function() {
    util.log('Dota2Client ready');
    this.emit("ready");
};

Dota2Client.prototype.exit = function() {};
Dota2Client.prototype._getChannelByName = function() {};
Dota2Client.prototype.sendMessage = function() {};

var channel_id = 0;

Dota2Client.prototype.joinChat = function(channel_name, channel_type) {
    console.log('Dota2Client joinChat', channel_name, channel_type);
    var channelData = {
        response: 0,
        channel_name: channel_name,
        channel_id: channel_id++,
        max_members: 5000,
        channel_type: channel_type,
        members: []
    };
  this.chatChannels.push(channelData);
  this.emit("chatJoined", channelData);
};

Dota2Client.prototype.leaveChat = function(channel_name, channel_type) {
    var index = this.chatChannels.findIndex(function (channelData) {
        return channelData.channel_name = channel_name && channelData.channel_type == channel_type;
    });
    this.chatChannels.splice(index, 1);
};

Dota2Client.prototype.sendMessage = function(channel_name, message, channel_type) {
    if (this.debug) util.log("Sending message to", channel_name, channel_type, "|", message);
    if (!this.chatChannels.filter(function (item) {
        return item.channel_name == channel_name && item.channel_type == channel_type;
    }).length) {
        if (this.debug) util.log("Cannot send message to a channel you have not joined.");
        return;
    }
};

Dota2Client.prototype.onChatMessage = function(channel_name, channel_type, account_id, persona_name, text) {
    console.log('Dota2Client onChatMessage', channel_name, channel_type, this.chatChannels);
    var channel = this.chatChannels.filter(function (item) {
        return item.channel_name == channel_name && item.channel_type == channel_type;
    })[0];
    if (!channel) return;
    console.log('Dota2Client onChatMessage', channel_name, channel_type, this.chatChannels);
    var chatData = {
        account_id: account_id,
        channel_id: channel.channel_id,
        channel_name: channel_name,
        persona_name: persona_name,
        text: text
    }

    util.log("Received chat message from " + chatData.persona_name + " in channel " + channel.channel_name);
    this.emit("chatMessage",
        channel.channel_name,
        chatData.persona_name,
        chatData.text,
        chatData);
};

module.exports = {
    Dota2Client: Dota2Client
}
