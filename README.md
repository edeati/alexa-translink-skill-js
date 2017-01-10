# alexa-translink-skill-js
### Alexa Translink Skill
 An Amazon Alexa Skill that informs the user on real-time bus updates for two stops (e.g.: an inbound and an outbound).
I wrote this skill to get real time updates for the bus stops at the end of my street Inbound bus stop - going to Brisbane City, and the outbound going south.
So every morning I can plan when to leave home and walk down to the bus stop for my commute. 

## Installation
The skill requires a DynamoDB table to be set up and accessible by the Lambda function so you need to set up a role with full DynamoDB access and set it as the Lambda function's role on the config page.

The Lambda function's config looks like this:
* Runtime:        Node.js 4.3
* Handler:        index.handler
* Role:           Choose an existing role
* Existing role:  lambda-dynamo
* Description:    Real-time bus updates from Translink
* **Advanced Settings:**
... Timeout 0 min 30 sec (Make sure you do this as getting the real-time feed from Translink takes time and you run over the 10 sec default usually)

To upload the skill zip up the contents of the src/ directory and upload it onto the AWS Lambda function's code page.

**Follow this article to set up debugging:**
https://developer.amazon.com/blogs/post/Tx24Z2QZP5RRTG1/new-alexa-technical-tutorial-debugging-aws-lambda-code-locally

**MAKE SURE TO CHANGE [config.json](config.json) TO BE ABLE TO RUN/DEBUG THE SKILL!!!**

### Notes
Set the following git option on [config.json](config.json) to not show up in the commit list:
```
git update-index --assume-unchanged config.json
```
To undo and start tracking again:
```
git update-index --no-assume-unchanged config.json
```

The skill uses an older version of [gtfs-realtime.proto](translink-gtfs-realtime-proto/gtfs-realtime.proto) file that
is converted to javascript using Google's gtfs-realtime-bindings project at https://github.com/google/gtfs-realtime-bindings. I have sourced this working
version of the .proto file from http://opendata.transport.nsw.gov.au/forum/t/illegal-value-error-when-decoding-sydneytrains-gtfs-data/149/5
