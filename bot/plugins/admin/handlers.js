var handlers = {
    join: function (args, channel, persona_name, message, chatObject) {
        this.bot.joinChat(args.slice(1).join(' ').replace(/'/g, ''));
    },
    leave: function (args, channel, persona_name, message, chatObject) {
        this.bot.leaveChat(args.slice(1).join(' ').replace(/'/g, ''));
    },
    say: function (args, channel, persona_name, message, chatObject) {
        console.log('admin say', args, channel, persona_name, message, chatObject);
        this.bot.sendMessage(args[1], args.slice(2).join(' ').replace(/'/g, ''));
    },
    channels: function (args, channel, persona_name, message, chatObject) {
        this.bot.sendMessage(channel, this.bot.Dota2.chatChannels.map(function (item) { return item.channelName; }).join(','));
    }
}

module.exports = handlers;