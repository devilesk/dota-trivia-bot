var Plugin = require("../index.js");
var util = require("util");
var MongoClient = require('mongodb').MongoClient;

var ChatLogPlugin = function (bot, options) {
    var defaultOptions = {
        databaseAddress: "mongodb://localhost/",
        databaseName: "testDb",
        collectionName: "chatlog"
    }
    options = Object.assign(defaultOptions, options);
    Plugin.call(this, 'chatlog', bot, options);
    this.db = null;
    this.logCollection = null;
    var self = this;
    MongoClient.connect(this.options.databaseAddress + this.options.databaseName, function(err, db) {
        util.log("chatlog connected to " + self.options.databaseAddress + self.options.databaseName);
        self.db = db;
        self.db.createCollection(self.options.collectionName, self.options.collectionOptions, function (err, collection) {
            if (err) util.log('chatlog collection error');
            self.logCollection = collection;
            self.ready = true;
        });
    });
}
ChatLogPlugin.prototype = Object.create(Plugin.prototype);
ChatLogPlugin.prototype.constructor = ChatLogPlugin;

ChatLogPlugin.prototype.onChatMessage = ChatLogPlugin.prototype.onChatCommand = function (channel, persona_name, message, chatObject) {
    if (!this.ready) return;
    this.logCollection.insert({"createdAt": new Date(), "channel": channel, "message": message, "account_id": chatObject.account_id, "persona_name": persona_name}, {w:1}, function(err, result) {
        if (err) util.log('insert error logCollection', channel, chatObject.account_id, persona_name, message);
    });
}

module.exports = ChatLogPlugin;