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

/**
 *  This skill informs the user with bus updates from Translink for 2 specific stops (inbound, outbound)
 * 
 *  The skill requires an inbound and an outbound stop id to be set and it requires direction names attached to the stops (e.g: City or Wynnum)
 *  The skill will use the set direction names to update the user with the incoming buses.
 *  The stop ids can be looked up in this GTFS file: https://transitfeeds-data.s3-us-west-1.amazonaws.com/public/feeds/translink/21/20161224/original/stops.txt
 *
 * Examples:
 * Dialog model:
 *  User: "Alexa, open Translink configuration"
 *  Alexa: "To use Translink we need to set up the Inbound and Outbound stops you want to get Bus updates for. Please tell me the Inbound stop ID."
 *  User: "Ten thousand one hundred and eighty-eight"
 *  Alexa: "Now we need a name for the Inbound direction. For example City, Wynnum, Chermside, Brisbane."
 *  User: "city"
 *  Alexa: "Now we need to set a stop id for the outbound Bus stop. Please tell me the Outbound stop ID."
 *  User: "Ten thousand one hundred and ninety"
 *  Alexa: "Now we need a name for the Inbound direction."
 *  User: "Carindale"
 *  Alexa: "ok"
 *  (skill saves the configuration)
 *
 * One-shot model:
 *  User: "Alexa, open Translink"
 *  Alexa: "Here are the updates for your bus stops. 215 to city in 6 minutes. 215 to carindale in 12 minutes. 225 to carindale in 54 minutes."
 *
 *  User: "Alexa, set the inbound stop id to ten thousand one hundred and ninety"
 *  Alexa: "ok"
 */
'use strict';
var Translink = require('./Translink');

exports.handler = function (event, context) {
    var translink = new Translink();
    translink.execute(event, context);
};
