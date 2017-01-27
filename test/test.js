var Dota2Bot = require("../bot");

var bot = new Dota2Bot();
bot.on("ready", test);
bot.start();
process.env['NODE_ENV'] = 'development';

function test() {
    console.log('test started');
    var test_users = [];
    var msgs = ['!question', '!cancel', '!stats', '!top all', '!top', '!top day', '!top week', '!top hour', '!top adfasdfsf', '!question fsdfs', '!stats fsfsfsf', 'fwfaf'];
    for (var i = 0; i < 100; i++) {
        var personaName = (Math.random().toString(36)+'00000000000000000').slice(2, 10+2);
        console.log('test user personaName', personaName);
        test_users.push(personaName);
    }
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var triviaPlugin = bot.plugins[3];
    console.log(triviaPlugin);
    var answer_prob = .1;
    setInterval(function () {
        var r = Math.random();
        if (r < answer_prob) {
            var message = triviaPlugin.round.answer;
        }
        else if (r < .2) {
            var message = msgs[Math.floor(Math.random()*msgs.length)];
        }
        else {
            var message = (Math.random().toString(36)+'00000000000000000').slice(2, 10+2);
        }
        //var message = triviaPlugin.round.answer;
        var rIndex = getRandomInt(0, test_users.length - 1);
        bot.Dota2.onChatMessage(triviaPlugin.options.channel, triviaPlugin._channel_type, rIndex, test_users[rIndex], message, {account_id:rIndex,persona_name:test_users[rIndex]});
    }, 0);
}