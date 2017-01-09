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

var database = require('./database'),
    globals = require('./globals'),
    translinkUpdates = require('./translinkUpdates');

var registerEventHandlers = function(skillPrototype) {
    skillPrototype.onLaunch = function(launchRequest, session, response) {
        database.loadConfiguration(session, function(config) {
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
                session.attributes.configall = false;
                if (!session.attributes.inboundstopid) {
                    response.ask("Inbound stop id has not been set. Please tell me the stop id for the inbound direction.");
                } else if (!session.attributes.outboundstopid) {
                    response.ask("Outbound stop id has not been set. Please tell me the stop id for the outbound direction.");
                } else if(!session.attributes.inbounddirectionname) {
                    response.ask("Inbound direction name has not been set. Please tell me the direction name for the inbound direction.");
                } else if(!session.attributes.outbounddirectionname) {
                    response.ask("Outbound direction name has not been set. Please tell me the direction name for the outbound direction.");
                } else {
                    translinkUpdates.getUpdates(session, function(updateMessage) {
                        response.tell(updateMessage);
                    });
                }
            } else {
                session.attributes.inboundstopid = false;
                session.attributes.outboundstopid = false;
                session.attributes.inbounddirectionname = false;
                session.attributes.outbounddirectionname = false;
                session.attributes.configall = true;
                response.ask(globals.firstConfigSpeechOutput, globals.firstConfigRepromptText);
            }
        });
    }
}

exports.register = registerEventHandlers;