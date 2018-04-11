var dotenv = require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var fs = require('fs');
var command = process.argv[2];
var query = process.argv[3];

var getTweets = function () {
    var Twitter = require("twitter");
    var client = new Twitter(keys.twitter);
    var params = {
        screen_name: 'nodejs'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        // client.get('favorites/list', function (error, tweets, response) {
        if (error) throw error;
        if (tweets.length > 20) {
            for (var i = 0; i < 20; i++) {
                console.log(i + ' ' + tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('\n');
            }
        } else {
            for (var i = 0; i < tweets.length; i++) {
                console.log(i + ' ' + tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('\n');
            }
        };
    });
};

var getSpotify = function (query) {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    if (!query) {
        query = 'The Sign';
    };
    spotify.search({
        type: 'track',
        query: query
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };

        if (query == 'The Sign') {
            var song = data.tracks.items.find(function (each) {
                // console.log(each);
                var found = each.artists.find(function (artist) {
                    return artist.name == 'Ace of Base';
                    // console.log(artist.name);

                });
                // console.log(found);
                return found;
            })
            song.artists.forEach(function (artist) {
                console.log("Artist: " + artist.name);
            });
            console.log("Song name: " + song.name);
            console.log("Preview Link: " + song.preview_url);
            console.log("Album: " + song.album.name + '\n\n');
            // console.log(song);
        } else {
            data.tracks.items.forEach(function (each) {
                each.artists.forEach(function (artist) {
                    console.log("Artist: " + artist.name);
                });
                console.log("Song name: " + each.name);
                console.log("Preview Link: " + each.preview_url);
                console.log("Album: " + each.album.name + '\n\n');
            });
        }
    });
};

var getMovie = function (title) {
    if (!title) {
        title = 'Mr. Nobody'
    };
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

function runProgram(command) {
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
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) {
                    return console.log(err);
                };
                var input = data.split(",");
                query = input[1];
                runProgram(input[0]);
            });
            break;
    }
}

runProgram(command);