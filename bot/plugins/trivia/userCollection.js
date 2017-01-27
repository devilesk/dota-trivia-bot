var EventEmitter = require('events').EventEmitter;
var fs = require("fs");
var util = require("util");
var MongoClient = require('mongodb').MongoClient;
//var MongoClient = require('./tests/mock.mongodb.js').MongoClient;

var User = require('./user');

var UserCollection = function UserCollection(config) {
    EventEmitter.call(this);
    this.userCollection = null;
    this.scoreHourlyCollection = null;
    this.scoreDailyCollection = null;
    this.scoreWeeklyCollection = null;
    this.db = null;
    this.config = config;
    this.ready = false;
    var self = this;
    MongoClient.connect(this.config.databaseAddress + this.config.databaseName, function(err, db) {
        if(!err) {
            util.log("userCollection connected to " + self.config.databaseAddress + self.config.databaseName);
            self.db = db;

            self.db.createCollection("users", function (err, collection) {
                if (err) util.log('collection error');
                self.userCollection = collection;
                self.db.createCollection("scoresHourly", function (err, collection) {
                    if (err) util.log('collection error');
                    self.scoreHourlyCollection = collection;
                    self.scoreHourlyCollection.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 }, function (err, indexName) {});
                    self.db.createCollection("scoresDaily", function (err, collection) {
                        if (err) util.log('collection error');
                        self.scoreDailyCollection = collection;
                        self.scoreDailyCollection.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 }, function (err, indexName) {});
                        self.db.createCollection("scoresWeekly", function (err, collection) {
                            if (err) util.log('collection error');
                            self.scoreWeeklyCollection = collection;
                            self.scoreWeeklyCollection.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 604800 }, function (err, indexName) {});
                            self.ready = true;
                            util.log('userCollection ready');
                            self.emit("ready");
                        });
                    });
                });
            });
        }
        else {
            util.log("Not connected to " + self.config.databaseAddress + self.config.databaseName);
        }

    });
}
util.inherits(UserCollection, EventEmitter);

UserCollection.prototype.get = function (account_id, callback, persona_name) {
    var self = this;
    console.log('userCollection get');
    this.userCollection.findOne({account_id:account_id}, function (err, user) {
        if (err) util.log('findOne error');
        if (user) {
            callback(user);
        }
        else {
            var newUser = new User(account_id, 0, 0, persona_name);
            self.userCollection.insert(newUser, {w:1}, function(err, result) {
                if (err) util.log('insert error');
                callback(newUser);
            });            
        }
    });
}
UserCollection.prototype.getRank = function (account_id, callback) {
    var self = this;
    this.get(account_id, function (user) {
        self.userCollection.find({ points: { $gt: user.points } }).count(function(err, count) {
            if (err) util.log('count error');
            callback(count+1);
        });
    });
}

UserCollection.prototype.getTop = function (callback, type) {
    switch (type) {
        case 'all':
            this.userCollection.find().sort({points:-1}).limit(10).toArray(function(err, items){
                if (!err) callback(items);
            });
        break;
        case 'week':
            this.scoreWeeklyCollection.aggregate([{$group:{_id: { account_id: "$account_id" }, total: { $sum: "$points" }, count: { $sum: 1 }, persona_name: { $min: "$persona_name" } }}, {$sort: {total: -1}}], function(err, items) {
                if (!err) {
                    if (items.length > 10) {
                        callback(items.slice(0, 10));
                    }
                    else {
                        callback(items);
                    }
                }
            });
        break;
        case 'day':
            this.scoreDailyCollection.aggregate([{$group:{_id: { account_id: "$account_id" }, total: { $sum: "$points" }, count: { $sum: 1 }, persona_name: { $min: "$persona_name" } }}, {$sort: {total: -1}}], function(err, items) {
                if (!err) {
                    if (items.length > 10) {
                        callback(items.slice(0, 10));
                    }
                    else {
                        callback(items);
                    }
                }
            });
        break;
        case 'hour':
        default:
            this.scoreHourlyCollection.aggregate([{$group:{_id: { account_id: "$account_id" }, total: { $sum: "$points" }, count: { $sum: 1 }, persona_name: { $min: "$persona_name" } }}, {$sort: {total: -1}}], function(err, items) {
                console.log(err, items);
                if (!err) {
                    if (items.length > 10) {
                        callback(items.slice(0, 10));
                    }
                    else {
                        callback(items);
                    }
                }
            });
        break;
    }
}
UserCollection.prototype.giveUserPoints = function (account_id, persona_name, pointReward) {
    this.userCollection.update({account_id:account_id}, {$inc:{points:pointReward}, $set:{persona_name:persona_name}}, {w:1}, function(err, result) {
        if (err) util.log('update error userCollection', account_id, persona_name, pointReward);
    });
    this.scoreHourlyCollection.insert({"createdAt": new Date(), "points": pointReward, "account_id": account_id, "persona_name": persona_name}, {w:1}, function(err, result) {
        if (err) util.log('insert error scoreHourlyCollection', account_id, persona_name, pointReward);
    });
    this.scoreDailyCollection.insert({"createdAt": new Date(), "points": pointReward, "account_id": account_id, "persona_name": persona_name}, {w:1}, function(err, result) {
        if (err) util.log('insert error scoreDailyCollection', account_id, persona_name, pointReward);
    });
    this.scoreWeeklyCollection.insert({"createdAt": new Date(), "points": pointReward, "account_id": account_id, "persona_name": persona_name}, {w:1}, function(err, result) {
        if (err) util.log('insert error scoreWeeklyCollection', account_id, persona_name, pointReward);
    });
}
UserCollection.prototype.updateUserStreak = function (account_id, streak) {
    var self = this;
    this.get(account_id, function (user) {
        if (user.bestStreak < streak) {
            self.userCollection.update({account_id:account_id}, {$set:{bestStreak:streak}}, {w:1}, function(err, result) {
                if (err) util.log('update error userCollection', account_id, streak);
            });
        }
    });
}

module.exports = UserCollection;