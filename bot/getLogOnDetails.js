var fs = require("fs");
var util = require("util");

function getLogOnDetails(config) {
    var logOnDetails = {
        "account_name": config.steam_user,
        "password": config.steam_pass
    };
    if (config.steam_guard_code) logOnDetails.auth_code = config.steam_guard_code;
    if (config.two_factor_code) logOnDetails.two_factor_code = config.two_factor_code;

    try {
        var sentry = fs.readFileSync('sentry');
        if (sentry.length) logOnDetails.sha_sentryfile = sentry;
    } catch (beef) {
        util.log("Cannot load the sentry. " + beef);
    }
    
    return logOnDetails;
}

module.exports = getLogOnDetails;