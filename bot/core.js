var fs = require("fs");
var util = require("util");
var EventEmitter = require('events').EventEmitter;
var path = require('path');

var environment = process.env.NODE_ENV;
var steam = environment === "development" ? require('../test/stubs/steam') : require("steam");
var dota2 = environment === "development" ? require('../test/stubs/dota2') : require("dota2");
console.log(process.env.NODE_ENV);

var Queue = require("./Queue");
var getLogOnDetails = require("./getLogOnDetails");
var getChannelType = require('./getChannelType');

function Dota2Bot(configPath) {
    EventEmitter.call(this);
    var self = this;
    this.configPath = configPath || '../config/bot.json';
    this.config = require(this.configPath);
    var defaultConfig = {
        dotaCommandProcessDelay: 1000,
        cmdChar: "!",
        userCommandProcessDelay: 3000,
        maxUserCommandQueueSize: 10,
        userCommandLogClearDelay: 60000,
        plugins: []
    }
    this.config = Object.assign(defaultConfig, this.config);
    
    this.steamClient = new steam.SteamClient();
    this.steamUser = new steam.SteamUser(this.steamClient);
    this.steamFriends = new steam.SteamFriends(this.steamClient);
    this.Dota2 = new dota2.Dota2Client(this.steamClient, true);
    this.dotaCommandQueue = new Queue(this, this.config.dotaCommandProcessDelay);
    this.userCommandQueue = new Queue(this, this.config.userCommandProcessDelay);
	this.userCommandLog = {};
    this.userCommandLogClearInterval;
    this.plugins = this.config.plugins.map(this._addPlugin.bind(this));
    this.started = false;
    this.logOnDetails = getLogOnDetails(this.config);
    
    // Bind event listeners
    this.steamClient.on('connected', this.onSteamConnected.bind(this));
    this.steamClient.on('logOnResponse', this.onSteamLogOn.bind(this));
    this.steamClient.on('loggedOff', this.onSteamLogOff.bind(this));
    this.steamClient.on('error', this.onSteamError.bind(this));
    this.steamClient.on('servers', this.onSteamServers.bind(this));
    this.steamUser.on('updateMachineAuth', this.onSteamSentry.bind(this));
    this.Dota2.on("ready", this.onDotaReady.bind(this));
    this.Dota2.on("unready", this.onDotaUnready.bind(this));
    this.Dota2.on("chatMessage", this.onDotaChatMessage.bind(this));
    this.Dota2.on("chatJoined", this.onDotaChatJoined.bind(this));
    this.Dota2.on("unhandled", this.onUnhandledMessage.bind(this));
}
util.inherits(Dota2Bot, EventEmitter);

Dota2Bot.prototype.getChannelType = getChannelType;

Dota2Bot.prototype.start = function () {
    if (!this.started) {
        this.steamClient.connect();
        this.started = true;
    }
}

Dota2Bot.prototype._addPlugin = function (pluginName) {
    var Plugin = require('./' + path.join('plugins', pluginName));
    var options = require(path.join('../config', pluginName + '.json'));
    var plugin = new Plugin(this, options);
    return plugin;
}

Dota2Bot.prototype.onDotaReady = function () {
    var self = this;
    console.log("node-dota2 ready.");
    this.dotaCommandQueue.start();
    this.userCommandQueue.start();
    this.userCommandLogClearInterval = setInterval(function () {
        self.userCommandLog = {};
    }, this.config.userCommandLogClearDelay);
    this.emit("ready");
}

Dota2Bot.prototype.onDotaUnready = function () {
    console.log("node-dota2 unready.");
}

Dota2Bot.prototype.onUnhandledMessage = function (kMsg) {
    util.log("UNHANDLED MESSAGE " + kMsg);
}

module.exports = Dota2Bot;
