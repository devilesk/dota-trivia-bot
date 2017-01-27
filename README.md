# dota-trivia-bot

Built on top of [node-dota2](https://github.com/Arcana/node-dota2).

  - [Installation](#installation)
  - [Setup](#setup)
  - [Bot Config](#bot-config)
  - [Admin Config](#admin-config)
  - [Trivia Config](#trivia-config)
  - [Chat Log Config](#chat-log-config)
  - [General Config](#general-config)
  - [Plugins](#plugins-1)

## Installation

```
npm install
```

## Setup

Rename the `config_example` folder to `config` and edit the configuration files within.

## Bot Config

`config/bot.json` Bot settings.

##### steam_name

*Required*<br>
Type: `string`

Steam profile name.

##### steam_user

*Required*<br>
Type: `string`

Steam log in name.

##### steam_pass

*Required*<br>
Type: `string`

Steam password.

##### steam_guard_code

*Required*<br>
Type: `string`

Steam guard code. Leave this blank and after the first log in a steam guard code should be sent to your email. That code then goes here.

##### dotaCommandProcessDelay

Type: `number` *(milliseconds)*<br>
Default: `1000`

Rate limit for how often the queue is processed for dota commands (i.e. message sending).

##### cmdChar

Type: `string`<br>
Default: `!`

User input command character.

##### userCommandProcessDelay

Type: `number` *(milliseconds)*<br>
Default: `3000`

Rate limit for how often the queue is processed for user input commands. Prevents spam.

##### maxUserCommandQueueSize

Type: `number` *(milliseconds)*<br>
Default: `10`

Max amount of user input commands to queue. Prevents spam.

##### userCommandLogClearDelay

Type: `number` *(milliseconds)*<br>
Default: `60000`

How often the user input command log is cleared. Each user can only send one command to the bot between log clears. Prevents spam.

##### owner_account_id

*Required*<br>
Type: `string`

Bot owner's dota 2 friend ID.

##### owner_account_id_64

*Required*<br>
Type: `string`

Bot owner's steam64 profile id.

##### plugins

Type: `Array<string>`<br>
Default: `[]`

List of plugins to load.

## Admin Config

`config/admin.json` Admin plugin settings.

##### channel

*Required*<br>
Type: `string`

Name of channel to join.

##### channel_type

Type: `string`<br>
Default: `custom`

Type of channel to join.

## Trivia Config

`config/trivia.json` Trivia plugin settings.

##### channel

*Required*<br>
Type: `string`

Name of channel to join and run trivia in.

##### channel_type

Type: `string`<br>
Default: `custom`

Type of channel to join.

##### autoStart

Type: `boolean`<br>
Default: `true`

Start trivia after channel joined.

##### maxHints

Type: `number`<br>
Default: `6`

Max hints to give before giving answer.

##### hintInterval

Type: `number` *(milliseconds)*<br>
Default: `10000`

Delay between hints.

##### startMessage

Type: `string`<br>
Default: ``

Message to send after channel joined.

##### periodicMessageCount

Type: `number`<br>
Default: `100`

Number of questions to ask before sending a periodic message.

##### periodicMessage

Type: `string`<br>
Default: ``

Message to send after periodic message count is reached.

##### keepAlivePrompt

Type: `string`<br>
Default: ``

Message to send once keep alive check is triggered.

##### keepAliveCancel

Type: `string`<br>
Default: ``

Message to send when keep alive check is canceled.

##### keepAliveResponseWait

Type: `number` *(milliseconds)*<br>
Default: `30000`

Wait time after keep alive check is triggered before bot is restarted, unless keep alive check is stopped by a user sending the cancel command.

##### unansweredThreshold

Type: `number`<br>
Default: `5`

Number of unanswered questions before keep alive check is triggered.

##### maxPointsPerAnswer

Type: `number` *(milliseconds)*<br>
Default: `5`

Max points per answer. Getting the answer right on the first try will reward max points. Each wrong answer will decrease the amount of points the user can get for that question by 1.

##### nextQuestionDelay

Type: `number` *(milliseconds)*<br>
Default: `5000`

Time between questions.

##### questionSources

*Required*<br>
Type: `Array<Object>`

List of question file configuration objects. Each object has the following properties:

- `path` Type: `string` location of question file to load
- `questionModifier` Type: `string` Values: `scramble`, `null` Name of transformation function to apply to question. `null` for no transformation.
- `weight` Type: `number` Values: `0 to 1` How often a question from this configuration should be asked. Sum of all question file configuration object weights should be 1.

##### databaseAddress

Type: `string`<br>
Default: `mongodb://localhost/`

MongoDB connection string.

##### databaseName

Type: `string`<br>
Default: `testDb`

MongoDB database name.

## Chat Log Config

`config/chatlog.json` Chat Log plugin settings.

##### databaseAddress

Type: `string`<br>
Default: `mongodb://localhost/`

MongoDB connection string.

##### databaseName

Type: `string`<br>
Default: `testDb`

MongoDB database name.

##### collectionName

Type: `string`<br>
Default: `chatlog`

MongoDB collection name.

##### collectionOptions

*Required*<br>
Type: `object`

MongoDB collection options.

## General Config

`config/general.json` General plugin settings. No options for now.

## Plugins

The bot core handles connection to Steam and Dota, listening to node-dota2 events, and loading of plugins. It maintains and processes two queues, one for dota commands and another for user input commands. This provides rate limiting.

All other functionality is provided through plugins. Plugins inherit from the [base plugin module](https://github.com/github/devilesk/blob/master/bot/plugins/index.js) which sets up listening to some default bot ready and chat events. Each plugin has a config json file in the config folder which provides plugin specific options. Plugins that process user commands implement a handler.js file containing chat command handlers.

Use the [existing plugins](https://github.com/github/devilesk/tree/master/bot/plugins) as examples.