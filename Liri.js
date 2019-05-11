var sKeys = require('./keys.js');
var spotifyAPI = require('node-spotify-api');
var request = require('request');
var fileSystem = require('file-system');

var userVariable = process.argv[2];
var userInput = process.argv[3];

switch (userVariable) {

        case 'concert-this':
            var concertName = userInput;
            concertThis(concertName);
        break;

        case 'spotify-this-song':
            var songName = userInput;            
            spotifyThis(songName);
        break;

        case 'movie-this':
            movieName = userInput;
            movieThis(movieName);
        break;

        case 'do-what-it-says': 
            runThis();
        break;

        default:
            console.log("please enter a command")
};
function concertThis(artist) {
    if (artist == null) {
        artist = "Sabaton";
    }
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (response)  {
        console.log('***************************************');    
        console.log('venue:' + response.venue.name);
        console.log('city: ' + response.venue.city);
        console.log('date and time :' + response.datetime);
        console.log('***************************************');
        }
    )
}

function spotifyThis(songName) {
    var spotify = new spotifyAPI ({
        id: sKeys.spotifyKeys.client_id,
        secret: sKeys.spotifyKeys.client_secret
    });
    if (songName == null) {
        songName = 'Bismark';
    }
    var parameters = songName;
    spotify.search({ type: 'track', query: parameters }, function( data) {
          for (var i = 0; i < data.tracks.items.length; i++) {
            var artists = data.tracks.items[i].artists[0].name;
            var name = data.tracks.items[i].name;
            var preview = data.tracks.items[i].preview_url;
            var album = data.tracks.items[i].album.name;
            console.log('***************************************');
            console.log('Artists: ' + artists);
            console.log('Song Name: '+ name);
            console.log('Preview URL: '+ preview);
            console.log('Album Name: '+ album);
            console.log('***************************************');
          }  
    })
}

function movieThis(movieName) {
    if (movieName == null) {
        movieName = '';
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function( response, body) {
    if (response.statusCode === 200) {
        console.log('***************************************');
        console.log("Title: " + JSON.parse(body).Title);
        console.log("The move came out in " + JSON.parse(body).Year);
        console.log("IMDB rating is: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
        console.log("County produced in: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Synopsis: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log('***************************************');
    } 
    });
}

function runThis() {
    fileSystem.readFile('random.txt', 'utf8', function(data) {
            var getData = data.split(","); 
            userVariable = getData[0]; 
            userInput = getData[1];
            switch (userVariable) {

            case 'spotify-this-song':
                var songName = userInput;            
                spotifyThis(songName);
            break;

            case 'movie-this':
                movieName = userInput;
                movieThis(movieName);
            break;

            case 'do-what-it-says': 
            runThis();
            break;

            default:
                console.log("please enter a command")
        }
    })
}