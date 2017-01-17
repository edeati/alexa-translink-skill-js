# alexa-translink-skill-js
### Alexa Translink Skill
An Amazon Alexa Skill written in Node.js that informs the user on real-time bus
updates for two stops on the Translink Network (e.g.: an inbound and an
outbound). 
I wrote this skill to get real time updates for the bus stops at the end of my
street. Inbound bus stop - to city/northbound, and the outbound stop - going 
south. 
Using the skill I can plan every morning when to leave for work and minimise 
the time I spend on waiting for the bus that takes me to the city.
The skill uses the real time Translink feed from 
https://gtfsrt.api.translink.com.au/Feed/SEQ. It does not use bus schedules.

## Installation
Follow the many articles and documents on how to set up an Nodje.js AWS Lamda 
Alexa Skill. Here is one for example:
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/alexa-skill-nodejs-quick-start

This skill also requires a DynamoDB table that has to be accessible by the 
Lambda function. By default the DynamoDB Table name is Translink. This can be 
changed in [config.json](src/config.json).
You will need to set up a role in AWS with full DynamoDB access 
(AmazonDynamoDBFullAccess) and set it as the Lambda function's role on the 
config page (e.g.: lambda-dynamo below).

The Lambda function's config looks like this:
* Runtime:        Node.js 4.3
* Handler:        index.handler
* Role:           Choose an existing role
* Existing role:  lambda-dynamo
* Description:    Real-time bus updates from Translink
* **Advanced Settings:**
... Timeout 0 min 30 sec (Make sure you do this as getting the real-time feed 
from Translink takes time and you run over the 10 sec default usually)

**MAKE SURE TO CHANGE [config.json](src/config.json) TO BE ABLE TO RUN THE 
SKILL OR DEBUG IT LOCALLY!!!**
To upload the skill to the AWS Lambda function zip up the contents of the src/ 
directory with all of its subdirectories. Make sure you have the appId and 
tableName set correctly in [config.json](src/config.json) before you create the 
zip file.

**Follow this article to set up local debugging:**
https://developer.amazon.com/blogs/post/Tx24Z2QZP5RRTG1/new-alexa-technical-tutorial-debugging-aws-lambda-code-locally


### Notes
If you have forked this repository set the following git option on 
[config.json](src/config.json) to not show up in the commit list.
Do this so you don't commit sensitive info accidentally.
```
git update-index --assume-unchanged config.json
```
To undo and start tracking again in case you need to commit the file:
```
git update-index --no-assume-unchanged config.json
```

The skill uses an older version of 
[gtfs-realtime.proto](translink-gtfs-realtime-proto/gtfs-realtime.proto) file 
that is converted to javascript using Google's gtfs-realtime-bindings project 
(https://github.com/google/gtfs-realtime-bindings). I have sourced this working
version of the .proto file from 
http://opendata.transport.nsw.gov.au/forum/t/illegal-value-error-when-decoding-sydneytrains-gtfs-data/149/5
You might need to update and rebuild this file in case Translink updates theirs.
