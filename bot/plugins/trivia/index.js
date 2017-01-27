var Plugin = require("../index.js");
var fs = require("fs");
var util = require("util");
var Round = require("./round");
var UserCollection = require("./userCollection");

var TriviaPlugin = function (bot, options) {
    var defaultOptions = {
        channel_type: "custom",
        autoStart: true,
        maxHints: 6,
        hintInterval: 10000,
        startMessage: "",
        periodicMessageCount: 100,
        periodicMessage: "",
        keepAlivePrompt: "",
        keepAliveCancel: "",
        keepAliveResponseWait: 30000,
        unansweredThreshold: 5,
        maxPointsPerAnswer: 5,
        nextQuestionDelay: 5000,
        databaseAddress: "mongodb://localhost/",
        databaseName: "testDb"
    }
    options = Object.assign(defaultOptions, options);
    Plugin.call(this, 'trivia', bot, options);
    this._channel_id = null;
    this._channel_type = this.bot.getChannelType(this.options.channel_type);
    this.round = new Round(this);
    this.userCollection = new UserCollection(this.options);
    this.userCollection.on("ready", this.start.bind(this));
    this.joinChatTimer = null;
}

TriviaPlugin.prototype.start = function () {
    console.log('trivia ready', this.ready, 'userCollection ready', this.userCollection.ready);
    if (this.ready && this.userCollection.ready) {
        this.sendMessage(this.options.startMessage);
        if (this.options.autoStart) this.round.start();
    }
}

TriviaPlugin.prototype.sendMessage = function (message, callback, condition) {
    this.bot.sendMessage(this.options.channel, message, this.options.channel_type, callback, condition);
}

TriviaPlugin.prototype.onDotaReady = function () {
    console.log('trivia onDotaReady');
    if (this.options.hasOwnProperty('channel')) {
        this.bot.joinChat(this.options.channel);
        
        // start a timer that should be cleared when chat is joined or process will end itself
        if (this.joinChatTimer == null) {
          this.joinChatTimer = setTimeout(function() {
              console.log('no chat joined response. process ending');
              process.exit(0);
          }, 10000);
        }
    }
}

TriviaPlugin.prototype.onDotaChatJoined = function (channelData) {
    console.log('trivia onDotaChatJoined', channelData);
    if (channelData.channel_name === this.options.channel && channelData.channel_type === this._channel_type) {
        this._channel_id = channelData.channel_id;
        
        // clear join chat timer to prevent process from automatically ending
        clearTimeout(this.joinChatTimer);
        this.joinChatTimer = null;
        
        console.log('trivia channel joined');
        this.sendMessage(this.bot.config.steam_name + " has entered the channel.");
        this.ready = true;
        this.start();
    }
}

TriviaPlugin.prototype.onChatMessage = function (channel, persona_name, message, chatObject) {
    if (chatObject.channel_id.equals(this._channel_id)) this.round.onChatMessage(channel, persona_name, message, chatObject);
}

TriviaPlugin.prototype.onChatCommand = function (channel, persona_name, message, chatObject, args) {
    if (this.commandHandlers.hasOwnProperty(args[0])) {
        console.log('onChatCommand', channel, persona_name, message, chatObject, args);
        
        if (args[0] == 'cancel' || args[0] == 'trivia cancel') {
            this.commandHandlers[args[0]].apply(this, [args, channel, persona_name, message, chatObject]);
        }
        else {
            if (channel != this.options.channel) return;
            console.log('chat command', args[0]);
            this.addUserCommand(
                chatObject.account_id, 
                this.commandHandlers[args[0]],
                [args, channel, persona_name, message, chatObject],
                null, null, this
            );
        }
    }
}

module.exports = TriviaPlugin;