var EventEmitter = require('events').EventEmitter,
    util = require("util");

var EResult = {
        OK: true
    },
    EPersonaState = {
        Busy: ""
    };
    
var SteamClient = function SteamClient() {
  EventEmitter.call(this);
  var self = this;
};
util.inherits(SteamClient, EventEmitter);

SteamClient.prototype.connect = function() {
    console.log('SteamClient connect');
    this.emit("connected");
}

var SteamUser = function SteamUser(steamClient) {
  EventEmitter.call(this);
  var self = this;
  this._client = steamClient;
};
util.inherits(SteamUser, EventEmitter);

SteamUser.prototype.logOn = function() {
    this._client.emit("logOnResponse", {eresult: EResult.OK });
};

var SteamFriends = function SteamFriends(steamClient) {
  EventEmitter.call(this);
  var self = this;
  this._client = steamClient;
};
util.inherits(SteamFriends, EventEmitter);

SteamFriends.prototype.setPersonaState = function() {}
SteamFriends.prototype.setPersonaName = function() {}

module.exports = {
    SteamClient: SteamClient,
    SteamUser: SteamUser,
    SteamFriends: SteamFriends,
    EResult: EResult,
    EPersonaState: EPersonaState
}