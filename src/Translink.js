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

var AlexaSkill = require('./AlexaSkill'),
    globals = require('./globals'),
    config = require('../config.json'),
    eventHandlers = require('./eventHandlers'),
    intentHandlers = require('./intentHandlers');

var APP_ID =  config.appId;

var Translink = function() {
    AlexaSkill.call(this, APP_ID);
};

Translink.prototype = Object.create(AlexaSkill.prototype);
Translink.prototype.constructor = Translink;

eventHandlers.register(Translink.prototype.eventHandlers);
intentHandlers.register(Translink.prototype.intentHandlers);

module.exports = Translink;
