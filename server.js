// Necessary modules
const irc = require("irc"); // connecting to the Twitch chat
const Regex = require("regex"); 
const http = require("http");
const express = require("express"); // http server
const websocket = require("ws"); // websocket communication
const path = require("path");

const config = require("./config.json");

// Regular Expressions definitions
var profileLinkRegex = /(http:\/\/|https:\/\/)*steamcommunity\.com\/(id|profiles)\/[a-zA-Z0-9]*\/*/;
var ranksRegex = /\b(S1|Silver 1|Silver1|S2|Silver 2|Silver2|S3|Silver 3|Silver3|S4|Silver 4|Silver4|Silver Elite|SEM|SE|G1|GN1|Gold1|Gold 1|G2|GN2|Gold2|Gold 2|G3|GN3|Gold3|Gold 3|G4|GN4|GNM|Gold4|Gold 4|AK|MGE|DMG|MG|LEM|LE|Supreme|Supremo|Global|Globais|GE)\b/i;

var ranksObj = {
    "s1":"Silver 1",
    "silver 1": "Silver 1",
    "silver1":"Silver 1",
    "s2":"Silver 2",
    "silver 2": "Silver 2",
    "silver2":"Silver 2",
    "s3":"Silver 3",
    "silver 3": "Silver 3",
    "silver3":"Silver 3",
    "s4":"Silver 4",
    "silver 4": "Silver 4",
    "silver4":"Silver 4",
    "silver elite":"Silver Elite",
    "se": "Silver Elite",
    "sem":"Silver Elite Master",
    "g1":"Gold 1",
    "gn1": "Gold 1",
    "gold1":"Gold 1",
    "gold 1":"Gold 1",
    "g2":"Gold 2",
    "gn2": "Gold 2",
    "gold2":"Gold 2",
    "gold 2":"Gold 2",
    "g3":"Gold 3",
    "gn3": "Gold 3",
    "gold3":"Gold 3",
    "gold 3":"Gold 3",
    "g4":"Gold 4",
    "gn4": "Gold 4",
    "gnm":"Gold 4",
    "gold 4":"Gold 4",
    "gold4": "Gold 4",
    "ak":"Master Guardian",
    "mge": "Master Guardian Elite",
    "mg":"Master Guardian",
    "dmg":"DMG",
    "le": "Legendary Eagle",
    "lem":"Legendary Eagle Master",
    "supreme":"Supreme",
    "supremo": "Supreme",
    "globais": "Global Elite",
    "global": "Global Elite",
    "ge": "Global Elite" 
};

// Simple tests
/*
console.log(profileLinkRegex.exec("http://steamcommunity.com/id/prokpt/")[0]);
console.log(profileLinkRegex.exec("https://steamcommunity.com/profiles/76561198272591554/")[0]);
console.log(ranksRegex.exec("https://steamcommunity.com/profiles/76561198272591554/ pessoal add para jogar em globalito"));
*/

// Create the configuration
var botconfig = {
    channels: ["#" + config.channel],
	server: "irc.chat.twitch.tv",
	nick: config.nickname,
    password: config.chatpassword
};

// Create the bot
var bot = new irc.Client(botconfig.server, botconfig.nick, {
channels: [botconfig.channels + " " + botconfig.password], 
password: botconfig.password,
username: botconfig.nick
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
            //console.log(neededRank);
            //console.log(hasProfile);
            var messageToSend = hasProfile[0] + "|" + ranksObj[neededRank[1].toLowerCase()];
            //console.log("We need rank %s add at: %s",neededRank[0],hasProfile[0]);

            ws.broadcast(messageToSend);
        }
    }
    //console.log(from + ' => ' + to + ': ' + message);
});

bot.addListener('error', function(message) {
    console.log('error: ', message);
});

bot.join(botconfig.channels[0] + " " + botconfig.password);

// Create the webapp

var webapp = express();


// static directories
webapp.use(express.static(path.join(__dirname, 'public')));

webapp.get('/', function(req, res){
    res.sendFile('index.html');
});

const server = http.createServer(webapp);

// Connect to the websocket

const ws = new websocket.Server({ server});

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

server.listen(process.env.PORT || 8082, function () {
    console.log('Listening on %d', server.address().port);
});