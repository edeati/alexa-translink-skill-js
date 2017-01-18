/**

    Copyright 2016 Attila Edelenyi
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    
*/


'use strict';
var db = require('./database'),
    globals = require('./globals'),
    translinkUpdates = require('./translinkUpdates');

var registerIntentHandlers = function(skillPrototype) {
    skillPrototype.ConfigIntent = function(intent, session, response) {
        // User is configuring the app from scratch
        skillPrototype.configItem = skillPrototype.INBOUND_STOPID;
        session.attributes.inboundstopid = false;
        session.attributes.outboundstopid = false;
        session.attributes.inbounddirectionname = false;
        session.attributes.outbounddirectionname = false;
        session.attributes.configall = true;
        session.attributes.configStep = 1;
        response.ask(globals.firstConfigSpeechOutput, globals.firstConfigRepromptText);
    },
    skillPrototype.ConfigDirectionIntent = function(intent, session, response) {
        // User is specifically telling a stop_id/direction name value for specific direction
        db.loadConfiguration(session, function(config) {
            if (config != undefined) {
                if (config.config.InboundStopId) {
                    session.attributes.inboundstopid = config.config.InboundStopId.S;
                }
                if (config.config.OutboundStopId) {
                    session.attributes.outboundstopid = config.config.OutboundStopId.S;
                }
                if (config.config.InboundDirectionName) {
                    session.attributes.inbounddirectionname = config.config.InboundDirectionName.S;
                }
                if (config.config.OutboundDirectionName) {
                    session.attributes.outbounddirectionname = config.config.OutboundDirectionName.S;
                }
            }
            var stopIdSlot = intent.slots.StopId;
            var drirectionNameSlot = intent.slots.DirectionName;
            var theFieldSlot = intent.slots.TheField;
            var directionSlot = intent.slots.Direction;
            var repeatCommandSpeech = "Sorry I did not understand what you wanted to set. Please repeat your command.";
            if (directionSlot && directionSlot.value) {
                if (theFieldSlot && theFieldSlot.value) {
                    if (theFieldSlot.value.indexOf("name") >= 0 || theFieldSlot.value.indexOf("direction") >= 0) {
                        // Try to set Direction Name
                        if (drirectionNameSlot.value) {
                            // Set the direction name here
                            var directionnamefield = "outbounddirectionname";
                            if (directionSlot.value.toLowerCase().indexOf("inbound") >= 0) {
                                directionnamefield = "inbounddirectionname";
                            }
                            session.attributes[directionnamefield] = drirectionNameSlot.value;
                            db.saveConfiguration(session, function(message) {
                                response.tell(message);
                            });
                        } else {
                            response.ask(repeatCommandSpeech);
                        }
                    } else if (theFieldSlot.value.indexOf("stop") >= 0 || theFieldSlot.value.indexOf("id") >= 0) {
                        // Try to set stop ID
                        if (stopIdSlot.value) {
                            // Set the stop id here
                            var stopidfield = "outboundstopid";
                            if (directionSlot.value.toLowerCase().indexOf("inbound") >= 0) {
                                stopidfield = "inboundstopid";
                            }
                            session.attributes[stopidfield] =  stopIdSlot.value;
                            db.saveConfiguration(session, function(message) {
                                response.tell(message);
                            });
                        } else {
                            response.ask(repeatCommandSpeech);
                        }
                    } else {
                        response.ask(repeatCommandSpeech);
                    }
                } else {
                    response.ask(repeatCommandSpeech);
                }
            } else {
                response.ask("Sorry I did not understand which direction you are trying to configure. Please repoeat your command!");
            }
        });        
    },
    skillPrototype.ConfigDialogIntent = function(intent, session, response) {
        // User is answering a config question for either stop_id or stop_name for inbound/outbound stop
        var stopIdSlot = intent.slots.StopId;
        var stopDirectionNameSlot = intent.slots.DirectionName;
        if (stopIdSlot && stopIdSlot.value) {
            var repromptText = "Please name the ";
            var example = true;
            var direction = "";
            if (session.attributes.configStep == 1) {
                direction += ("Inbound direction");
                session.attributes.inboundstopid = stopIdSlot.value;
                session.attributes.configStep = 2;
            } else if (session.attributes.configStep == 3) {
                session.attributes.outboundstopid = stopIdSlot.value;
                direction += ("Outbound direction");
                example = false;
                session.attributes.configStep = 4;
            } else {
                response.tell("Sorry I don't know which stop id to configure!");
                return;
            }
            db.saveConfiguration(session, function(message){
                if (message.toLowerCase() === "ok") {
                    repromptText += direction;
                    var speechOutput = "Now we need a name for the " + direction + (example ? ". For example City, Wynnum, Chermside, Brisbane" : "");
                    if (session.attributes.configall) {
                        response.ask(speechOutput, repromptText);
                    } else {
                        response.tell(message);
                    }
                } else {
                    response.tell(message);
                }
            });            
        } else if (stopDirectionNameSlot && stopDirectionNameSlot.value) {
            if (session.attributes.configStep == 2) {
                session.attributes.inbounddirectionname = stopDirectionNameSlot.value;
                var repromptText = "Please tell me the Outbound stop ID",
                    speechOutput = "Now we need to set a stop id for the outbound Bus stop. " + repromptText;
                session.attributes.configStep = 3;
                db.saveConfiguration(session, function(message){
                    if (session.attributes.configall) {
                        response.ask(speechOutput, repromptText);
                    } else {
                        response.tell(message);
                    }
                });            
            } else if (session.attributes.configStep == 4) {
                session.attributes.outbounddirectionname = stopDirectionNameSlot.value;
                session.attributes.configall = false;
                db.saveConfiguration(session, function(message){
                    response.tell(message);
                });   
            } else {
                response.tell("Sorry I don't know which direction names are configured already. To overwrite configudation Say Alexa open Translink configuration!");
                return;
            }
            db.saveConfiguration(session, function(message) {
                response.tell(message);
            });
        } else {
            response.tell("Sorry I did not understand what you have said. If you have been configuring the stops please re-start it by saying Alexa open Translink configuration.");
        }
    },
    skillPrototype.GetUpdatesIntent = function(intent, session, response) {
        db.loadConfiguration(session, function(config) {
            if (config != undefined) {
                if (config.config.InboundStopId) {
                    session.attributes.inboundstopid = config.config.InboundStopId.S;
                }
                if (config.config.OutboundStopId) {
                    session.attributes.outboundstopid = config.config.OutboundStopId.S;
                }
                if (config.config.InboundDirectionName) {
                    session.attributes.inbounddirectionname = config.config.InboundDirectionName.S;
                }
                if (config.config.OutboundDirectionName) {
                    session.attributes.outbounddirectionname = config.config.OutboundDirectionName.S;
                }
            }
            session.attributes.configall = false;
            if (!session.attributes.inboundstopid) {
                response.ask("Inbound stop id has not been set. Please tell me the stop id for the inbound direction.");
                session.attributes.configStep = 1;
            } else if (!session.attributes.outboundstopid) {
                response.ask("Outbound stop id has not been set. Please tell me the stop id for the outbound direction.");
                session.attributes.configStep = 2;
            } else if(!session.attributes.inbounddirectionname) {
                response.ask("Inbound direction name has not been set. Please tell me the direction name for the inbound direction.");
                session.attributes.configStep = 3;
            } else if(!session.attributes.outbounddirectionname) {
                response.ask("Outbound direction name has not been set. Please tell me the direction name for the outbound direction.");
                session.attributes.configStep = 4;
            } else {
                translinkUpdates.getUpdates(session, function(message) {
                    response.tell(message);
                });
            }
        });
    },
    skillPrototype['AMAZON.CancelIntent'] = function(intent, session, response) {
        response.tell("OK");
    },
    skillPrototype['AMAZON.StopIntent'] = function(intent, session, response) {
        response.tell("OK");
    }
}

exports.register = registerIntentHandlers;