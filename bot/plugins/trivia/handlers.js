var handlers = {
    stats: function (args, channel, persona_name, message, chatObject) {
        var self = this;
        var userId = chatObject.account_id;
        if (!this.userCollection.ready) return;
        this.userCollection.get(userId, function(user) {
            self.userCollection.getRank(userId, function(rank) {
                if (rank != -1) {
                    var message = persona_name + ': ' + user.points + ' points, rank ' + rank + ', best streak ' + user.bestStreak + '.';
                }
                else {
                    var message = persona_name + ': ' + user.points + ' points, unranked, best streak ' + user.bestStreak + '.';
                }
                self.bot.sendMessage(self.options.channel, message);
            });
        }, persona_name);
    },
    top: function (args, channel, persona_name, message, chatObject) {
        var self = this;
        var statType = args[1] || 'all';
        if (!this.userCollection.ready) return;
        this.userCollection.getTop(function (items) {
            console.log(items);
            var message = '';
            if (statType == 'all') {
                message = 'Top 10 all-time: ';
            }
            else {
                message = 'Top 10 past ' + statType + ': ';
            }
            for (var i=0;i<items.length;i++) {
                message += items[i].persona_name + ' - ' + (statType == 'all' ? items[i].points : items[i].total) + ', ';
            }
            message = message.substring(0,message.length-2) + '.';
            self.bot.sendMessage(self.options.channel, message);
        }, statType);
    },
    "trivia start": function (args, channel, persona_name, message, chatObject) {
        if (this.userCollection.ready) {
            this.round.start();
        }
        else {
            console.log('userCollection not ready');
        }
    },
    stop: function (args, channel, persona_name, message, chatObject) {},
    cancel: function (args, channel, persona_name, message, chatObject) {
        if (this.round.restartTimer != null) {
            clearTimeout(this.round.restartTimer);
            this.round.restartTimer = null;
            this.round.unansweredCount = 0;
            this.bot.sendMessage(this.options.channel, this.options.keepAliveCancel, this.round.start.bind(this.round));
        }
    },
    question: function (args, channel, persona_name, message, chatObject) {
        this.bot.sendMessage(this.options.channel, this.round.question);
    }
}

handlers['trivia stats'] = handlers.stats;
handlers['trivia top'] = handlers.top;
handlers['trivia question'] = handlers.question;
handlers['trivia cancel'] = handlers.cancel;

module.exports = handlers;