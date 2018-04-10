var dotenv = require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Spotify = require("spotify");
var fs = require('fs');
var command = process.argv[2];
var query = process.argv[3];

console.log(process.env.TWITTER_CONSUMER_KEY);

var getTweets = function () {
    
    var Twitter = require("twitter");
    var client = new Twitter(keys.twitter);

    client.get('favorites/list', function (error, tweets, response) {
        if (error) throw error;

        if(tweets.length > 20)
        {
            for(var i=0; i<20; i++){
                console.log(i + ' ' + tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('\n');
            }
        }
        else{for(var i=0; i<tweets.length; i++){
            console.log(i + ' ' + tweets[i].created_at);
            console.log(tweets[i].text);
            console.log('\n');
        }};
    });

};

var getSpotify = function (query) {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    if (!query) {
        query = 'The Sign'
    };
    spotify.search({
        type: 'track',
        query: query
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        data.tracks.items.forEach(function (each) {
            each.artists.forEach(function (artist) {
                console.log("Artists: " + artist.name);
            });
            console.log("Song name: " + each.name);
            console.log("Preview Link: " + each.preview_url);
            console.log("Album: " + each.album.name + '\n\n');
        })
    });
    //   console.log(data.tracks.items); 
};

var getMovie = function (title) {
    if(!title){title = 'Mr. Nobody'};
    title = title.replace(" ", "+");
    var url = "http://www.omdbapi.com/?t=";
    url += title;
    url += "&y=&plot=short&apikey=trilogy";
    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("\n\n");
            console.log("The movie:");
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Country: " + movie.Country);
            console.log('Language: ', movie.Language);
            console.log('Plot: ' + movie.Plot);
            console.log('Actors: ' + movie.Actors);
            console.log("\n\n");
        }
    });
}

switch (command) {
    case `my-tweets`:
        getTweets();
        break;
    case `spotify-this-song`:
        getSpotify();
        break;
    case `movie-this`:
        getMovie(query);
        break;
    case `do-what-it-says`:
        // `node liri.js do-what-it-says`

        // * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

        //  * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

        //  * Feel free to change the text in that document to test out the feature for other commands.

        break;
};