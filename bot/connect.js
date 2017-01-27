var fs = require("fs");
var util = require("util");
var Dota2Bot = require('./core');
var crypto = require("crypto");

var environment = process.env.NODE_ENV;
var steam = environment === "development" ? require('../test/stubs/steam') : require("steam");

Dota2Bot.prototype.onSteamConnected = function () {
    util.log('steamClient connected');
    this.steamUser.logOn(this.logOnDetails);
}

Dota2Bot.prototype.onSteamLogOn = function (logonResp) {
    util.log('onSteamLogOn');
    if (logonResp.eresult == steam.EResult.OK) {
        this.steamFriends.setPersonaState(steam.EPersonaState.Busy);
        this.steamFriends.setPersonaName(this.config.steam_name);
        util.log("Logged on.");
        this.Dota2.launch();
    }
}

Dota2Bot.prototype.onSteamLogOff = function (eresult) {
    util.log("Logged off from Steam.");
}

Dota2Bot.prototype.onSteamError = function (error) {
    util.log("Connection closed by server: " + error);
}

Dota2Bot.prototype.onSteamSentry = function (sentry, callback) {
    var hashedSentry = crypto.createHash('sha1').update(sentry.bytes).digest();
    fs.writeFileSync('sentry', hashedSentry);
    util.log("sentryfile saved");
    callback({
        sha_file: hashedSentry
    });
}

Dota2Bot.prototype.onSteamServers = function (servers) {
    util.log("Received servers.");
    fs.writeFile('servers', JSON.stringify(servers));
}