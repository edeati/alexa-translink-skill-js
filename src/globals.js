'use strict';
var globals = (function() {

    var repromptText = "Please tell me the Inbound stop ID";
    var speechOutput = "To use Translink we need to set up the Inbound and Outbound stops you " +
                       "want to get Bus updates for. " +
                       repromptText;
                       
    return {
    firstConfigRepromptText: repromptText,
    firstConfigSpeechOutput: speechOutput
    }
})();

module.exports = globals;
