# JavaScript GTFS-realtime Language Bindings for Translink

This project creates the JavaScript GTFS-realtime bindings for the use with the Translink Alexa skill
If there are any updates to the .proto file for Translink you will have to re-generate the JavaScript file using this project.
To regenerate gtfs-realtime-translink.js you need to drop in the new gtfs-realtime.proto file here and run

npm run buildProto

This should generate the new gtfs-realtime-translink.js that you need to drop into src/gtfs-realtime-translink.js