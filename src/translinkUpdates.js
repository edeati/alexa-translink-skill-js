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

var GtfsRealtimeBindings = require('./gtfs-realtime-translink'),
                request = require('request'),
                Mathjs = require('mathjs');

var translinkUpdates = (function() {

    return {
        getUpdates: function(session, callBack) {
            var NOW = new Date();
            var requestSettings = {
                method: 'GET',
                url: 'https://gtfsrt.api.translink.com.au/Feed/SEQ',
                encoding: null
            };
            var returnMessage = "Here are the updates for your bus stops. "
            request(requestSettings, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
                    var buses = [];
                    feed.entity.forEach(function(entity) {
                        if (entity.trip_update) {
                            var tripUpdate = entity.trip_update;
                            if (tripUpdate.stop_time_update != null) {
                                tripUpdate.stop_time_update.forEach(function(stopUpdate) {
                                    if (stopUpdate.stop_id == session.attributes.inboundstopid || stopUpdate.stop_id == session.attributes.outboundstopid) {
                                        var arrivalTime = new Date(stopUpdate.arrival.time * 1000)
                                        var diffTimeInMs = (arrivalTime - NOW);
                                        var diffTimeInMinutes = Mathjs.round(((diffTimeInMs % 86400000) % 3600000) / 60000);
                                        var routeTemp = tripUpdate.trip.route_id.split("-");
                                        var busInfo = {
                                            "arrivalTime" : arrivalTime,
                                            "arrivalTimeInMin" : diffTimeInMinutes,
                                            "busRoute" :  routeTemp[0],
                                            "stopId" : stopUpdate.stop_id
                                        }
                                        buses.push(busInfo);
                                    }
                                });
                            }
                        }
                    });
                    buses.sort(function(bus1, bus2) {
                        return bus1.arrivalTimeInMin - bus2.arrivalTimeInMin;
                    });
                    if (buses.length > 0) {
                        for (var index = 0; index < buses.length; index++) {
                            returnMessage +=    buses[index].busRoute + " " + 
                                                (buses[index].stopId == session.attributes.inboundstopid ? "to " + session.attributes.inbounddirectionname 
                                                : "to " + session.attributes.outbounddirectionname) + " in " +
                                                (buses[index].arrivalTimeInMin != 0 ? buses[index].arrivalTimeInMin + " minutes. " : "less than a minute. ");
                        }
                    } else {
                        returnMessage = "There are no updates for your bus stops at the moment."
                    }
               } else {
                returnMessage = "Could not get updates for your bus stops from Translink!"
               }
               if (callBack) {
                    callBack(returnMessage);
               }
            })
        }
    }
})();

module.exports = translinkUpdates;