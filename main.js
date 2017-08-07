// Necessary modules
const irc = require("irc"); // connecting to the Twitch chat
const Regex = require("regex"); 
const express = require("express"); // http server
const websocket = require("ws"); // websocket communication

// Regular Expressions definitions
var profileLinkRegex = /http:\/\/steamcommunity\.com\/(id|profiles)\/[a-zA-Z0-9]*\/*/;
var ranksRegex = / (Silver|Gold|AK|MG|LE|Supreme|Global|Faceit)/gi;

/*
console.log(profileLinkRegex.exec("http://steamcommunity.com/id/prokpt/")[0]);
console.log(profileLinkRegex.exec("http://steamcommunity.com/profiles/76561198272591554/")[0]);
console.log(ranksRegex.exec("pessoal add para jogar em global"));
*/
// Create the configuration
var config = {
	channels: ["#" + process.argv[1]],
	server: "irc.chat.twitch.tv",
	nick: process.argv[2],
    password: process.argv[3]
};

// Create the bot
var bot = new irc.Client(config.server, config.nick, {
channels: [config.channels + " " + config.password], 
password: config.password,
username: config.nick
});

console.log("starting bot");


// Listener for every chat message
bot.addListener('message', function (from, to, message) {

    // Check if the chat message is important to us
    var hasProfile = profileLinkRegex.exec(message);

    if(hasProfile != null){
        //Tries to find information about the rank
        var neededRank = ranksRegex.exec(message);

        if(neededRank != null){
            console.log(neededRank);
            console.log(hasProfile);
            //var messageToSend = "We need rank " + neededRank[0] + " add at: " + hasProfile[0];
            var messageToSend = hasProfile[0] + "|" + neededRank[0];
            console.log("We need rank %s add at: %s",neededRank[0],hasProfile[0]);

            ws.broadcast(messageToSend);
        }
    }
    //console.log(from + ' => ' + to + ': ' + message);
});

bot.addListener('error', function(message) {
    console.log('error: ', message);
});

bot.join(config.channels[0] + " " + config.password);

// Create the webapp

var webapp = express();

webapp.listen(8082, function () {
    console.log("Server listening...");
});

webapp.get('/', function(req, res){
    res.send("hello world");
});

// Connect to the websocket

const ws = new websocket.Server({ port: 9000 });

ws.on('connection', function connection(ws, req) {
  console.log("New connection from " + req.connection.remoteAddress);

});

/*
 * Broadcast a message to all the clients in the websocket.
 * @param {String} string to be sent
 */
ws.broadcast = function broadcast(data) {
    ws.clients.forEach(function each(client) {
        if (client.readyState === websocket.OPEN) {
            client.send(data);
        }
    });
};