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

var appConfig = require('./config.json');

var AWS = require('aws-sdk');
AWS.config.update({'region':'us-east-1'});

var database = (function() {
    var dynamoDb = new AWS.DynamoDB({apiVersion:'2012-08-10'});
    
    /*
     * Configuration class stores inbound and outbound stop ids and direction names for a user
     */
    function Configuration(session, config) {
        if(config) {
            this.config = config
        } else {
            this.config = {};
        }
        this._session = session;
    }
        
    return {
        loadConfiguration: function(session, callBack) {
            dynamoDb.getItem({
                TableName: appConfig.tableName,
                Key: {
                    UserId: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else if (data.Item) {
                    var theConfig = new Configuration(session, data.Item.Config.M);
                    callBack(theConfig);
                } else {
                    callBack();
                }
            });
        },
        saveConfiguration: function(session, callBack) {
            // Save the configuration for the user
            var itemToChange = {
                    TableName: appConfig.tableName,
                    Item: {
                            UserId: {
                                S: session.user.userId
                            }
                    }
            };
            if (session.attributes.inbounddirectionname) {
                if (!itemToChange.Item.Config) {
                    itemToChange.Item.Config = {"M" : {} };
                }
                itemToChange.Item.Config.M.InboundDirectionName = {
                    S: session.attributes.inbounddirectionname
                };
            } 
            if (session.attributes.outbounddirectionname) {
                if (!itemToChange.Item.Config) {
                    itemToChange.Item.Config = {"M" : {} };
                }
                itemToChange.Item.Config.M.OutboundDirectionName = {
                    S: session.attributes.outbounddirectionname
                };
            }
            if (session.attributes.inboundstopid) {
                if (!itemToChange.Item.Config) {
                    itemToChange.Item.Config = {"M" : {} };
                }
                itemToChange.Item.Config.M.InboundStopId = {
                    S: session.attributes.inboundstopid
                };
            }
            if(session.attributes.outboundstopid) {
                if (!itemToChange.Item.Config) {
                    itemToChange.Item.Config = {"M" : {} };
                }
                itemToChange.Item.Config.M.OutboundStopId = {
                    S: session.attributes.outboundstopid
                };
            }
            dynamoDb.putItem(itemToChange, function(err, data) {
                    var message = "OK";
                    if (err) {
                        message = "Sorry could not save configuration in database! Please try again later.";
                        console.log(err, err.stack);
                    }
                    if (callBack) {
                        callBack(message);
                    }
                });
        }
    }
})();

module.exports = database;