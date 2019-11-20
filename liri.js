//require & import  modules
let dotenv = require("dotenv").config();
let axios = require('axios');
let spotify = require('node-spotify-api');
let moment = require('moment');
let keys = require("./keys.js");

let spotifyKey = new spotify(keys.spotify);

// Store all of the arguments in an array
const nodeArgs = process.argv;

// Create an empty variable for holding the movie name
let searchTerm = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (let i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        searchTerm = searchTerm + "+" + nodeArgs[i];
    } else {
        searchTerm += nodeArgs[i];

    }
}
console.log(searchTerm);


//commands to code:

if (process.argv[2] == "concert-this") {
    // node liri.js concert-this <artist/band name here>  
    //     This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    //     Name of the venue
    //     Venue location
    //     Date of the Event (use moment to format this as “MM/DD/YYYY”)

    // let artist = process.argv[3];

    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
        .then(function(response) {
            console.log("Response length = " + response.data.length);
            for (let i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                if (response.data[i].venue.region == '') {
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                } else {
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
                };
                console.log("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY'));
            }
            //       console.log(response);
            //        console.log(response.data);
        }).catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}


if (process.argv[2] == "spotify-this-song") {
    // node liri.js spotify-this-song  '<song name here>'
    //   This will show the following information about the song in your terminal/bash window
    //   Artist(s)
    //   The song’s name
    //   A preview link of the song from Spotify
    //   The album that the song is from
    //   If no song is provided then your program will default to “The Sign” by Ace of Base.


    // let song = process.argv[3];
    // let searchSong = function({ type: track, query: song }, callback);

    // spotify.searchSong({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    //     if (err) {
    //         return console.log('Error occurred: ' + err);
    //     }

    //     console.log(data);
    //     console.log("Spotify data length = " + data.length);
    //     // for (let i=0;i<data.length; i++) {
    //     //       console.log("Venue: " + data[i].venue.name);
    //     //       if (data[i].venue.region == '') {
    //     //       console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);               
    //     //       } else {
    //     //       console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region);               
    //     //       };
    //     //       console.log("Date: " + moment(data[i].datetime).format('MM/DD/YYYY'));
    //     //   }

    // });


}

if (process.argv[2] == "movie-this") {
    // node liri.js movie-this '<movie name here>'

    //    This will output the following information to your terminal/bash window:
    //    * Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Rotten Tomatoes Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.
    //    If the user doesn’t type a movie in, the program will output data for the movie ‘Mr. Nobody.’
    // let movie = process.argv[3];


    // Then run a request with axios to the OMDB API with the movie specified
    axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy").then(
            function(response) {
                // console.log(response.data);
                // let ratings = JSON.parse(response.data.Ratings[0]);
                // console.log("Parsed obj = " + ratings);
                console.log("----------------------------------------------------");
                console.log("Movie Title           : " + response.data.Title);
                console.log("Year Released         : " + response.data.Year);
                console.log("IMDB rating           : " + response.data.imdbRating);
                // console.log("ratings Source length = " + response.data.Ratings.length);
                // if (response.data.Ratings.length == 0) {
                //     console.log("Rotten Tomatoes rating: Not available");
                // }
                // else {
                //     for (let i = 0; i < response.data.Ratings.length; i++) {
                //         let ratings = JSON.parse(response.data);
                //         // console.log("Parsed obj = " + ratings);
                //         // console.log("Source = " + ratings.Source[i]);
                //         if (response.data.Ratings.Source[i] == "Rotten Tomatoes") {
                //             console.log("Rotten Tomatoes rating: " + response.data.Ratings.Source[i].Value);
                //         }
                //     }
                // };
                console.log("Produced in           : " + response.data.Country);
                console.log("Language              : " + response.data.Language);
                console.log("Plot                  : " + response.data.Plot);
                console.log("Movie Actors          : " + response.data.Actors);
                console.log("----------------------------------------------------");


            })
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

}

if (process.argv[2] == "do-what-it-says") {

    // node liri.js do-what-it-says
    //    Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI’s commands.
    //    It should run spotify-this-song for “I Want it That Way,” as follows the text in random.txt.
    //    Edit the text in random.txt to test out the feature for movie-this and concert-this.
    // let variable = process.argv[3];

    // axios.get("https://rest.bandsintown.com/artists/" + variable + "/events?app_id=codingbootcamp")
    //     .then(function (response) {
    //         console.log("Response length = " + response.data.length);
    //     for (let i=0;i<response.data.length; i++) {
    //           console.log("Venue: " + response.data[i].venue.name);
    //           if (response.data[i].venue.region == '') {
    //           console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);               
    //           } else {
    //           console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);               
    //           };
    //           console.log("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY'));
    //       }
    // //       console.log(response);
    // //        console.log(response.data);
    //     }).catch(function(error) {
    //     if (error.response) {
    //       // The request was made and the server responded with a status code
    //       // that falls out of the range of 2xx
    //       console.log(error.response.data);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       // `error.request` is an object that comes back with details pertaining to the error that occurred.
    //       console.log(error.request);
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log("Error", error.message);
    //     }
    //     console.log(error.config);
    //   });

}
//BONUS:  
//    In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
//    Make sure you append each command you run to the log.txt file.
//    Do not overwrite your file each time you run a command.