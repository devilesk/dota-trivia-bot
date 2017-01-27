var handlers = {
    report: function (args, channel, persona_name, message, chatObject) {
        console.log('general report', args, channel, persona_name, message, chatObject, this.bot.config.ownerId64);
        this.addUserCommand(
            chatObject.account_id, 
            this.bot.Dota2._client.sendMessage,
            [this.bot.config.owner_account_id_64, persona_name + '(' + chatObject.account_id + '): ' + args.slice(1).join(' ')],
            null, null, this.bot.Dota2._client
        );
    }
}

module.exports = handlers;